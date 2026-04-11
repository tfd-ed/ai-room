<script setup lang="ts">
declare global {
    interface Window {
        Chart: any
        Plotly: any
    }
}

const { t } = useI18n()
const colorMode = useColorMode()

const chartColors = computed(() => {
    const isDark = colorMode.value === 'dark'
    return {
        text: isDark ? '#9ca3af' : '#6b7280',
        grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        sgd: '#ef4444',
        momentum: '#3b82f6',
        rmsprop: '#a855f7',
        adam: '#22c55e',
    }
})

// Hyperparameters — shared across all optimizers so the comparison is fair
const alpha = ref(0.1)
const beta1 = ref(0.9)
const beta2 = ref(0.999)
const EPS = 1e-8

const selectedFunction = ref<'ravine' | 'rosenbrock'>('ravine')

const showSGD = ref(true)
const showMomentum = ref(true)
const showRMSProp = ref(true)
const showAdam = ref(true)

const START: Record<string, [number, number]> = {
    ravine: [5, 3],
    rosenbrock: [-1.5, 2.5],
}

type OptimizerState = {
    x: number
    y: number
    pathX: number[]
    pathY: number[]
    lossHistory: number[]
    mx: number
    my: number
    vx: number
    vy: number
    t: number
    diverged: boolean
}

function makeState(fn: string): OptimizerState {
    const [x, y] = (START[fn] ?? [0, 0]) as [number, number]
    return {
        x, y,
        pathX: [x], pathY: [y],
        lossHistory: [computeLoss(fn, x, y)],
        mx: 0, my: 0, vx: 0, vy: 0, t: 0,
        diverged: false,
    }
}

const sgdState = ref<OptimizerState>(makeState('ravine'))
const momState = ref<OptimizerState>(makeState('ravine'))
const rmsState = ref<OptimizerState>(makeState('ravine'))
const adamState = ref<OptimizerState>(makeState('ravine'))

const iteration = ref(0)
const isPlaying = ref(false)
const playInterval = ref<ReturnType<typeof setInterval> | null>(null)
const MAX_ITER = 200

// Adam display values — x-component to mirror the article's "Worked Example"
const dispT = ref(0)
const dispGx = ref(0)
const dispMx = ref(0)
const dispVx = ref(0)
const dispMhatx = ref(0)
const dispVhatx = ref(0)
const dispEffLRx = ref(0)
const dispBias1 = ref(1)
const dispBias2 = ref(1)

const lossChartCanvas = ref<HTMLCanvasElement | null>(null)
const contourDiv = ref<HTMLDivElement | null>(null)
const lossChart = ref<any>(null)
const formulaDisplay = ref<HTMLDivElement | null>(null)

// Function formulas in LaTeX
const functionFormulas: Record<string, string> = {
    ravine: 'f(x,y) = \\frac{x^2}{2} + 10y^2',
    rosenbrock: 'f(x,y) = (1-x)^2 + 100(y-x^2)^2',
}

const currentFormula = computed(() => functionFormulas[selectedFunction.value] || '')

// ── Loss landscape ────────────────────────────────────────────────────────────

function computeLoss(fn: string, x: number, y: number): number {
    if (fn === 'rosenbrock') return (1 - x) ** 2 + 100 * (y - x * x) ** 2
    return x * x / 2 + 10 * y * y   // ravine
}

function computeGrad(fn: string, x: number, y: number): [number, number] {
    if (fn === 'rosenbrock') {
        return [
            -2 * (1 - x) - 400 * x * (y - x * x),
            200 * (y - x * x),
        ]
    }
    return [x, 20 * y]   // ravine
}

// ── Optimizer step helpers ────────────────────────────────────────────────────

function record(s: OptimizerState) {
    const l = computeLoss(selectedFunction.value, s.x, s.y)
    s.pathX.push(s.x)
    s.pathY.push(s.y)
    s.lossHistory.push(l)
    s.t++
    if (!isFinite(l) || l > 1e9 || Math.abs(s.x) > 200 || Math.abs(s.y) > 200) {
        s.diverged = true
    }
}

