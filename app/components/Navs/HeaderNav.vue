<script setup lang="ts">
import { useScroll, useWindowSize } from '@vueuse/core'

const { y } = useScroll(typeof window !== 'undefined' ? window : null, { throttle: 16 })
const { width } = useWindowSize()
const scrolled = computed(() => y.value > 60)
// On mobile always use the centered pill — the top-right offset formula
// can push items past the safe-area inset on phones like iPhone 14 Pro Max.
const showPill = computed(() => scrolled.value || (width.value > 0 && width.value < 640))
</script>

<template>
    <div :class="[
        'fixed left-1/2 z-50 flex items-center gap-2 sm:gap-3 border',
        'transition-[translate,top,padding,background-color,border-color,border-radius,box-shadow]',
        'duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
        showPill
            ? 'top-3 sm:top-4 -translate-x-1/2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-[16px] border-(--color-border) shadow-[0_4px_24px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.06)]'
            : 'top-6 translate-x-[calc(50vw_-_100%_-_1.5rem)] border-transparent shadow-none rounded-none',
    ]">
        <LanguageSwitcher />
        <AuthorLink />
        <AppSearch />
        <ColorModeButton />
    </div>
</template>