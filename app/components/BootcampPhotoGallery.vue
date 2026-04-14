<script setup lang="ts">
const photos = [
    {
        src: '/assets/promotion/me-teaching-bootcamp-photo-taken-from-behind.jpeg',
        alt: 'Live teaching session',
    },
    // {
    //     src: '/assets/promotion/google-meeting-photo-session-b3.png',
    //     alt: 'Online session — Batch 3',
    // },
    {
        src: '/assets/promotion/panel-speaking.jpeg',
        alt: 'Panel speaking engagement',
    },
]
</script>

<template>
    <div class="not-prose my-4">
        <UCarousel :items="photos" :loop="true" :autoplay="{ delay: 4000 }" :ui="{
            item: 'basis-1/3 px-1.5',
            container: 'justify-center',
        }">
            <template #default="{ item }">
                <div class="overflow-hidden rounded-lg border border-border bg-bg-card shadow-sm">
                    <NuxtImg :src="item.src" :alt="item.alt" class="w-full aspect-[4/3] object-cover block" loading="lazy" provider="cloudflare" />
                    <p class="text-[10px] text-text-secondary text-center px-2 py-1.5 line-clamp-1">
                        {{ item.alt }}
                    </p>
                </div>
            </template>
        </UCarousel>
    </div>
</template>
