<script setup lang="ts">
interface Props {
    description: string
    emphasize: string
    ctaLabel: string
    ctaHref: string
    ctaExternal?: boolean
}

const props = defineProps<Props>()
</script>

<template>
    <div
        class="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 rounded-2xl border border-border bg-bg-card overflow-hidden">
        <!-- Accent left bar -->
        <!-- <div class="absolute left-0 inset-y-0 w-1 bg-secondary rounded-l-2xl" /> -->

        <!-- Text -->
        <p class="text-text-secondary text-sm leading-relaxed pl-3">
            <span class="font-semibold text-text">{{ emphasize }}</span>
            {{ ' ' + description }}
        </p>

        <!-- CTA -->
        <NuxtLink v-if="!ctaExternal" :to="ctaHref"
            class="shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-secondary text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60">
            {{ ctaLabel }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </NuxtLink>
        <a v-else :href="ctaHref" target="_blank" rel="noopener noreferrer"
            class="shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-secondary text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60">
            {{ ctaLabel }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
        </a>
    </div>
</template>
