<script setup lang="ts">
const { t } = useI18n()
import { motion } from 'motion-v'

const siteTitle = t('hero.title')
const siteSubtitle = t('hero.subtitle')

defineOgImage('BlogPost', {
    title: siteTitle,
    description: siteSubtitle,
    icon: '🧠'
})

useSeoMeta({
    title: siteTitle,
    description: siteSubtitle,
    ogTitle: siteTitle,
    ogDescription: siteSubtitle,
    twitterTitle: siteTitle,
    twitterDescription: siteSubtitle
})

const rooms = [
    {
        titleKey: 'rooms.gradientDescent.title',
        descriptionKey: 'rooms.gradientDescent.description',
        slug: 'gradient-descent',
        icon: '⛰️',
        image: '/assets/img/gradient_2.gif'
    }
]

// Interactive orb logic
const interactiveOrb = ref<HTMLDivElement | null>(null)
let curX = 0
let curY = 0
let tgX = 0
let tgY = 0

function moveOrb() {
    curX += (tgX - curX) / 20
    curY += (tgY - curY) / 20
    if (interactiveOrb.value) {
        interactiveOrb.value.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
    }
    requestAnimationFrame(moveOrb)
}

onMounted(() => {
    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX
        tgY = event.clientY
    })
    moveOrb()
})
</script>

<template>
    <div class="min-h-screen bg-(--color-bg)">
        <!-- Hero Section -->
        <section
            class="relative min-h-[90vh] md:min-h-[90vh] flex items-center overflow-hidden bg-linear-to-b from-(--color-bg) to-(--color-bg-secondary)">
            <!-- Top gradient line -->
            <div
                class="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--color-primary) to-transparent">
            </div>

            <!-- Top Right Controls -->
            <div class="absolute top-8 right-8 z-20 flex items-center gap-3">
                <AuthorLink />
                <LanguageSwitcher />
                <ColorModeButton />
            </div>

            <div class="max-w-7xl mx-auto px-8 md:px-8 py-16 md:py-16 relative z-10">
                <div class="max-w-3xl mx-auto text-center relative z-10">
                    <motion.h1 :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.8, ease: 'easeOut' }"
                        class="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[2] mb-6 tracking-tight text-(--color-text)">
                        {{ $t('hero.title') }}
                    </motion.h1>
                    <motion.p :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.8, delay: 0.2, ease: 'easeOut' }"
                        class="hero-subtitle text-lg sm:text-xl md:text-[1.375rem] text-(--color-text-secondary) leading-relaxed mb-12 max-w-2xl mx-auto">
                        {{ $t('hero.subtitle') }}
                    </motion.p>
                    <motion.div :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
                        :transition="{ duration: 0.8, delay: 0.4, ease: 'easeOut' }"
                        class="flex gap-4 justify-center flex-wrap">
                        <a href="#rooms"
                            class="group inline-flex items-center gap-2 px-8 py-4 bg-linear-to-br from-(--color-primary) to-[#34495e] text-white no-underline rounded-xl font-semibold text-[1.0625rem] transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3),0_10px_10px_-5px_rgba(0,0,0,0.2)]">
                            {{ $t('hero.exploreButton') }}
                            <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </motion.div>
                </div>

                <!-- Flowing Gradient Orbs -->
                <svg xmlns="http://www.w3.org/2000/svg" class="absolute top-0 left-0 w-0 h-0">
                    <defs>
                        <filter id="goo">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                                result="goo" />
                            <feBlend in="SourceGraphic" in2="goo" />
                        </filter>
                    </defs>
                </svg>
                <div class="gradient-orbs-container">
                    <div class="orb orb-1"></div>
                    <div class="orb orb-2"></div>
                    <div class="orb orb-3"></div>
                    <div class="orb orb-4"></div>
                    <div class="orb orb-5"></div>
                    <div ref="interactiveOrb" class="orb orb-interactive"></div>
                </div>
            </div>

            <!-- Bottom fade overlay for smooth transition -->
            <div
                class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-(--color-bg) pointer-events-none z-10">
            </div>
        </section>

        <!-- Rooms Section -->
        <section id="rooms" class="py-24 md:py-24 px-8 md:px-8 bg-(--color-bg) relative -mt-16">
            <!-- Top fade overlay for smooth transition from hero -->
            <div
                class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-(--color-bg-secondary)/50 to-transparent pointer-events-none">
            </div>

            <div class="max-w-7xl mx-auto relative z-10">
                <div class="text-center mb-16">
                    <!-- <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight text-(--color-text)">
                        {{ $t('rooms.title') }}
                    </h2> -->
                    <p class="text-lg text-(--color-text-secondary) max-w-3xl mx-auto leading-[1.7]">
                        {{ $t('rooms.subtitle') }}
                    </p>
                </div>

                <div class="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-8">
                    <RoomCard v-for="room in rooms" :key="room.slug" :title="$t(room.titleKey)"
                        :description="$t(room.descriptionKey)" :slug="room.slug" :icon="room.icon"
                        :image="room.image" />
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-(--color-bg-secondary) border-t border-(--color-border) py-12 px-8">
            <div class="max-w-7xl mx-auto">
                <div class="text-center">
                    <!-- small TFD logo at the middle -->
                    <img src="/assets/img/tfd_logo.jpeg" alt="TFDevs Logo" class="mx-auto mb-4 w-12 h-12" />
                    <p class="text-(--color-text) font-semibold text-lg mb-2">{{ $t('footer.title') }}</p>
                    <!-- <p class="text-(--color-text-secondary) text-[0.9375rem] mb-6">{{ $t('footer.subtitle') }}</p> -->

                    <!-- Social Links -->
                    <div class="flex items-center justify-center gap-4 mt-6">
                        <a href="https://youtube.com/@tfdevs" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-(--color-bg) hover:bg-(--color-primary) text-(--color-text-secondary) hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="YouTube">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                        <a href="https://github.com/KimangKhenng" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-(--color-bg) hover:bg-(--color-primary) text-(--color-text-secondary) hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="GitHub">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a href="https://facebook.com/ChauDaraScienceEngineer" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-(--color-bg) hover:bg-(--color-primary) text-(--color-text-secondary) hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="Facebook">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                        <a href="https://linkedin.com/in/kimang-kheang" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-(--color-bg) hover:bg-(--color-primary) text-(--color-text-secondary) hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="LinkedIn">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a href="https://t.me/tfdTech" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-(--color-bg) hover:bg-(--color-primary) text-(--color-text-secondary) hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="Telegram">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