function stepSGD(s: OptimizerState) {
    if (s.diverged) return
    const [gx, gy] = computeGrad(selectedFunction.value, s.x, s.y)
    s.x -= alpha.value * gx
    s.y -= alpha.value * gy
    record(s)
}

function stepMomentum(s: OptimizerState) {
    if (s.diverged) return
    const [gx, gy] = computeGrad(selectedFunction.value, s.x, s.y)
    // EMA momentum — same formula as Adam's 1st moment (article Step 1)
    s.mx = beta1.value * s.mx + (1 - beta1.value) * gx
    s.my = beta1.value * s.my + (1 - beta1.value) * gy
    s.x -= alpha.value * s.mx
    s.y -= alpha.value * s.my
    record(s)
}

function stepRMSProp(s: OptimizerState) {
    if (s.diverged) return
    const [gx, gy] = computeGrad(selectedFunction.value, s.x, s.y)
    // Running average of squared gradients (article Step 2, no bias correction)
    s.vx = beta2.value * s.vx + (1 - beta2.value) * gx * gx
    s.vy = beta2.value * s.vy + (1 - beta2.value) * gy * gy
    s.x -= (alpha.value / (Math.sqrt(s.vx) + EPS)) * gx
    s.y -= (alpha.value / (Math.sqrt(s.vy) + EPS)) * gy
    record(s)
}

function stepAdam(s: OptimizerState) {
    if (s.diverged) return
    const tNext = s.t + 1
    const [gx, gy] = computeGrad(selectedFunction.value, s.x, s.y)

    // Step 1 — 1st moment (momentum)
    s.mx = beta1.value * s.mx + (1 - beta1.value) * gx
    s.my = beta1.value * s.my + (1 - beta1.value) * gy

    // Step 2 — 2nd moment (adaptive scale)
    s.vx = beta2.value * s.vx + (1 - beta2.value) * gx * gx
    s.vy = beta2.value * s.vy + (1 - beta2.value) * gy * gy

    // Step 3 — bias correction
    const b1t = 1 - beta1.value ** tNext
    const b2t = 1 - beta2.value ** tNext
    const mxh = s.mx / b1t
    const myh = s.my / b1t
    const vxh = s.vx / b2t
    const vyh = s.vy / b2t

    // Step 4 — parameter update
    s.x -= (alpha.value / (Math.sqrt(vxh) + EPS)) * mxh
    s.y -= (alpha.value / (Math.sqrt(vyh) + EPS)) * myh

    // Update display panel (x-component mirrors the article worked example)
    dispT.value = tNext
    dispGx.value = gx
    dispMx.value = s.mx
    dispVx.value = s.vx
    dispMhatx.value = mxh
    dispVhatx.value = vxh
    dispEffLRx.value = alpha.value / (Math.sqrt(vxh) + EPS)
    dispBias1.value = b1t
    dispBias2.value = b2t

    record(s)
}

// ── Playback controls ─────────────────────────────────────────────────────────

function step() {
    if (iteration.value >= MAX_ITER) return
    stepSGD(sgdState.value)
    stepMomentum(momState.value)
    stepRMSProp(rmsState.value)
    stepAdam(adamState.value)
    iteration.value++
    updateCharts()
}

function runSteps(n: number) {
    for (let i = 0; i < n && iteration.value < MAX_ITER; i++) step()
}

function togglePlay() {
    isPlaying.value ? stopPlay() : startPlay()
}

function startPlay() {
    isPlaying.value = true
    playInterval.value = setInterval(() => {
        if (iteration.value >= MAX_ITER) { stopPlay(); return }
        step()
    }, 80)
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
    const fn = selectedFunction.value
    sgdState.value = makeState(fn)
    momState.value = makeState(fn)
    rmsState.value = makeState(fn)
    adamState.value = makeState(fn)
    iteration.value = 0
    dispT.value = 0
    dispGx.value = 0
    dispMx.value = 0
    dispVx.value = 0
    dispMhatx.value = 0
    dispVhatx.value = 0
    dispEffLRx.value = 0
    dispBias1.value = 1
    dispBias2.value = 1
    updateCharts()
}

