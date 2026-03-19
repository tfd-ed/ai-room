<script setup lang="ts">
// Declare global Chart and Plotly (loaded from CDN)
declare global {
    interface Window {
        Chart: any
        Plotly: any
    }
}

const { t } = useI18n()
const colorMode = useColorMode()

// Computed colors that adapt to the current color mode
const chartColors = computed(() => {
    const isDark = colorMode.value === 'dark'
    return {
        text: isDark ? '#9ca3af' : '#6b7280',
        grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        functionLine: isDark ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)',
        functionBg: isDark ? 'rgba(156, 163, 175, 0.1)' : 'rgba(75, 85, 99, 0.1)',
        pathLine: 'rgb(239, 68, 68)',
        pathBg: 'rgba(239, 68, 68, 0.8)',
        currentPos: 'rgb(34, 197, 94)',
        loss: 'rgb(59, 130, 246)',
        lossBg: 'rgba(59, 130, 246, 0.1)',
    }
})

// Component data
const learningRate = ref(0.1)
const selectedFunction = ref('quadratic')
const currentX = ref(5)
const currentY = ref(3)
const iteration = ref(0)
const history = ref<Array<{ x: number; y: number; loss: number }>>([])
const lossHistory = ref<number[]>([])
const isPlaying = ref(false)
const playInterval = ref<ReturnType<typeof setInterval> | null>(null)
const mainChart = ref<any>(null)
const lossChart = ref<any>(null)
const convergenceThreshold = 0.0001
const maxIterations = 1000
const useGradientClipping = true
const maxGradientNorm = 10.0

// DOM refs
const mainChartCanvas = ref<HTMLCanvasElement | null>(null)
const plot3DContainer = ref<HTMLDivElement | null>(null)
const lossChartCanvas = ref<HTMLCanvasElement | null>(null)
const formulaDisplay = ref<HTMLDivElement | null>(null)

// Recommended learning rates for each function
const recommendedLearningRates: Record<string, number> = {
    quadratic: 0.1,
    complex: 0.1,
    localMinima: 0.05,
    steepValley: 0.1,
    ravine: 0.05,
    saddle: 0.1,
    rosenbrock: 0.001,
    beale: 0.001,
}

// Computed properties
const currentLoss = computed(() => computeLoss(currentX.value, currentY.value))
const currentGradient = computed(() => {
    const is2D = ['ravine', 'saddle', 'rosenbrock', 'beale'].includes(selectedFunction.value)
    if (is2D) {
        const [gx, gy] = computeGradient(currentX.value, currentY.value) as [number, number]
        return Math.sqrt(gx * gx + gy * gy)
    }
    return Math.abs(computeGradient(currentX.value, currentY.value) as number)
})

const isConverged = computed(() =>
    Math.abs(currentGradient.value) < convergenceThreshold || iteration.value >= maxIterations
)

const isDiverged = computed(() =>
    Math.abs(currentX.value) > 50 ||
    Math.abs(currentY.value) > 50 ||
    Math.abs(currentLoss.value) > 1000
)

const is2DFunction = computed(() =>
    ['ravine', 'saddle', 'rosenbrock', 'beale'].includes(selectedFunction.value)
)

const recommendedLR = computed(() =>
    recommendedLearningRates[selectedFunction.value] || 0.1
)

// Function formulas in LaTeX
const functionFormulas: Record<string, string> = {
    quadratic: 'f(x) = x^2',
    complex: 'f(x) = x^2 + 0.5\\sin(4x)',
    localMinima: 'f(x) = x^4 - 3x^3 + 2x',
    steepValley: 'f(x) = \\frac{x^4}{100} - x^2',
    ravine: 'f(x,y) = \\frac{x^2}{2} + 10y^2',
    saddle: 'f(x,y) = x^2 - y^2',
    rosenbrock: 'f(x,y) = (1-x)^2 + 100(y-x^2)^2',
    beale: 'f(x,y) = (1.5-x+xy)^2 + (2.25-x+xy^2)^2 + (2.625-x+xy^3)^2',
}

const currentFormula = computed(() => functionFormulas[selectedFunction.value] || '')

