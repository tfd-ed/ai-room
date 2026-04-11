<script setup lang="ts">
declare global {
    interface Window {
        Chart: any
    }
}

const { t } = useI18n()
const colorMode = useColorMode()

const chartColors = computed(() => {
    const isDark = colorMode.value === 'dark'
    return {
        text: isDark ? '#9ca3af' : '#6b7280',
        grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        curve: isDark ? 'rgb(156,163,175)' : 'rgb(55,65,81)',
        tangent: 'rgb(34,197,94)',
        secant: 'rgb(239,68,68)',
        point: 'rgb(59,130,246)',
        secantPoint: 'rgb(249,115,22)',
    }
})

// ── Function Config ───────────────────────────────────────────────────────────

type FnKey = 'quadratic' | 'cubic' | 'sine' | 'polynomial' | 'exponential'

const fnConfig: Record<FnKey, { range: [number, number]; startX: number; hMax: number; points: number }> = {
    quadratic: { range: [-5, 5], startX: 2, hMax: 3, points: 200 },
    cubic: { range: [-3, 3], startX: 1, hMax: 2, points: 200 },
    sine: { range: [-7, 7], startX: 1.5, hMax: 3, points: 300 },
    polynomial: { range: [-1, 3.5], startX: 1, hMax: 2, points: 200 },
    exponential: { range: [-3, 2.5], startX: 0.5, hMax: 2, points: 200 },
}

const selectedFunction = ref<FnKey>('quadratic')
const currentX = ref(2.0)
const h = ref(1.5)
const showTangent = ref(true)
const showSecant = ref(true)
const isAnimating = ref(false)
const animInterval = ref<ReturnType<typeof setInterval> | null>(null)

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chart = ref<any>(null)
const formulaDisplay = ref<HTMLDivElement | null>(null)
const derivativeDisplay = ref<HTMLDivElement | null>(null)

// Function formulas in LaTeX
const functionFormulas: Record<FnKey, string> = {
    quadratic: 'f(x) = x^2',
    cubic: 'f(x) = x^3',
    sine: 'f(x) = \\sin(x)',
    polynomial: 'f(x) = x^3 - 3x^2 + 2',
    exponential: 'f(x) = e^x',
}

const derivativeFormulas: Record<FnKey, string> = {
    quadratic: "f'(x) = 2x",
    cubic: "f'(x) = 3x^2",
    sine: "f'(x) = \\cos(x)",
    polynomial: "f'(x) = 3x^2 - 6x",
    exponential: "f'(x) = e^x",
}

const currentFormula = computed(() => functionFormulas[selectedFunction.value] || '')
const currentDerivativeFormula = computed(() => derivativeFormulas[selectedFunction.value] || '')

// ── Math ──────────────────────────────────────────────────────────────────────

function f(x: number): number {
    switch (selectedFunction.value) {
        case 'quadratic': return x * x
        case 'cubic': return x * x * x
        case 'sine': return Math.sin(x)
        case 'polynomial': return x * x * x - 3 * x * x + 2
        case 'exponential': return Math.exp(x)
        default: return x * x
    }
}

function fPrime(x: number): number {
    switch (selectedFunction.value) {
        case 'quadratic': return 2 * x
        case 'cubic': return 3 * x * x
        case 'sine': return Math.cos(x)
        case 'polynomial': return 3 * x * x - 6 * x
        case 'exponential': return Math.exp(x)
        default: return 2 * x
    }
}

const cfg = computed(() => fnConfig[selectedFunction.value])
const xMin = computed(() => cfg.value.range[0])
const xMax = computed(() => cfg.value.range[1])

const fx = computed(() => f(currentX.value))
const fpx = computed(() => fPrime(currentX.value))
const numericalDeriv = computed(() =>
    h.value !== 0 ? (f(currentX.value + h.value) - f(currentX.value)) / h.value : fpx.value,
)
const approxError = computed(() => Math.abs(numericalDeriv.value - fpx.value))
const slopeState = computed((): 'increasing' | 'flat' | 'decreasing' => {
    if (Math.abs(fpx.value) < 0.01) return 'flat'
    return fpx.value > 0 ? 'increasing' : 'decreasing'
})

