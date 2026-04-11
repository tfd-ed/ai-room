<script setup lang="ts">
interface Props {
    title: string
    description: string
    slug: string
    icon?: string
    image?: string
}

const localePath = useLocalePath()
const props = defineProps<Props>()

const imgRef = ref<HTMLImageElement | null>(null)
let rafId: number | null = null
let loopCanvas: HTMLCanvasElement | null = null
let loopCtx: CanvasRenderingContext2D | null = null

// Detect when GIF animation stalls and restart it to create an infinite loop.
// Uses a tiny off-screen canvas to compare sampled pixels across frames;
// when identical for ~500 ms the image src is reset (browser serves from cache).
const startGifLoop = () => {
    if (!loopCtx || !imgRef.value) return
    if (rafId !== null) cancelAnimationFrame(rafId)

    let lastHash = ''
    let lastChangeAt = Date.now()
    // 2 s of no pixel change means the GIF has stopped on its last frame.
    // GIFs animate at ~10-25 fps so individual frames can appear for hundreds
    // of ms — using a frame-count threshold would trigger false restarts.
    const STALL_MS = 2000

    const check = () => {
        if (!imgRef.value || !loopCtx) return
        try {
            loopCtx.drawImage(imgRef.value, 0, 0, 8, 8)
            const d = loopCtx.getImageData(0, 0, 8, 8).data
            const hash = `${d[0]},${d[4]},${d[16]},${d[32]},${d[64]},${d[128]},${d[192]},${d[252]}`
            if (hash !== lastHash) {
                lastHash = hash
                lastChangeAt = Date.now()
            } else if (Date.now() - lastChangeAt > STALL_MS) {
                imgRef.value.src = ''
                imgRef.value.src = props.image!
                lastHash = ''
                lastChangeAt = Date.now()
                return // load event will restart the check
            }
        } catch {
            // ignore drawImage errors while src is transitioning
        }
        rafId = requestAnimationFrame(check)
    }
    rafId = requestAnimationFrame(check)
}

const handleImgLoad = () => {
    if (imgRef.value?.naturalWidth && props.image) startGifLoop()
}

onMounted(() => {
    if (!props.image?.toLowerCase().endsWith('.gif') || !imgRef.value) return
    loopCanvas = document.createElement('canvas')
    loopCanvas.width = 4
    loopCanvas.height = 4
    loopCtx = loopCanvas.getContext('2d', { willReadFrequently: true })
    imgRef.value.addEventListener('load', handleImgLoad)
    if (imgRef.value.complete && imgRef.value.naturalWidth) startGifLoop()
})

onBeforeUnmount(() => {
    if (rafId !== null) cancelAnimationFrame(rafId)
    imgRef.value?.removeEventListener('load', handleImgLoad)
    loopCanvas = null
    loopCtx = null
})
</script>

<template>
    <NuxtLink :to="localePath(`/rooms/${slug}`)"
        class="group relative flex flex-col bg-bg-card border border-border rounded-2xl overflow-hidden no-underline transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3),0_10px_10px_-5px_rgba(0,0,0,0.2)] room-card">
        <!-- Top gradient line (animated on hover) -->
        <div class="top-gradient-line"></div>

        <!-- Card glow effect -->
        <div class="card-glow"></div>

        <!-- Image container -->
        <div v-if="image"
            class="w-full h-60 overflow-hidden flex items-center justify-center p-6 bg-white group-hover:bg-position-100">
            <img ref="imgRef" :src="image" :alt="title"
                class="w-full h-full object-contain opacity-90 transition-[transform,opacity] duration-300 group-hover:scale-105 group-hover:opacity-100" />
        </div>

        <!-- Content -->
        <div class="p-8 flex flex-col h-full relative z-10">
            <!-- Icon (only shown if no image) -->
            <div v-if="!image"
                class="text-5xl mb-5 grayscale-[0.2] transition-transform duration-300 group-hover:scale-110">
                {{ icon || '🎯' }}
            </div>

            <!-- Title -->
            <h3 class="text-2xl font-semibold text-text mb-3 tracking-tight">
                {{ title }}
            </h3>

            <!-- Description -->
            <p class="text-text-secondary text-[15px] leading-relaxed flex-1">
                {{ description }}
            </p>

            <!-- Footer link -->
            <div class="flex items-center justify-between">
                <span
                    class="inline-flex items-center gap-2 text-secondary font-semibold text-[15px] transition-[gap] duration-300 group-hover:gap-3">
                    {{ $t('rooms.exploreLink') }}
                    <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </span>
            </div>
        </div>
    </NuxtLink>
</template>

<style scoped>
/* Top gradient line that animates on hover */
.top-gradient-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
    /* Use clip-path instead of transform: scaleX to avoid Safari compositing
       layer bug where transform causes the child to bypass overflow: hidden +
       border-radius clipping on the parent, appearing as a floating rectangle. */
    clip-path: inset(0 100% 0 0);
    transition: clip-path 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
}

.room-card:hover .top-gradient-line {
    clip-path: inset(0 0% 0 0);
}

/* Card glow effect */
.card-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(44, 62, 80, 0.15),
            transparent 40%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.room-card:hover .card-glow {
    opacity: 1;
}

/* Safari fix: force the card into its own compositing layer so that
   overflow: hidden + border-radius properly clips all absolutely-positioned
   children. Without this, Safari skips the rounded-corner clip on elements
   that have their own GPU layer (e.g. the card-glow using inset: 0). */
.room-card {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

/* Image gradient background animation */
.image-gradient-bg {
    background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-card) 50%, var(--color-primary) 100%);
    background-size: 200% 200%;
    background-position: 0% 0%;
    transition: background-position 0.5s ease;
}

.group:hover .image-gradient-bg {
    background-position: 100% 100%;
}
</style>