// Methods
function computeLoss(x: number, y: number = 0): number {
    switch (selectedFunction.value) {
        case 'quadratic':
            return x * x
        case 'complex':
            return x * x + 0.5 * Math.sin(4 * x)
        case 'localMinima':
            return x * x * x * x - 3 * x * x * x + 2 * x
        case 'steepValley':
            return (x * x * x * x) / 100 - x * x
        case 'ravine':
            return (x * x) / 2 + 10 * y * y
        case 'saddle':
            return x * x - y * y
        case 'rosenbrock':
            return Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2)
        case 'beale':
            return (
                Math.pow(1.5 - x + x * y, 2) +
                Math.pow(2.25 - x + x * y * y, 2) +
                Math.pow(2.625 - x + x * y * y * y, 2)
            )
        default:
            return x * x
    }
}

function computeGradient(x: number, y: number = 0): number | [number, number] {
    switch (selectedFunction.value) {
        case 'quadratic':
            return 2 * x
        case 'complex':
            return 2 * x + 2 * Math.cos(4 * x)
        case 'localMinima':
            return 4 * x * x * x - 9 * x * x + 2
        case 'steepValley':
            return (4 * x * x * x) / 100 - 2 * x
        case 'ravine':
            return [x, 20 * y]
        case 'saddle':
            return [2 * x, -2 * y]
        case 'rosenbrock': {
            const gx = -2 * (1 - x) - 400 * x * (y - x * x)
            const gy = 200 * (y - x * x)
            return [gx, gy]
        }
        case 'beale': {
            const bx =
                2 * (1.5 - x + x * y) * (-1 + y) +
                2 * (2.25 - x + x * y * y) * (-1 + y * y) +
                2 * (2.625 - x + x * y * y * y) * (-1 + y * y * y)
            const by =
                2 * (1.5 - x + x * y) * x +
                2 * (2.25 - x + x * y * y) * (2 * x * y) +
                2 * (2.625 - x + x * y * y * y) * (3 * x * y * y)
            return [bx, by]
        }
        default:
            return 2 * x
    }
}

function step() {
    if (isConverged.value || isDiverged.value) return

    const is2D = is2DFunction.value

    let gx: number, gy: number = 0
    if (is2D) {
        [gx, gy] = computeGradient(currentX.value, currentY.value) as [number, number]

        // Apply gradient clipping if enabled
        if (useGradientClipping) {
            const gradNorm = Math.sqrt(gx * gx + gy * gy)
            if (gradNorm > maxGradientNorm) {
                const scale = maxGradientNorm / gradNorm
                gx *= scale
                gy *= scale
            }
        }

        currentX.value -= learningRate.value * gx
        currentY.value -= learningRate.value * gy
    } else {
        gx = computeGradient(currentX.value) as number

        // Apply gradient clipping for 1D
        if (useGradientClipping) {
            const gradNorm = Math.abs(gx)
            if (gradNorm > maxGradientNorm) {
                gx = (gx / gradNorm) * maxGradientNorm
            }
        }

        currentX.value -= learningRate.value * gx
    }

    iteration.value++
    history.value.push({
        x: currentX.value,
        y: currentY.value,
        loss: currentLoss.value,
    })
    lossHistory.value.push(currentLoss.value)
    updateCharts()

    if (isConverged.value || isDiverged.value) {
        stopPlay()
    }
}

function runSteps(n: number) {
    for (let i = 0; i < n && !isConverged.value && !isDiverged.value; i++) {
        step()
    }
}

function togglePlay() {
    if (isPlaying.value) {
        stopPlay()
    } else {
        startPlay()
    }
}

function startPlay() {
    isPlaying.value = true
    playInterval.value = setInterval(() => {
        step()
    }, 100)
}

function stopPlay() {
    isPlaying.value = false
    if (playInterval.value) {
        clearInterval(playInterval.value)
        playInterval.value = null
    }
}

function reset() {
    stopPlay()
    // Set initial positions based on function type
    const initialPositions: Record<string, { x: number; y: number }> = {
        quadratic: { x: 5, y: 0 },
        complex: { x: 5, y: 0 },
        localMinima: { x: 3, y: 0 },
        steepValley: { x: 3, y: 0 },
        ravine: { x: 5, y: 3 },
        saddle: { x: 3, y: 3 },
        rosenbrock: { x: -1.5, y: 2.5 },
        beale: { x: 1, y: 1 },
    }
    const pos = initialPositions[selectedFunction.value] || { x: 5, y: 0 }
    currentX.value = pos.x
    currentY.value = pos.y
    iteration.value = 0
    history.value = [{ x: currentX.value, y: currentY.value, loss: currentLoss.value }]
    lossHistory.value = [currentLoss.value]
    updateCharts()
}