// ── Chart ─────────────────────────────────────────────────────────────────────

function updateChart() {
    if (!chart.value) return
    const [xLo, xHi] = [xMin.value, xMax.value]
    const npts = cfg.value.points
    const xs = Array.from({ length: npts }, (_, i) => xLo + i * (xHi - xLo) / (npts - 1))

    const curveData = xs.map(x => ({ x, y: f(x) }))

    // Tangent: y = f(x0) + f'(x0)*(x - x0), drawn over 50% of x-range
    const x0 = currentX.value
    const slope = fpx.value
    const halfSpan = (xHi - xLo) * 0.28
    const tangentData = [
        { x: x0 - halfSpan, y: fx.value + slope * (-halfSpan) },
        { x: x0 + halfSpan, y: fx.value + slope * halfSpan },
    ]

    // Secant: from (x0, f(x0)) to (x0+h, f(x0+h)), extended slightly
    const x1 = x0 + h.value
    const secantSlope = h.value !== 0 ? (f(x1) - f(x0)) / h.value : slope
    const ext = Math.abs(h.value) * 0.25 + 0.3
    const secantData = [
        { x: x0 - ext, y: f(x0) + secantSlope * (-ext) },
        { x: x1 + ext, y: f(x0) + secantSlope * (x1 + ext - x0) },
    ]

    chart.value.data.datasets[0].data = curveData
    chart.value.data.datasets[1].data = showTangent.value ? tangentData : []
    chart.value.data.datasets[2].data = showSecant.value ? secantData : []
    chart.value.data.datasets[3].data = [{ x: x0, y: f(x0) }]
    chart.value.data.datasets[4].data = showSecant.value ? [{ x: x1, y: f(x1) }] : []

    chart.value.options.scales.x.min = xLo
    chart.value.options.scales.x.max = xHi
    chart.value.update('none')
}

function initChart() {
    if (!chartCanvas.value || !window.Chart) return
    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return
    const c = chartColors.value

    chart.value = markRaw(new window.Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'f(x)',
                    data: [],
                    borderColor: c.curve,
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    showLine: true,
                    tension: 0.3,
                    order: 4,
                },
                {
                    label: t('interactiveDerivative.legend.tangent'),
                    data: [],
                    borderColor: c.tangent,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    showLine: true,
                    tension: 0,
                    borderDash: [8, 4],
                    order: 3,
                },
                {
                    label: t('interactiveDerivative.legend.secant'),
                    data: [],
                    borderColor: c.secant,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    showLine: true,
                    tension: 0,
                    borderDash: [4, 4],
                    order: 2,
                },
                {
                    label: 'x\u2080',
                    data: [],
                    borderColor: c.point,
                    backgroundColor: c.point,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false,
                    order: 1,
                },
                {
                    label: 'x\u2080 + h',
                    data: [],
                    borderColor: c.secantPoint,
                    backgroundColor: c.secantPoint,
                    pointRadius: 7,
                    pointHoverRadius: 9,
                    showLine: false,
                    order: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'x', color: c.text },
                    grid: { color: c.grid },
                    ticks: { color: c.text },
                },
                y: {
                    type: 'linear',
                    title: { display: true, text: 'f(x)', color: c.text },
                    grid: { color: c.grid },
                    ticks: { color: c.text },
                },
            },
            plugins: {
                legend: {
                    labels: { color: c.text, usePointStyle: true, pointStyleWidth: 14 },
                },
                tooltip: { mode: 'nearest', intersect: true },
            },
            animation: { duration: 0 },
        },
    }))
    updateChart()
}

// ── Animation ─────────────────────────────────────────────────────────────────

function animateH() {
    if (isAnimating.value) {
        stopAnimation()
        return
    }
    if (h.value < 0.05) h.value = 1.5
    isAnimating.value = true
    animInterval.value = setInterval(() => {
        if (h.value > 0.002) {
            h.value = parseFloat(Math.max(h.value * 0.88, 0.001).toFixed(4))
            updateChart()
        } else {
            h.value = 0.001
            updateChart()
            stopAnimation()
        }
    }, 60)
}

