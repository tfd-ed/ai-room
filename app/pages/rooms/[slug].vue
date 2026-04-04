<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { locale, t } = useI18n()
const localePath = useLocalePath()

const { data: page } = await useAsyncData(`room-${slug}-${locale.value}`, () => {
    return queryCollection('content').path(`/${locale.value}/rooms/${slug}`).first()
})

if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Room not found', fatal: true })
}

// console.log('Page data:', page.value)

const siteName = t('hero.title')
const pageTitle = `${page.value.title} | ${siteName}`

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

const scrolled = ref(false)

onMounted(() => {
    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX
        tgY = event.clientY
    })
    window.addEventListener('scroll', () => {
        scrolled.value = window.scrollY > 60
    }, { passive: true })
    moveOrb()
})

// Icon mapping for different rooms
const roomIcons: Record<string, string> = {
    'gradient-descent': '⛰️'
}

// defineOgImageComponent('AiMlRoom', {
//     title: page.value.title,
//     description: page.value.description,
//     icon: roomIcons[slug] || '🧠'
// })

defineOgImage('BlogPost', {
    title: page.value.title,
    description: page.value.description,
    author: page.value.meta.author,
    date: page.value.meta.date,
    // icon: roomIcons[slug]
})

useSeoMeta({
    title: pageTitle,
    description: page.value.description,
    ogTitle: pageTitle,
    ogDescription: page.value.description,
    twitterTitle: pageTitle,
    twitterDescription: page.value.description
})
</script>

<template>
    <div class="min-h-screen bg-bg">
        <!-- Sticky Nav Controls -->
        <div :class="['nav-controls', { scrolled }]">
            <AuthorLink />
            <LanguageSwitcher />
            <ColorModeButton />
        </div>

        <!-- Header -->
        <header class="relative bg-linear-to-b from-bg-secondary to-bg border-b border-border overflow-hidden">
            <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 pb-12 md:py-16 relative z-10">

                <NuxtLink :to="localePath('/')"
                    class="relative z-10 inline-flex items-center gap-2 text-text-secondary no-underline text-sm sm:text-[15px] font-medium transition-all duration-300 mb-6 sm:mb-10 hover:text-text hover:gap-3 group">
                    <svg class="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    {{ $t('room.backToRooms') }}
                </NuxtLink>

                <div class="max-w-4xl relative z-10">
                    <h1
                        class="room-title text-2xl sm:text-3xl md:text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight mb-3 sm:mb-5 tracking-tight text-text">
                        {{ page?.title }}
                    </h1>
                    <p v-if="page?.description"
                        class="room-description text-base sm:text-[17px] md:text-[19px] text-text-secondary leading-relaxed">
                        {{ page.description }}
                    </p>

                    <!-- Auhor and Date -->
                    <div class="flex items-center gap-4 mt-6">
                        <div class="flex items-center gap-3">
                            <img v-if="page?.meta?.authorAvatar" :src="page.meta.authorAvatar" alt="Author Avatar"
                                class="w-8 h-8 rounded-full object-cover" />
                            <div>
                                <p class="text-sm font-medium text-text">{{ page?.meta?.author }}</p>
                                <p class="text-xs text-text-secondary">
                                    {{ new Date(page?.meta?.date).toLocaleDateString(locale.value, {
                                        year: 'numeric',
                                        month: 'long', day: 'numeric'
                                    }) }}
                                </p>
                                <p class="text-xs text-text-secondary">
                                    {{ $t('updatedAt') }}:
                                    {{ new Date(page?.meta?.updatedAt).toLocaleDateString(locale.value, {
                                        year: 'numeric',
                                        month: 'long', day: 'numeric'
                                    }) }}
                                </p>
                                <p class="text-xs text-text-secondary">
                                    {{ $t('updateSummary') }}:
                                    {{ page?.meta?.updateSummary }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Social Share Buttons -->
                    <SocialShareButtons />
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
                class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-(--color-bg) pointer-events-none z-10">
            </div>
        </header>

        <!-- Content -->
        <main class="py-8 sm:py-12 md:py-16 px-3 sm:px-6 md:px-8 relative -mt-8 sm:-mt-12">
            <!-- Top fade overlay for smooth transition from header -->
            <div
                class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-(--color-bg-secondary)/50 to-transparent pointer-events-none">
            </div>

            <div class="max-w-screen-2xl mx-auto relative z-10">
                <article
                    class="bg-bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)]">
                    <ContentRenderer v-if="page" :value="page" class="prose" />
                </article>
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-bg-secondary border-t border-border py-8 sm:py-10 px-4 sm:px-8 mt-8 sm:mt-16">
            <div class="max-w-screen-2xl mx-auto">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <NuxtLink to="/"
                        class="inline-flex items-center gap-2 text-text-secondary no-underline font-medium transition-all duration-300 hover:text-text hover:gap-3">
                        ← {{ $t('room.backToAllRooms') }}
                    </NuxtLink>

                    <!-- Social Links -->
                    <div class="flex items-center gap-4">
                        <a href="https://youtube.com/@tfdevs" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-bg hover:bg-primary text-text-secondary hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="YouTube">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                        <a href="https://github.com/KimangKhenng" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-bg hover:bg-primary text-text-secondary hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="GitHub">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a href="https://facebook.com/ChauDaraScienceEngineer" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-bg hover:bg-primary text-text-secondary hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="Facebook">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                        <a href="https://linkedin.com/in/kimang-kheang" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-bg hover:bg-primary text-text-secondary hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                            aria-label="LinkedIn">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a href="https://t.me/tfdTech" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-bg hover:bg-primary text-text-secondary hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
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
.nav-controls {
    position: fixed;
    left: 50%;
    top: 1.5rem;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transform: translateX(calc(50vw - 100% - 1.5rem));
    transition:
        transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
        top 0.5s cubic-bezier(0.4, 0, 0.2, 1),
        padding 0.4s ease,
        background 0.4s ease,
        border-radius 0.4s ease,
        box-shadow 0.4s ease,
        border 0.4s ease;
}

.nav-controls.scrolled {
    top: 1rem;
    transform: translateX(-50%);
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--color-bg) 82%, transparent);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--color-border);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* Text readability improvements */
.room-title {
    text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.3),
        0 0 40px rgba(255, 255, 255, 0.1),
        0 0 20px rgba(255, 255, 255, 0.15);
    position: relative;
}