function setLearningRate(rate: number) {
    learningRate.value = rate
    reset()
}

function initCharts() {
    if (!window.Chart || !window.Plotly) {
        console.error('Chart.js or Plotly not loaded yet')
        return
    }

    if (!lossChartCanvas.value) {
        console.error('Canvas refs not found')
        return
    }

    // Main chart (function visualization) - only for 1D functions
    if (!is2DFunction.value && mainChartCanvas.value) {
        const mainCtx = mainChartCanvas.value.getContext('2d')
        if (mainCtx) {
            const colors = chartColors.value
            mainChart.value = markRaw(
                new window.Chart(mainCtx, {
                    type: 'line',
                    data: { datasets: [] },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'linear',
                                title: { display: true, text: 'x', color: colors.text },
                                grid: { color: colors.grid },
                                ticks: { color: colors.text }
                            },
                            y: {
                                type: 'linear',
                                title: { display: true, text: 'f(x)', color: colors.text },
                                grid: { color: colors.grid },
                                ticks: { color: colors.text }
                            },
                        },
                        plugins: {
                            legend: { display: true, labels: { color: colors.text } },
                            tooltip: { mode: 'nearest', intersect: false },
                        },
                        animation: { duration: 200 },
                    },
                }),
            )
        }
    }

    // Loss chart
    const lossCtx = lossChartCanvas.value.getContext('2d')
    if (lossCtx) {
        const colors = chartColors.value
        lossChart.value = markRaw(
            new window.Chart(lossCtx, {
                type: 'line',
                data: {
                    labels: [0],
                    datasets: [
                        {
                            label: 'Loss',
                            data: [currentLoss.value],
                            borderColor: colors.loss,
                            backgroundColor: colors.lossBg,
                            tension: 0.4,
                            fill: true,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: { display: true, text: 'Iteration', color: colors.text },
                            grid: { color: colors.grid },
                            ticks: { color: colors.text }
                        },
                        y: {
                            title: { display: true, text: 'Loss', color: colors.text },
                            beginAtZero: true,
                            grid: { color: colors.grid },
                            ticks: { color: colors.text }
                        },
                    },
                    plugins: {
                        legend: { display: false },
                    },
                    animation: { duration: 200 },
                },
            }),
        )
    }
}

function updateCharts() {
    if (is2DFunction.value) {
        update3DPlot()
    } else {
        update2DChart()
    }
    updateLossChart()
}

function update2DChart() {
    if (!mainChart.value) return

    const rangeConfig: Record<string, { min: number; max: number; points: number }> = {
        quadratic: { min: -10, max: 10, points: 200 },
        complex: { min: -10, max: 10, points: 200 },
        localMinima: { min: -2, max: 4, points: 200 },
        steepValley: { min: -3, max: 3, points: 200 },
    }
    const config = rangeConfig[selectedFunction.value] || { min: -10, max: 10, points: 200 }
    const xRange = Array.from(
        { length: config.points },
        (_, i) => config.min + (i * (config.max - config.min)) / (config.points - 1),
    )

    const functionData = xRange.map((x) => ({ x: x, y: computeLoss(x, 0) }))
    const rawHistory = toRaw(history.value)
    const pathData = rawHistory.map((point) => ({ x: point.x, y: point.loss }))
    const colors = chartColors.value

    mainChart.value.data.datasets = [
        {
            label: 'Cost Function',
            data: functionData,
            borderColor: colors.functionLine,
            backgroundColor: colors.functionBg,
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
        },
        {
            label: 'Gradient Descent Path',
            data: pathData,
            borderColor: colors.pathLine,
            backgroundColor: colors.pathBg,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            showLine: true,
            tension: 0,
        },
        {
            label: 'Current Position',
            data: [{ x: currentX.value, y: currentLoss.value }],
            borderColor: colors.currentPos,
            backgroundColor: colors.currentPos,
            pointRadius: 8,
            pointHoverRadius: 10,
            showLine: false,
        },
    ]
    mainChart.value.update()
}