// ── Charts ────────────────────────────────────────────────────────────────────

function update3DPlot() {
    if (!contourDiv.value || !window.Plotly) return
    const fn = selectedFunction.value
    const cfg = fn === 'rosenbrock'
        ? { min: -2.2, max: 2.2, pts: 50, cap: 2000 }
        : { min: -6.5, max: 6.5, pts: 50, cap: 300 }
    const xs = Array.from({ length: cfg.pts }, (_, i) =>
        cfg.min + i * (cfg.max - cfg.min) / (cfg.pts - 1),
    )
    const zz = xs.map(y => xs.map(x => Math.min(computeLoss(fn, x, y), cfg.cap)))
    const c = chartColors.value

    const traces: any[] = [{
        type: 'surface',
        x: xs, y: xs, z: zz,
        colorscale: 'Viridis',
        opacity: 0.8,
        showscale: false,
        hoverinfo: 'skip',
        name: '',
    }]

    type Seg = { state: OptimizerState; color: string; name: string; show: boolean }
    const segs: Seg[] = [
        { state: sgdState.value, color: c.sgd, name: 'SGD', show: showSGD.value },
        { state: momState.value, color: c.momentum, name: 'SGD + Momentum', show: showMomentum.value },
        { state: rmsState.value, color: c.rmsprop, name: 'RMSProp', show: showRMSProp.value },
        { state: adamState.value, color: c.adam, name: 'Adam', show: showAdam.value },
    ]

    for (const seg of segs) {
        if (!seg.show) continue
        const pathZ = seg.state.lossHistory.map(v => Math.min(v, cfg.cap))
        traces.push({
            type: 'scatter3d',
            mode: 'lines',
            x: seg.state.pathX,
            y: seg.state.pathY,
            z: pathZ,
            line: { color: seg.color, width: 4 },
            name: seg.name,
        })
        const last = seg.state.pathX.length - 1
        traces.push({
            type: 'scatter3d',
            mode: 'markers',
            x: [seg.state.pathX[last]],
            y: [seg.state.pathY[last]],
            z: [pathZ[last]],
            marker: { size: 5, color: seg.color, symbol: 'circle', line: { color: 'white', width: 1 } },
            showlegend: false,
            hoverinfo: 'skip',
        })
    }

    window.Plotly.react(
        contourDiv.value,
        traces,
        {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            scene: {
                xaxis: { title: 'x', color: c.text, gridcolor: c.grid, zerolinecolor: c.grid },
                yaxis: { title: 'y', color: c.text, gridcolor: c.grid, zerolinecolor: c.grid },
                zaxis: { title: 'Loss', color: c.text, gridcolor: c.grid },
                camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } },
                bgcolor: 'rgba(0,0,0,0)',
            },
            margin: { l: 0, r: 0, t: 20, b: 0 },
            legend: { x: 0, y: 1, bgcolor: 'rgba(0,0,0,0.35)', font: { color: '#fff', size: 11 } },
            uirevision: fn,
        },
        { responsive: true, displayModeBar: false },
    )
}

function updateLossChart() {
    if (!lossChart.value) return
    const labels = Array.from({ length: iteration.value + 1 }, (_, i) => i)
    lossChart.value.data.labels = labels
    lossChart.value.data.datasets[0].data = [...sgdState.value.lossHistory]
    lossChart.value.data.datasets[1].data = [...momState.value.lossHistory]
    lossChart.value.data.datasets[2].data = [...rmsState.value.lossHistory]
    lossChart.value.data.datasets[3].data = [...adamState.value.lossHistory]
    lossChart.value.data.datasets[0].hidden = !showSGD.value
    lossChart.value.data.datasets[1].hidden = !showMomentum.value
    lossChart.value.data.datasets[2].hidden = !showRMSProp.value
    lossChart.value.data.datasets[3].hidden = !showAdam.value
    lossChart.value.update()
}

function updateCharts() {
    update3DPlot()
    updateLossChart()
}