/* Hero text visibility improvements */
.hero-title {
    text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.3),
        0 0 40px rgba(255, 255, 255, 0.1),
        0 0 20px rgba(255, 255, 255, 0.15);
    position: relative;
}

.hero-subtitle {
    text-shadow:
        0 1px 5px rgba(0, 0, 0, 0.2),
        0 0 20px rgba(255, 255, 255, 0.05);
    position: relative;
}

:deep(.dark) .hero-title {
    text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.5),
        0 0 40px rgba(255, 255, 255, 0.15),
        0 0 20px rgba(255, 255, 255, 0.2);
}

:deep(.dark) .hero-subtitle {
    text-shadow:
        0 1px 5px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(255, 255, 255, 0.08);
}

/* Gradient Orbs Animation Keyframes */
@keyframes moveInCircle {
    0% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(180deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes moveVertical {
    0% {
        transform: translateY(-50%);
    }

    50% {
        transform: translateY(50%);
    }

    100% {
        transform: translateY(-50%);
    }
}

@keyframes moveHorizontal {
    0% {
        transform: translateX(-50%) translateY(-10%);
    }

    50% {
        transform: translateX(50%) translateY(10%);
    }

    100% {
        transform: translateX(-50%) translateY(-10%);
    }
}

.gradient-orbs-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    filter: url(#goo) blur(40px);
    pointer-events: none;
    opacity: 0.4;
}

.orb {
    position: absolute;
    mix-blend-mode: hard-light;
    will-change: transform;
}

.orb-1 {
    background: radial-gradient(circle at center, rgba(44, 62, 80, 0.8) 0%, rgba(44, 62, 80, 0) 50%);
    width: 80%;
    height: 80%;
    top: calc(50% - 40%);
    left: calc(50% - 40%);
    transform-origin: center center;
    animation: moveVertical 30s ease infinite;
}

.orb-2 {
    background: radial-gradient(circle at center, rgba(231, 76, 60, 0.8) 0%, rgba(231, 76, 60, 0) 50%);
    width: 80%;
    height: 80%;
    top: calc(50% - 40%);
    left: calc(50% - 40%);
    transform-origin: calc(50% - 400px);
    animation: moveInCircle 20s reverse infinite;
}

.orb-3 {
    background: radial-gradient(circle at center, rgba(127, 140, 141, 0.8) 0%, rgba(127, 140, 141, 0) 50%);
    width: 80%;
    height: 80%;
    top: calc(50% - 40% + 200px);
    left: calc(50% - 40% - 500px);
    transform-origin: calc(50% + 400px);
    animation: moveInCircle 40s linear infinite;
}

.orb-4 {
    background: radial-gradient(circle at center, rgba(44, 62, 80, 0.8) 0%, rgba(44, 62, 80, 0) 50%);
    width: 80%;
    height: 80%;
    top: calc(50% - 40%);
    left: calc(50% - 40%);
    transform-origin: calc(50% - 200px);
    animation: moveHorizontal 40s ease infinite;
    opacity: 0.7;
}

.orb-5 {
    background: radial-gradient(circle at center, rgba(231, 76, 60, 0.8) 0%, rgba(231, 76, 60, 0) 50%);
    width: calc(80% * 2);
    height: calc(80% * 2);
    top: calc(50% - 80%);
    left: calc(50% - 80%);
    transform-origin: calc(50% - 800px) calc(50% + 200px);
    animation: moveInCircle 20s ease infinite;
}

.orb-interactive {
    background: radial-gradient(circle at center, rgba(127, 140, 141, 0.8) 0%, rgba(127, 140, 141, 0) 50%);
    width: 100%;
    height: 100%;
    top: -50%;
    left: -50%;
    opacity: 0.7;
}
</style>