function update3DPlot() {
    if (!plot3DContainer.value || !window.Plotly) return

    const rangeConfig: Record<string, { min: number; max: number; points: number }> = {
        ravine: { min: -6, max: 6, points: 50 },
        saddle: { min: -5, max: 5, points: 50 },
        rosenbrock: { min: -2, max: 2, points: 50 },
        beale: { min: -4.5, max: 4.5, points: 50 },
    }
    const plotConfig = rangeConfig[selectedFunction.value] || { min: -5, max: 5, points: 50 }

    const xRange = Array.from(
        { length: plotConfig.points },
        (_, i) => plotConfig.min + (i * (plotConfig.max - plotConfig.min)) / (plotConfig.points - 1),
    )
    const yRange = Array.from(
        { length: plotConfig.points },
        (_, i) => plotConfig.min + (i * (plotConfig.max - plotConfig.min)) / (plotConfig.points - 1),
    )

    const zData = yRange.map((y) => xRange.map((x) => computeLoss(x, y)))

    const rawHistory = toRaw(history.value)
    const pathX = rawHistory.map((p) => p.x)
    const pathY = rawHistory.map((p) => p.y)
    const pathZ = rawHistory.map((p) => p.loss)
    const colors = chartColors.value

    const surfaceTrace = {
        type: 'surface',
        x: xRange,
        y: yRange,
        z: zData,
        colorscale: 'Viridis',
        opacity: 0.8,
        showscale: true,
        name: 'Cost Function',
    }

    const pathTrace = {
        type: 'scatter3d',
        mode: 'lines+markers',
        x: pathX,
        y: pathY,
        z: pathZ,
        line: { color: 'red', width: 4 },
        marker: { size: 4, color: 'red' },
        name: 'Gradient Descent Path',
    }

    const currentPosTrace = {
        type: 'scatter3d',
        mode: 'markers',
        x: [currentX.value],
        y: [currentY.value],
        z: [currentLoss.value],
        marker: { size: 10, color: 'lime', symbol: 'circle' },
        name: 'Current Position',
    }

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        scene: {
            xaxis: { title: 'x', gridcolor: colors.grid, color: colors.text },
            yaxis: { title: 'y', gridcolor: colors.grid, color: colors.text },
            zaxis: { title: 'f(x,y)', gridcolor: colors.grid, color: colors.text },
            camera: { eye: { x: 1.5, y: 1.5, z: 1.3 } },
            bgcolor: 'rgba(0,0,0,0)',
        },
        margin: { l: 0, r: 0, t: 0, b: 0 },
        showlegend: true,
        legend: { x: 0, y: 1, font: { color: colors.text } },
    }

    const plotlyConfig = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
    }

    window.Plotly.newPlot(
        plot3DContainer.value,
        [surfaceTrace, pathTrace, currentPosTrace],
        layout,
        plotlyConfig,
    )
}

function updateLossChart() {
    if (!lossChart.value) return

    const rawLossHistory = toRaw(lossHistory.value)
    lossChart.value.data.labels = Array.from({ length: rawLossHistory.length }, (_, i) => i)
    lossChart.value.data.datasets[0].data = [...rawLossHistory]
    lossChart.value.update()
}

function renderFormula() {
    if (!formulaDisplay.value || !currentFormula.value) return

    // Check if katex is available globally
    if (typeof window !== 'undefined' && (window as any).katex) {
        try {
            (window as any).katex.render(currentFormula.value, formulaDisplay.value, {
                throwOnError: false,
                displayMode: false  // Inline mode for better display next to label
            })
        } catch (error) {
            console.error('Error rendering formula:', error)
            formulaDisplay.value.textContent = currentFormula.value
        }
    } else {
        // Fallback: just display the LaTeX source
        formulaDisplay.value.textContent = currentFormula.value
    }
}