function initLossChart() {
    if (!lossChartCanvas.value || !window.Chart) return
    const ctx = lossChartCanvas.value.getContext('2d')
    if (!ctx) return
    const c = chartColors.value
    const fn = selectedFunction.value
    const [sx, sy] = (START[fn] ?? [0, 0]) as [number, number]
    const initLoss = computeLoss(fn, sx, sy)

    lossChart.value = markRaw(new window.Chart(ctx, {
        type: 'line',
        data: {
            labels: [0],
            datasets: [
                { label: 'SGD', data: [initLoss], borderColor: c.sgd, backgroundColor: 'transparent', tension: 0.2, borderWidth: 2, pointRadius: 0 },
                { label: 'SGD + Momentum', data: [initLoss], borderColor: c.momentum, backgroundColor: 'transparent', tension: 0.2, borderWidth: 2, pointRadius: 0 },
                { label: 'RMSProp', data: [initLoss], borderColor: c.rmsprop, backgroundColor: 'transparent', tension: 0.2, borderWidth: 2, pointRadius: 0 },
                { label: 'Adam', data: [initLoss], borderColor: c.adam, backgroundColor: 'transparent', tension: 0.2, borderWidth: 2.5, pointRadius: 0 },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: t('interactiveAdam.charts.iteration'), color: c.text },
                    grid: { color: c.grid },
                    ticks: { color: c.text, maxTicksLimit: 10 },
                },
                y: {
                    title: { display: true, text: 'Loss', color: c.text },
                    grid: { color: c.grid },
                    ticks: { color: c.text },
                },
            },
            plugins: {
                legend: { labels: { color: c.text } },
            },
            animation: { duration: 0 },
        },
    }))
}

function renderFormula() {
    if (!formulaDisplay.value || !currentFormula.value) return
    if (typeof window !== 'undefined' && (window as any).katex) {
        try {
            (window as any).katex.render(currentFormula.value, formulaDisplay.value, {
                throwOnError: false,
                displayMode: false,
            })
        } catch (error) {
            console.error('Error rendering formula:', error)
            formulaDisplay.value.textContent = currentFormula.value
        }
    } else {
        formulaDisplay.value.textContent = currentFormula.value
    }
}

// ── Watchers ──────────────────────────────────────────────────────────────────

watch(selectedFunction, () => {
    reset()
    nextTick(() => renderFormula())
})

watch(currentFormula, () => {
    nextTick(() => renderFormula())
})

watch(() => colorMode.value, () => {
    if (lossChart.value) {
        const c = chartColors.value
        const sc = lossChart.value.options.scales
        sc.x.title.color = c.text
        sc.x.grid.color = c.grid
        sc.x.ticks.color = c.text
        sc.y.title.color = c.text
        sc.y.grid.color = c.grid
        sc.y.ticks.color = c.text
        lossChart.value.options.plugins.legend.labels.color = c.text
        lossChart.value.update()
    }
    update3DPlot()
})

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
    let tries = 0
    const iv = setInterval(() => {
        tries++
        if (window.Chart && window.Plotly) {
            clearInterval(iv)
            nextTick(() => {
                initLossChart()
                update3DPlot()
                renderFormula()
            })
        } else if (tries >= 50) {
            clearInterval(iv)
        }
    }, 100)
})

onUnmounted(() => {
    stopPlay()
    lossChart.value?.destroy()
})
</script>

