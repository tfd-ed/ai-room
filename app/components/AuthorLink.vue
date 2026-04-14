<script setup lang="ts">
// You can change this URL to your desired destination
const authorUrl = 'https://www.youtube.com/@tfdevs'
</script>

<template>
    <a :href="authorUrl" target="_blank" rel="noopener noreferrer"
        class="group inline-flex items-center gap-2 px-2 py-1.5 sm:px-4 sm:py-2 bg-bg-card border border-border rounded-lg text-text text-sm font-medium no-underline transition-all duration-300 cursor-pointer hover:border-primary hover:bg-bg-secondary hover:-translate-y-px"
        aria-label="Created by">
        <span class="hidden sm:inline text-text-secondary text-xs uppercase tracking-wider">By</span>
        <div class="flex items-center justify-center">
            <NuxtImg src="/assets/img/tfd_logo.jpeg" alt="Logo"
                class="w-6 h-6 object-contain  transition-transform duration-300 group-hover:scale-110" provider="cloudflare" />
        </div>
    </a>
</template>
