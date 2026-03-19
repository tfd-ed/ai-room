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
            <img :src="image" :alt="title"
                class="w-full h-full object-contain  opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100" />
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
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
}

.room-card:hover .top-gradient-line {
    transform: scaleX(1);
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
