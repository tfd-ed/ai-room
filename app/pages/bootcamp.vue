<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

const { data: page } = await useAsyncData(`bootcamp-${locale.value}`, () => {
    return queryCollection('content').path(`/${locale.value}/bootcamp`).first()
})

if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const pageTitle = `${page.value.title} | ${t('hero.title')}`

defineOgImage('BlogPost', {
    title: page.value.title,
    description: page.value.description,
})

useSeoMeta({
    title: pageTitle,
    description: page.value.description,
    ogTitle: pageTitle,
    ogDescription: page.value.description,
    ogType: 'website',
    ogUrl: `https://ai.tfdevs.com${localePath('/bootcamp')}`,
    ogSiteName: 'AI/ML Room',
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: page.value.description,
})

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
    <div class="min-h-screen bg-bg">
        <HeaderNav />

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
                    <!-- Badge -->
                    <span
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20 mb-4">
                        <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                        {{ $t('bootcamp.badge') }}
                    </span>

                    <h1
                        class="text-2xl sm:text-3xl md:text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight mb-3 sm:mb-5 tracking-tight text-text">
                        {{ page?.title }}
                    </h1>
                    <p v-if="page?.description"
                        class="text-base sm:text-[17px] md:text-[19px] text-text-secondary leading-relaxed max-w-2xl">
                        {{ page.description }}
                    </p>

                    <!-- CTA -->
                    <div class="flex flex-col gap-2 lg:flex-row">
                        <div class="flex items-center gap-4 mt-8 flex-wrap">
                            <a href="https://t.me/tfdTech/236" target="_blank" rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px shadow-md">
                                {{ $t('bootcamp.registerCta') }}
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                        <div class="flex items-center gap-4 mt-8 flex-wrap">
                            <a href="https://drive.google.com/file/d/1BPENOD4AGJYtZlcLsixAoyICfkB4IgY3/view?usp=sharing"
                                target="_blank" rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px shadow-md">
                                {{ $t('bootcamp.detailCurriculum') }}
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                        <div class="flex items-center gap-4 mt-8 flex-wrap">
                            <a href="https://forms.gle/X84n8wY5GM6vzYHp7" target="_blank" rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px shadow-md">
                                {{ $t('bootcamp.registerText') }}
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
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

            <div
                class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-(--color-bg) pointer-events-none z-10">
            </div>
        </header>

        <!-- Content -->
        <main class="py-8 sm:py-12 md:py-16 px-3 sm:px-6 md:px-8 relative -mt-8 sm:-mt-12">
            <div
                class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-(--color-bg-secondary)/50 to-transparent pointer-events-none">
            </div>

            <div class="max-w-screen-2xl mx-auto relative z-10">
                <article
                    class="bg-bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)]">
                    <ContentRenderer v-if="page" :value="page" class="prose" />
                </article>

                <!-- Bottom CTA card -->
                <!-- <div
                    class="mt-8 p-6 sm:p-8 bg-bg-card border border-secondary/30 rounded-2xl text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <p class="text-text font-semibold text-lg mb-1">{{ $t('bootcamp.ctaCardTitle') }}</p>
                    <p class="text-text-secondary text-sm mb-6">{{ $t('bootcamp.ctaCardSubtitle') }}</p>
                    <a href="https://t.me/tfdevs" target="_blank" rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px shadow-md">
                        {{ $t('bootcamp.registerCta') }}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div> -->
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-bg-secondary border-t border-border py-8 sm:py-10 px-4 sm:px-8 mt-8 sm:mt-16">
            <div class="max-w-screen-2xl mx-auto">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <NuxtLink :to="localePath('/')"
                        class="inline-flex items-center gap-2 text-text-secondary no-underline font-medium transition-all duration-300 hover:text-text hover:gap-3">
                        ← {{ $t('room.backToAllRooms') }}
                    </NuxtLink>
                </div>
            </div>
        </footer>
    </div>
</template>