// Watch for function changes
watch(selectedFunction, async (newFunc, oldFunc) => {
    // Auto-adjust learning rate if it's wildly inappropriate
    const recommended = recommendedLearningRates[newFunc]
    if (recommended && Math.abs(learningRate.value / recommended) > 50) {
        learningRate.value = recommended
    }

    // Check if we're switching between 1D and 2D functions
    const was2D = ['ravine', 'saddle', 'rosenbrock', 'beale'].includes(oldFunc)
    const is2D = ['ravine', 'saddle', 'rosenbrock', 'beale'].includes(newFunc)

    if (was2D !== is2D) {
        await nextTick()
        if (is2D) {
            // Destroy 2D chart if it exists
            if (mainChart.value) {
                mainChart.value.destroy()
                mainChart.value = null
            }
        } else {
            // Switched to 1D, need to create 2D chart
            if (mainChartCanvas.value && window.Chart) {
                const mainCtx = mainChartCanvas.value.getContext('2d')
                if (mainCtx) {
                    const colors = chartColors.value
                    mainChart.value = markRaw(
                        new window.Chart(mainCtx, {
                            type: 'line',
                            data: { datasets: [] },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        type: 'linear',
                                        title: { display: true, text: 'x', color: colors.text },
                                        grid: { color: colors.grid },
                                        ticks: { color: colors.text }
                                    },
                                    y: {
                                        type: 'linear',
                                        title: { display: true, text: 'f(x)', color: colors.text },
                                        grid: { color: colors.grid },
                                        ticks: { color: colors.text }
                                    },
                                },
                                plugins: {
                                    legend: { display: true, labels: { color: colors.text } },
                                    tooltip: { mode: 'nearest', intersect: false },
                                },
                                animation: { duration: 200 },
                            },
                        }),
                    )
                }
            }
        }
    }

    reset()
})

// Watch for formula changes to re-render
watch(currentFormula, () => {
    nextTick(() => {
        renderFormula()
    })
})

// Watch for color mode changes and update chart colors
watch(() => colorMode.value, () => {
    if (mainChart.value) {
        const colors = chartColors.value
        // Update main chart colors
        if (mainChart.value.options?.scales?.x) {
            mainChart.value.options.scales.x.title.color = colors.text
            mainChart.value.options.scales.x.grid.color = colors.grid
            mainChart.value.options.scales.x.ticks.color = colors.text
        }
        if (mainChart.value.options?.scales?.y) {
            mainChart.value.options.scales.y.title.color = colors.text
            mainChart.value.options.scales.y.grid.color = colors.grid
            mainChart.value.options.scales.y.ticks.color = colors.text
        }
        if (mainChart.value.options?.plugins?.legend?.labels) {
            mainChart.value.options.plugins.legend.labels.color = colors.text
        }
    }

    if (lossChart.value) {
        const colors = chartColors.value
        // Update loss chart colors
        if (lossChart.value.options?.scales?.x) {
            lossChart.value.options.scales.x.title.color = colors.text
            lossChart.value.options.scales.x.grid.color = colors.grid
            lossChart.value.options.scales.x.ticks.color = colors.text
        }
        if (lossChart.value.options?.scales?.y) {
            lossChart.value.options.scales.y.title.color = colors.text
            lossChart.value.options.scales.y.grid.color = colors.grid
            lossChart.value.options.scales.y.ticks.color = colors.text
        }
        if (lossChart.value.data?.datasets?.[0]) {
            lossChart.value.data.datasets[0].borderColor = colors.loss
            lossChart.value.data.datasets[0].backgroundColor = colors.lossBg
        }
    }

    // Update all charts
    updateCharts()
})

// Lifecycle hooks
onMounted(async () => {
    // Wait for scripts to load
    let attempts = 0
    const maxAttempts = 50
    const checkInterval = setInterval(() => {
        attempts++
        if (window.Chart && window.Plotly) {
            clearInterval(checkInterval)

            // Initialize history with starting position
            const initialLoss = computeLoss(currentX.value, currentY.value)
            history.value = [{ x: currentX.value, y: currentY.value, loss: initialLoss }]
            lossHistory.value = [initialLoss]

            nextTick(() => {
                try {
                    initCharts()
                    updateCharts()
                    renderFormula()
                } catch (error) {
                    console.error('Error initializing charts:', error)
                }
            })
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval)
            console.error('Chart.js and Plotly failed to load')
        }
    }, 100)
})
</script>