.room-description {
    text-shadow:
        0 1px 5px rgba(0, 0, 0, 0.2),
        0 0 20px rgba(255, 255, 255, 0.05);
    position: relative;
}

:deep(.dark) .room-title {
    text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.5),
        0 0 40px rgba(255, 255, 255, 0.15),
        0 0 20px rgba(255, 255, 255, 0.2);
}

:deep(.dark) .room-description {
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
    filter: url(#goo) blur(28px);
    pointer-events: none;
    opacity: 0.35;
}

.dark .gradient-orbs-container {
    opacity: 0.75;
}

.orb {
    position: absolute;
    mix-blend-mode: hard-light;
    will-change: transform;
}

.orb-1 {
    background: radial-gradient(circle at center, rgba(44, 62, 80, 1) 0%, rgba(44, 62, 80, 0) 70%);
    width: 100%;
    height: 100%;
    top: calc(50% - 50%);
    left: calc(50% - 50%);
    transform-origin: center center;
    animation: moveVertical 30s ease infinite;
}

.orb-2 {
    background: radial-gradient(circle at center, rgba(231, 76, 60, 1) 0%, rgba(231, 76, 60, 0) 70%);
    width: 100%;
    height: 100%;
    top: calc(50% - 50%);
    left: calc(50% - 50%);
    transform-origin: calc(50% - 400px);
    animation: moveInCircle 20s reverse infinite;
}

.orb-3 {
    background: radial-gradient(circle at center, rgba(127, 140, 141, 1) 0%, rgba(127, 140, 141, 0) 70%);
    width: 100%;
    height: 100%;
    top: calc(50% - 50% + 200px);
    left: calc(50% - 50% - 500px);
    transform-origin: calc(50% + 400px);
    animation: moveInCircle 40s linear infinite;
}

.orb-4 {
    background: radial-gradient(circle at center, rgba(44, 62, 80, 1) 0%, rgba(44, 62, 80, 0) 70%);
    width: 100%;
    height: 100%;
    top: calc(50% - 50%);
    left: calc(50% - 50%);
    transform-origin: calc(50% - 200px);
    animation: moveHorizontal 40s ease infinite;
    opacity: 0.9;
}

.orb-5 {
    background: radial-gradient(circle at center, rgba(231, 76, 60, 1) 0%, rgba(231, 76, 60, 0) 70%);
    width: calc(100% * 2);
    height: calc(100% * 2);
    top: calc(50% - 100%);
    left: calc(50% - 100%);
    transform-origin: calc(50% - 800px) calc(50% + 200px);
    animation: moveInCircle 20s ease infinite;
}

.orb-interactive {
    background: radial-gradient(circle at center, rgba(127, 140, 141, 1) 0%, rgba(127, 140, 141, 0) 70%);
    width: 100%;
    height: 100%;
    top: -50%;
    left: -50%;
    opacity: 0.9;
}
</style>
