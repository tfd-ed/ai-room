<script setup lang="ts">
const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
// Get the other language (not the current one)
const otherLocale = computed(() => {
    return (locales.value as any[]).find(i => i.code !== locale.value)
})

const currentLocaleName = computed(() => {
    return (locales.value as any[]).find(i => i.code === locale.value)?.name || ''
})
</script>

<template>
    <NuxtLink v-if="otherLocale" :to="switchLocalePath(otherLocale.code)"
        class="inline-flex items-center gap-2 px-4 py-2 bg-bg-card border border-border rounded-lg text-text text-sm font-medium no-underline transition-all duration-300 hover:border-primary hover:bg-bg-secondary hover:-translate-y-px"
        :aria-label="`Switch to ${t(otherLocale.name)}`">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span class="hidden sm:inline">{{ t(otherLocale.name.toLowerCase()) }}</span>
    </NuxtLink>
</template>