<template>
    <div class="my-12">
        <!-- Framing note -->
        <div class="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-400 rounded-r-lg">
            <p class="text-sm text-indigo-800 dark:text-indigo-200">
                {{ t('interactiveAdam.note') }}
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- ── Controls ─────────────────────────────────────────────── -->
            <div class="lg:col-span-1">
                <div class="bg-bg-card border border-border rounded-lg p-6 space-y-5">
                    <h2 class="text-2xl font-semibold mb-4 text-text">
                        {{ t('interactiveAdam.controls.title') }}
                    </h2>

                    <!-- Alpha -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {{ t('interactiveAdam.controls.learningRate') }}:
                            <span class="text-blue-600 dark:text-blue-400 font-bold ml-1">{{ alpha.toFixed(3) }}</span>
                        </label>
                        <input type="range" v-model.number="alpha" min="0.001" max="0.5" step="0.001"
                            class="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-lg appearance-none cursor-pointer" />
                        <div class="flex justify-between text-xs text-text-secondary mt-1">
                            <span>0.001</span><span>0.25</span><span>0.5</span>
                        </div>
                    </div>

                    <!-- Beta 1 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {{ t('interactiveAdam.controls.beta1') }}:
                            <span class="text-purple-600 dark:text-purple-400 font-bold ml-1">{{ beta1.toFixed(2)
                                }}</span>
                        </label>
                        <input type="range" v-model.number="beta1" min="0.5" max="0.99" step="0.01"
                            class="slider-purple w-full h-2 rounded-lg appearance-none cursor-pointer" />
                        <div class="flex justify-between text-xs text-text-secondary mt-1">
                            <span>0.5</span><span>0.75</span><span>0.99</span>
                        </div>
                    </div>

                    <!-- Beta 2 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {{ t('interactiveAdam.controls.beta2') }}:
                            <span class="text-pink-600 dark:text-pink-400 font-bold ml-1">{{ beta2.toFixed(3) }}</span>
                        </label>
                        <input type="range" v-model.number="beta2" min="0.9" max="0.9999" step="0.0001"
                            class="slider-pink w-full h-2 rounded-lg appearance-none cursor-pointer" />
                        <div class="flex justify-between text-xs text-text-secondary mt-1">
                            <span>0.9</span><span>0.95</span><span>0.9999</span>
                        </div>
                    </div>

                    <!-- Function -->
                    <div>
                        <label class="block text-sm font-medium text-text-secondary mb-1.5">
                            {{ t('interactiveAdam.controls.function') }}
                        </label>
                        <select v-model="selectedFunction"
                            class="w-full p-2 border border-border rounded-lg bg-bg text-text text-sm">
                            <option value="ravine">{{ t('interactiveAdam.functions.ravine') }}</option>
                            <option value="rosenbrock">{{ t('interactiveAdam.functions.rosenbrock') }}</option>
                        </select>
                    </div>

                    <!-- Optimizer toggles -->
                    <div>
                        <label class="block text-sm font-medium text-text-secondary mb-2">
                            {{ t('interactiveAdam.controls.show') }}
                        </label>
                        <div class="space-y-2">
                            <label class="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" v-model="showSGD" @change="updateCharts" class="rounded" />
                                <span class="w-3 h-3 rounded-full bg-red-500 shrink-0"></span>
                                <span class="text-sm text-text">SGD</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" v-model="showMomentum" @change="updateCharts" class="rounded" />
                                <span class="w-3 h-3 rounded-full bg-blue-500 shrink-0"></span>
                                <span class="text-sm text-text">SGD + Momentum</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" v-model="showRMSProp" @change="updateCharts" class="rounded" />
                                <span class="w-3 h-3 rounded-full bg-purple-500 shrink-0"></span>
                                <span class="text-sm text-text">RMSProp</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" v-model="showAdam" @change="updateCharts" class="rounded" />
                                <span class="w-3 h-3 rounded-full bg-green-500 shrink-0"></span>
                                <span class="text-sm text-text font-semibold">Adam</span>
                            </label>
                        </div>
                    </div>

                    <!-- Action buttons -->
                    <div class="grid grid-cols-2 gap-2">
                        <button @click="step" :disabled="iteration >= MAX_ITER || isPlaying"
                            class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition">
                            {{ t('interactiveAdam.controls.step') }}
                        </button>
                        <button @click="togglePlay" :disabled="iteration >= MAX_ITER" :class="isPlaying
                            ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                            : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'"
                            class="disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition">
                            {{ isPlaying ? t('interactiveAdam.controls.pause') : t('interactiveAdam.controls.play') }}
                        </button>
                        <button @click="runSteps(20)" :disabled="iteration >= MAX_ITER || isPlaying"
                            class="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition">
                            {{ t('interactiveAdam.controls.twentySteps') }}
                        </button>
                        <button @click="reset"
                            class="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition">
                            {{ t('interactiveAdam.controls.reset') }}
                        </button>
                    </div>

                    <!-- Live stats -->
                    <div class="bg-bg-secondary rounded-lg p-4">
                        <h3 class="font-semibold text-text mb-3">{{ t('interactiveAdam.stats.title') }}</h3>
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-text-secondary">{{ t('interactiveAdam.stats.iterations') }}</span>
                            <span class="font-mono font-semibold text-text">{{ iteration }}</span>
                        </div>
                        <div class="space-y-1.5">
                            <div v-if="showSGD" class="flex items-center justify-between text-xs">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                                    <span class="text-text-secondary">SGD</span>
                                    <span v-if="sgdState.diverged" class="text-red-500 font-semibold">{{
                                        t('interactiveAdam.stats.diverged') }}</span>
                                </span>
                                <span class="font-mono text-text">
                                    {{ sgdState.lossHistory[sgdState.lossHistory.length - 1]?.toFixed(4) }}
                                </span>
                            </div>
                            <div v-if="showMomentum" class="flex items-center justify-between text-xs">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                                    <span class="text-text-secondary">Momentum</span>
                                </span>
                                <span class="font-mono text-text">
                                    {{ momState.lossHistory[momState.lossHistory.length - 1]?.toFixed(4) }}
                                </span>
                            </div>
                            <div v-if="showRMSProp" class="flex items-center justify-between text-xs">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                                    <span class="text-text-secondary">RMSProp</span>
                                </span>
                                <span class="font-mono text-text">
                                    {{ rmsState.lossHistory[rmsState.lossHistory.length - 1]?.toFixed(6) }}
                                </span>
                            </div>
                            <div v-if="showAdam" class="flex items-center justify-between text-xs">
                                <span class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
                                    <span class="text-text-secondary font-semibold">Adam</span>
                                </span>
                                <span class="font-mono font-semibold text-green-600 dark:text-green-400">
                                    {{ adamState.lossHistory[adamState.lossHistory.length - 1]?.toFixed(6) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── Charts ────────────────────────────────────────────────── -->
            <div class="lg:col-span-2 space-y-6">

                <!-- 3D surface + paths -->
                <div class="bg-bg-card border border-border rounded-lg p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-2xl font-semibold text-text">
                            {{ t('interactiveAdam.charts.surface') }}
                        </h2>
                        <div v-if="currentFormula" ref="formulaDisplay" class="katex-formula-inline"></div>
                    </div>
                    <div ref="contourDiv" style="height: 420px;"></div>
                </div>

                <!-- Loss comparison -->
                <div class="bg-bg-card border border-border rounded-lg p-6">
                    <h2 class="text-2xl font-semibold mb-4 text-text">
                        {{ t('interactiveAdam.charts.loss') }}
                    </h2>
                    <div class="relative" style="height: 280px;">
                        <canvas ref="lossChartCanvas"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Adam Internal State ───────────────────────────────────────── -->
        <div class="mt-6 bg-bg-card border border-border rounded-lg p-6">
            <h2 class="text-2xl font-semibold mb-1 text-text">
                {{ t('interactiveAdam.internals.title') }}
            </h2>
            <p class="text-sm text-text-secondary mb-4">
                {{ t('interactiveAdam.internals.subtitle') }}
            </p>

            <div v-if="dispT === 0" class="text-sm text-text-secondary italic">
                {{ t('interactiveAdam.internals.empty') }}
            </div>

            <div v-else>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm font-mono border-collapse">
                        <thead>
                            <tr class="border-b border-border">
                                <th class="text-left py-2 px-3 text-text-secondary font-medium text-xs">
                                    {{ t('interactiveAdam.internals.step') }}
                                </th>
                                <th class="text-right py-2 px-3 text-text-secondary font-medium text-xs">
                                    {{ t('interactiveAdam.internals.grad') }}
                                </th>
                                <th class="text-right py-2 px-3 text-text-secondary font-medium text-xs">
                                    {{ t('interactiveAdam.internals.m') }}
                                </th>
                                <th class="text-right py-2 px-3 text-text-secondary font-medium text-xs">
                                    {{ t('interactiveAdam.internals.v') }}
                                </th>
                                <th class="text-right py-2 px-3 text-green-600 dark:text-green-400 font-medium text-xs">
                                    {{ t('interactiveAdam.internals.mhat') }}
                                </th>
                                <th class="text-right py-2 px-3 text-green-600 dark:text-green-400 font-medium text-xs">
                                    {{ t('interactiveAdam.internals.vhat') }}
                                </th>
                                <th class="text-right py-2 px-3 text-blue-600 dark:text-blue-400 font-medium text-xs">
                                    {{ t('interactiveAdam.internals.effectiveLR') }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-border/50 hover:bg-bg-secondary transition-colors">
                                <td class="py-2.5 px-3 text-text font-semibold">t = {{ dispT }}</td>
                                <td class="py-2.5 px-3 text-right text-text">{{ dispGx.toFixed(5) }}</td>
                                <td class="py-2.5 px-3 text-right text-text">{{ dispMx.toFixed(6) }}</td>
                                <td class="py-2.5 px-3 text-right text-text">{{ dispVx.toFixed(6) }}</td>
                                <td class="py-2.5 px-3 text-right text-green-600 dark:text-green-400 font-semibold">
                                    {{ dispMhatx.toFixed(5) }}
                                </td>
                                <td class="py-2.5 px-3 text-right text-green-600 dark:text-green-400 font-semibold">
                                    {{ dispVhatx.toFixed(5) }}
                                </td>
                                <td class="py-2.5 px-3 text-right text-blue-600 dark:text-blue-400 font-bold">
                                    {{ dispEffLRx.toFixed(6) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Bias correction callout -->
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div class="bg-bg-secondary rounded-lg p-3 space-y-1">
                        <p class="font-semibold text-text">{{ t('interactiveAdam.internals.bias1Title') }}</p>
                        <p class="font-mono text-yellow-600 dark:text-yellow-400">
                            1 / (1 &minus; &beta;&#x2081;<sup>{{ dispT }}</sup>)
                            = 1 / {{ dispBias1.toFixed(5) }}
                            &asymp; {{ (1 / dispBias1).toFixed(2) }}&times;
                        </p>
                        <p class="text-text-secondary">
                            {{ dispT <= 5 ? t('interactiveAdam.internals.bias1Early') : dispT <= 20 ?
                                t('interactiveAdam.internals.bias1Mid') : t('interactiveAdam.internals.bias1Late') }}
                                </p>
                    </div>
                    <div class="bg-bg-secondary rounded-lg p-3 space-y-1">
                        <p class="font-semibold text-text">{{ t('interactiveAdam.internals.bias2Title') }}</p>
                        <p class="font-mono text-yellow-600 dark:text-yellow-400">
                            1 / (1 &minus; &beta;&#x2082;<sup>{{ dispT }}</sup>)
                            = 1 / {{ dispBias2.toFixed(5) }}
                            &asymp; {{ (1 / dispBias2).toFixed(1) }}&times;
                        </p>
                        <p class="text-text-secondary">
                            {{ dispT <= 50 ? t('interactiveAdam.internals.bias2Early') : dispT <= 200 ?
                                t('interactiveAdam.internals.bias2Mid') : t('interactiveAdam.internals.bias2Late') }}
                                </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.slider-purple {
    background-color: #e9d5ff;
}

.slider-pink {
    background-color: #fbcfe8;
}

:global(.dark) .slider-purple {
    background-color: #4c1d95;
}

:global(.dark) .slider-pink {
    background-color: #831843;
}

.katex-formula-inline {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: white;
    border-radius: 0.375rem;
    font-size: 1.25rem;
}

:global(.dark) .katex-formula-inline {
    background: white;
}

.katex-formula-inline :deep(.katex) {
    color: black;
}

:global(.dark) .katex-formula-inline :deep(.katex) {
    color: black;
}
</style>