function stopAnimation() {
    isAnimating.value = false
    if (animInterval.value) {
        clearInterval(animInterval.value)
        animInterval.value = null
    }
}

function resetH() {
    stopAnimation()
    h.value = 1.5
    updateChart()
}

function renderKatex(el: HTMLDivElement | null, latex: string) {
    if (!el || !latex) return
    if (typeof window !== 'undefined' && (window as any).katex) {
        try {
            (window as any).katex.render(latex, el, { throwOnError: false, displayMode: false })
        } catch (error) {
            console.error('Error rendering formula:', error)
            el.textContent = latex
        }
    } else {
        el.textContent = latex
    }
}

function renderFormula() {
    renderKatex(formulaDisplay.value, currentFormula.value)
    renderKatex(derivativeDisplay.value, currentDerivativeFormula.value)
}

// ── Watchers ──────────────────────────────────────────────────────────────────

watch(selectedFunction, (fn) => {
    stopAnimation()
    currentX.value = fnConfig[fn].startX
    h.value = 1.5
    updateChart()
    nextTick(() => renderFormula())
})

watch([currentFormula, currentDerivativeFormula], () => {
    nextTick(() => renderFormula())
})

watch([currentX, h, showTangent, showSecant], updateChart)

watch(() => colorMode.value, () => {
    if (!chart.value) return
    const c = chartColors.value
    chart.value.data.datasets[0].borderColor = c.curve
    chart.value.data.datasets[1].borderColor = c.tangent
    chart.value.data.datasets[2].borderColor = c.secant
    chart.value.data.datasets[3].borderColor = c.point
    chart.value.data.datasets[3].backgroundColor = c.point
    chart.value.data.datasets[4].borderColor = c.secantPoint
    chart.value.data.datasets[4].backgroundColor = c.secantPoint
    const sc = chart.value.options.scales
    sc.x.title.color = c.text; sc.x.grid.color = c.grid; sc.x.ticks.color = c.text
    sc.y.title.color = c.text; sc.y.grid.color = c.grid; sc.y.ticks.color = c.text
    chart.value.options.plugins.legend.labels.color = c.text
    chart.value.update()
})

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
    let tries = 0
    const iv = setInterval(() => {
        tries++
        if (window.Chart) {
            clearInterval(iv)
            nextTick(() => {
                initChart()
                renderFormula()
            })
        } else if (tries >= 50) {
            clearInterval(iv)
        }
    }, 100)
})

onUnmounted(() => {
    stopAnimation()
    chart.value?.destroy()
})
</script>

