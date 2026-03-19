<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
    <div class="flex items-center gap-3 mt-6">
        <span class="text-sm font-medium text-text-secondary">{{ t('room.shareThis') }}:</span>
        <div class="flex gap-2">
            <div class="flex flex-wrap gap-2">
                <SocialShare class="transition-all duration-200 hover:scale-110"
                    v-for="network in ['facebook', 'x', 'linkedin']" :key="network" :network="network" :styled="true"
                    :label="false" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.social-share-button {
    color: #fff;
    padding: 1rem;
    aspect-ratio: 1;
    border-radius: 0;
}
</style>