<template>
    <div class="my-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Controls Panel -->
            <div class="lg:col-span-1">
                <div class="bg-bg-card border border-border rounded-lg p-6">
                    <h2 class="text-2xl font-semibold mb-4 text-text">
                        {{ t('interactiveDemo.controls.title') }}
                    </h2>

                    <!-- Learning Rate Control -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('interactiveDemo.controls.learningRate') }}:
                            <span class="text-blue-600 dark:text-blue-400 font-bold">{{ learningRate.toFixed(3)
                            }}</span>
                        </label>
                        <input type="range" v-model.number="learningRate" min="0.001" max="1" step="0.001"
                            class="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-lg appearance-none cursor-pointer" />
                        <div class="flex justify-between text-xs text-text-secondary mt-1">
                            <span>0.001</span>
                            <span>0.5</span>
                            <span>1.0</span>
                        </div>
                        <div class="mt-2 flex items-center justify-between text-xs">
                            <span class="text-gray-600 dark:text-gray-400">
                                {{ t('interactiveDemo.controls.recommended') }}:
                                <span class="font-semibold text-green-600 dark:text-green-400">{{
                                    recommendedLR.toFixed(3) }}</span>
                            </span>
                            <button @click="learningRate = recommendedLR"
                                class="text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded transition-colors">
                                {{ t('interactiveDemo.controls.useRecommended') }}
                            </button>
                        </div>
                        <div v-if="Math.abs(learningRate / recommendedLR) > 10"
                            class="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded text-xs text-yellow-800 dark:text-yellow-300">
                            ⚠️ {{ t('interactiveDemo.controls.learningRateWarning') }}
                        </div>
                    </div>

                    <!-- Function Selection -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-text-secondary mb-2">
                            {{ t('interactiveDemo.controls.costFunction') }}
                        </label>
                        <select v-model="selectedFunction" @change="reset"
                            class="w-full p-2 border border-border rounded-lg bg-bg text-text">
                            <option value="quadratic">{{ t('interactiveDemo.functions.quadratic') }}</option>
                            <option value="complex">{{ t('interactiveDemo.functions.complex') }}</option>
                            <option value="localMinima">{{ t('interactiveDemo.functions.localMinima') }}</option>
                            <option value="steepValley">{{ t('interactiveDemo.functions.steepValley') }}</option>
                            <option value="ravine">{{ t('interactiveDemo.functions.ravine') }}</option>
                            <option value="saddle">{{ t('interactiveDemo.functions.saddle') }}</option>
                            <option value="rosenbrock">{{ t('interactiveDemo.functions.rosenbrock') }}</option>
                            <option value="beale">{{ t('interactiveDemo.functions.beale') }}</option>
                        </select>
                    </div>

                    <!-- Action Buttons -->
                    <div class="grid grid-cols-2 gap-3 mb-6">
                        <button @click="step" :disabled="isConverged || isPlaying"
                            class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                            {{ t('interactiveDemo.controls.step') }}
                        </button>
                        <button @click="togglePlay" :disabled="isConverged"
                            :class="isPlaying ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'"
                            class="disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                            {{ isPlaying ? t('interactiveDemo.controls.pause') : t('interactiveDemo.controls.play') }}
                        </button>
                        <button @click="runSteps(10)" :disabled="isConverged || isPlaying"
                            class="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                            {{ t('interactiveDemo.controls.tenSteps') }}
                        </button>
                        <button @click="reset"
                            class="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                            {{ t('interactiveDemo.controls.reset') }}
                        </button>
                    </div>

                    <!-- Statistics -->
                    <div class="bg-bg-secondary rounded-lg p-4 space-y-2">
                        <h3 class="font-semibold text-text mb-3">
                            {{ t('interactiveDemo.statistics.title') }}
                        </h3>
                        <div class="flex justify-between text-sm">
                            <span class="text-text-secondary">{{ t('interactiveDemo.statistics.iterations') }}:</span>
                            <span class="font-mono font-semibold text-text">{{ iteration }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-text-secondary">{{ t('interactiveDemo.statistics.positionX') }}:</span>
                            <span class="font-mono font-semibold text-text">{{ currentX.toFixed(4) }}</span>
                        </div>
                        <div v-if="is2DFunction" class="flex justify-between text-sm">
                            <span class="text-text-secondary">{{ t('interactiveDemo.statistics.positionY') }}:</span>
                            <span class="font-mono font-semibold text-text">{{ currentY.toFixed(4) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-text-secondary">{{ t('interactiveDemo.statistics.loss') }}:</span>
                            <span class="font-mono font-semibold text-text">{{ currentLoss.toFixed(6) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-text-secondary">{{ t('interactiveDemo.statistics.gradient') }}:</span>
                            <span class="font-mono font-semibold text-text">{{ currentGradient.toFixed(4) }}</span>
                        </div>
                        <div v-if="isConverged"
                            class="mt-3 p-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded text-green-700 dark:text-green-300 text-sm text-center">
                            ✓ {{ t('interactiveDemo.statistics.converged') }}
                        </div>
                        <div v-if="isDiverged"
                            class="mt-3 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-300 text-sm text-center">
                            ✗ {{ t('interactiveDemo.statistics.diverged') }}
                        </div>
                    </div>

                    <!-- Quick Presets -->
                    <div class="mt-6">
                        <h3 class="font-semibold text-text mb-3">
                            {{ t('interactiveDemo.presets.title') }}
                        </h3>
                        <div class="grid grid-cols-2 gap-2">
                            <button @click="setLearningRate(0.01)"
                                class="text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-800 dark:text-purple-300 py-2 px-2 rounded transition-colors">
                                {{ t('interactiveDemo.presets.slow') }}<br />0.01
                            </button>
                            <button @click="setLearningRate(0.1)"
                                class="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-300 py-2 px-2 rounded transition-colors">
                                {{ t('interactiveDemo.presets.good') }}<br />0.1
                            </button>
                            <button @click="setLearningRate(0.5)"
                                class="text-xs bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800 text-orange-800 dark:text-orange-300 py-2 px-2 rounded transition-colors">
                                {{ t('interactiveDemo.presets.fast') }}<br />0.5
                            </button>
                            <button @click="learningRate = recommendedLR"
                                class="text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-800 dark:text-green-300 py-2 px-2 rounded font-semibold transition-colors">
                                {{ t('interactiveDemo.presets.recommended') }}<br />{{ recommendedLR.toFixed(3) }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Visualization Panel -->
            <div class="lg:col-span-2">
                <div class="bg-bg-card border border-border rounded-lg p-6 mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-2xl font-semibold text-text">
                            {{ t('interactiveDemo.charts.mainChart') }}
                        </h2>
                        <!-- Display math formula inline with heading -->
                        <div v-if="currentFormula" ref="formulaDisplay" class="katex-formula-inline"></div>
                    </div>
                    <div class="relative" style="height: 400px">
                        <canvas ref="mainChartCanvas" v-show="!is2DFunction"
                            style="position: absolute; width: 100%; height: 100%;"></canvas>
                        <div ref="plot3DContainer" v-show="is2DFunction"
                            style="position: absolute; width: 100%; height: 100%;"></div>
                    </div>
                </div>

                <div class="bg-bg-card border border-border rounded-lg p-6">
                    <h2 class="text-2xl font-semibold mb-4 text-text">
                        {{ t('interactiveDemo.charts.lossChart') }}
                    </h2>
                    <div class="relative" style="height: 300px">
                        <canvas ref="lossChartCanvas"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Information Panel -->
        <div class="mt-8 bg-bg-card border border-border rounded-lg p-6">
            <h2 class="text-2xl font-semibold mb-4 text-text">
                {{ t('interactiveDemo.info.title') }}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-300">
                <div class="border-l-4 border-purple-500 pl-4">
                    <h3 class="font-semibold text-purple-700 dark:text-purple-400 mb-2">
                        {{ t('interactiveDemo.info.tooLow.title') }}
                    </h3>
                    <p>{{ t('interactiveDemo.info.tooLow.desc') }}</p>
                </div>
                <div class="border-l-4 border-green-500 pl-4">
                    <h3 class="font-semibold text-green-700 dark:text-green-400 mb-2">
                        {{ t('interactiveDemo.info.optimal.title') }}
                    </h3>
                    <p>{{ t('interactiveDemo.info.optimal.desc') }}</p>
                </div>
                <div class="border-l-4 border-red-500 pl-4">
                    <h3 class="font-semibold text-red-700 dark:text-red-400 mb-2">
                        {{ t('interactiveDemo.info.tooHigh.title') }}
                    </h3>
                    <p>{{ t('interactiveDemo.info.tooHigh.desc') }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.katex-formula {
    font-size: 1.1em;
}

.katex-formula :deep(.katex) {
    font-size: 1em;
}

.katex-formula-inline {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: white;
    border-radius: 0.375rem;
    font-size: 1.25rem;
}

:deep(.dark) .katex-formula-inline {
    background: white;
}

.katex-formula-inline :deep(.katex) {
    color: black;
}

:deep(.dark) .katex-formula-inline :deep(.katex) {
    color: black;
}
</style>