<template>
    <div class="my-12">
        <!-- Framing note -->
        <div class="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-400 rounded-r-lg">
            <p class="text-sm text-indigo-800 dark:text-indigo-200">
                {{ t('interactiveDerivative.note') }}
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- ── Controls ────────────────────────────────────────────── -->
            <div class="lg:col-span-1">
                <div class="bg-bg-card border border-border rounded-lg p-6 space-y-5">
                    <h2 class="text-2xl font-semibold mb-4 text-text">
                        {{ t('interactiveDerivative.controls.title') }}
                    </h2>

                    <!-- Function selector -->
                    <div>
                        <label class="block text-sm font-medium text-text-secondary mb-1.5">
                            {{ t('interactiveDerivative.controls.function') }}
                        </label>
                        <select v-model="selectedFunction"
                            class="w-full p-2 border border-border rounded-lg bg-bg text-text text-sm">
                            <option value="quadratic">{{ t('interactiveDerivative.functions.quadratic') }}</option>
                            <option value="cubic">{{ t('interactiveDerivative.functions.cubic') }}</option>
                            <option value="sine">{{ t('interactiveDerivative.functions.sine') }}</option>
                            <option value="polynomial">{{ t('interactiveDerivative.functions.polynomial') }}</option>
                            <option value="exponential">{{ t('interactiveDerivative.functions.exponential') }}</option>
                        </select>
                    </div>

                    <!-- x₀ slider -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {{ t('interactiveDerivative.controls.x') }}:
                            <span class="text-blue-600 dark:text-blue-400 font-bold ml-1">{{ currentX.toFixed(2)
                                }}</span>
                        </label>
                        <input type="range" v-model.number="currentX" :min="xMin + 0.3" :max="xMax - 0.3" step="0.05"
                            class="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-lg appearance-none cursor-pointer" />
                        <div class="flex justify-between text-xs text-text-secondary mt-1">
                            <span>{{ (xMin + 0.3).toFixed(1) }}</span>
                            <span>{{ ((xMin + xMax) / 2).toFixed(1) }}</span>
                            <span>{{ (xMax - 0.3).toFixed(1) }}</span>
                        </div>
                    </div>

                    <!-- h slider -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {{ t('interactiveDerivative.controls.h') }}:
                            <span class="text-red-500 dark:text-red-400 font-bold ml-1">{{ h.toFixed(3) }}</span>
                        </label>
                        <input type="range" v-model.number="h" min="0.001" :max="cfg.hMax" step="0.001"
                            class="slider-red w-full h-2 rounded-lg appearance-none cursor-pointer" />
                        <div class="flex justify-between text-xs text-text-secondary mt-1">
                            <span>0.001</span>
                            <span>{{ (cfg.hMax / 2).toFixed(1) }}</span>
                            <span>{{ cfg.hMax }}</span>
                        </div>
                    </div>

                    <!-- Toggles -->
                    <div class="space-y-2">
                        <label class="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" v-model="showTangent" class="rounded" />
                            <span class="w-3 h-3 rounded-full bg-green-500 shrink-0"></span>
                            <span class="text-sm text-text">{{ t('interactiveDerivative.controls.showTangent') }}</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" v-model="showSecant" class="rounded" />
                            <span class="w-3 h-3 rounded-full bg-red-500 shrink-0"></span>
                            <span class="text-sm text-text">{{ t('interactiveDerivative.controls.showSecant') }}</span>
                        </label>
                    </div>

                    <!-- Action buttons -->
                    <div class="grid grid-cols-2 gap-2">
                        <button @click="animateH" :class="isAnimating
                            ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                            : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'"
                            class="text-white text-sm font-semibold py-2 px-3 rounded-lg transition col-span-2">
                            {{ isAnimating ? t('interactiveDerivative.controls.stop') :
                                t('interactiveDerivative.controls.animateH') }}
                        </button>
                        <button @click="resetH"
                            class="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition col-span-2">
                            {{ t('interactiveDerivative.controls.resetH') }}
                        </button>
                    </div>

                    <!-- Live stats -->
                    <div class="bg-bg-secondary rounded-lg p-4">
                        <h3 class="font-semibold text-text mb-3">
                            {{ t('interactiveDerivative.stats.title') }}
                        </h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-text-secondary">{{ t('interactiveDerivative.stats.x') }}</span>
                                <span class="font-mono font-semibold text-blue-600 dark:text-blue-400">{{
                                    currentX.toFixed(3) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-text-secondary">{{ t('interactiveDerivative.stats.fx') }}</span>
                                <span class="font-mono text-text">{{ fx.toFixed(4) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-text-secondary">{{ t('interactiveDerivative.stats.analytical')
                                    }}</span>
                                <span class="font-mono font-semibold"
                                    :class="fpx > 0 ? 'text-green-600 dark:text-green-400' : fpx < 0 ? 'text-red-500 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'">
                                    {{ fpx.toFixed(4) }}
                                </span>
                            </div>
                            <div class="border-t border-border/50 pt-2 mt-2">
                                <div class="flex justify-between">
                                    <span class="text-text-secondary text-xs">h</span>
                                    <span class="font-mono text-red-500 dark:text-red-400 text-xs">{{ h.toFixed(4)
                                        }}</span>
                                </div>
                                <div class="flex justify-between mt-1">
                                    <span class="text-text-secondary text-xs">{{
                                        t('interactiveDerivative.stats.numerical') }}</span>
                                    <span class="font-mono text-text text-xs">{{ numericalDeriv.toFixed(4) }}</span>
                                </div>
                                <div class="flex justify-between mt-1">
                                    <span class="text-text-secondary text-xs">{{ t('interactiveDerivative.stats.error')
                                        }}</span>
                                    <span class="font-mono text-xs"
                                        :class="approxError < 0.01 ? 'text-green-600 dark:text-green-400' : approxError < 0.1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'">
                                        {{ approxError.toFixed(5) }}
                                    </span>
                                </div>
                            </div>
                            <!-- Slope badge -->
                            <div class="pt-2">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                                    :class="{
                                        'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300': slopeState === 'increasing',
                                        'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300': slopeState === 'flat',
                                        'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300': slopeState === 'decreasing',
                                    }">
                                    {{ slopeState === 'increasing'
                                        ? t('interactiveDerivative.stats.increasing')
                                        : slopeState === 'flat'
                                            ? t('interactiveDerivative.stats.flat')
                                            : t('interactiveDerivative.stats.decreasing') }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── Chart ────────────────────────────────────────────────── -->
            <div class="lg:col-span-2">
                <div class="bg-bg-card border border-border rounded-lg p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-2xl font-semibold text-text">
                            {{ t('interactiveDerivative.charts.main') }}
                        </h2>
                        <div class="flex flex-col items-end gap-1">
                            <div v-if="currentFormula" ref="formulaDisplay" class="katex-formula-inline"></div>
                            <div v-if="currentDerivativeFormula" ref="derivativeDisplay" class="katex-formula-inline katex-formula-derivative"></div>
                        </div>
                    </div>
                    <div class="relative" style="height: 460px;">
                        <canvas ref="chartCanvas"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Geometric Meaning Panel ──────────────────────────────────── -->
        <div class="mt-6 bg-bg-card border border-border rounded-lg p-6">
            <h2 class="text-2xl font-semibold mb-1 text-text">
                {{ t('interactiveDerivative.info.title') }}
            </h2>
            <p class="text-sm text-text-secondary mb-4">
                {{ t('interactiveDerivative.info.subtitle') }}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <!-- Positive -->
                <div class="border-l-4 pl-4 rounded-r-lg py-2 transition-all" :class="slopeState === 'increasing'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-green-300 dark:border-green-800'">
                    <h3 class="font-semibold text-green-700 dark:text-green-400 mb-1">
                        {{ t('interactiveDerivative.info.positive.title') }}
                    </h3>
                    <p class="text-text-secondary text-xs leading-relaxed">
                        {{ t('interactiveDerivative.info.positive.desc') }}
                    </p>
                    <p v-if="slopeState === 'increasing'"
                        class="mt-2 text-xs font-semibold text-green-600 dark:text-green-300">
                        ← {{ t('interactiveDerivative.info.current') }}
                    </p>
                </div>
                <!-- Zero -->
                <div class="border-l-4 pl-4 rounded-r-lg py-2 transition-all" :class="slopeState === 'flat'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-yellow-300 dark:border-yellow-800'">
                    <h3 class="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                        {{ t('interactiveDerivative.info.zero.title') }}
                    </h3>
                    <p class="text-text-secondary text-xs leading-relaxed">
                        {{ t('interactiveDerivative.info.zero.desc') }}
                    </p>
                    <p v-if="slopeState === 'flat'"
                        class="mt-2 text-xs font-semibold text-yellow-600 dark:text-yellow-300">
                        ← {{ t('interactiveDerivative.info.current') }}
                    </p>
                </div>
                <!-- Negative -->
                <div class="border-l-4 pl-4 rounded-r-lg py-2 transition-all" :class="slopeState === 'decreasing'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-red-300 dark:border-red-800'">
                    <h3 class="font-semibold text-red-700 dark:text-red-400 mb-1">
                        {{ t('interactiveDerivative.info.negative.title') }}
                    </h3>
                    <p class="text-text-secondary text-xs leading-relaxed">
                        {{ t('interactiveDerivative.info.negative.desc') }}
                    </p>
                    <p v-if="slopeState === 'decreasing'"
                        class="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">
                        ← {{ t('interactiveDerivative.info.current') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.slider-red {
    background-color: #fecaca;
}

:global(.dark) .slider-red {
    background-color: #7f1d1d;
}

.katex-formula-inline {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: white;
    border-radius: 0.375rem;
    font-size: 1.25rem;
}

.katex-formula-derivative {
    font-size: 1.1rem;
    opacity: 0.75;
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
