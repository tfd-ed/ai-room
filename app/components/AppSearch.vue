<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('content'))
const { data: files } = await useAsyncData('search', () => queryCollectionSearchSections('content'))

const searchTerm = ref('')
const open = ref(false)
</script>

<template>
    <UButton color="neutral" variant="ghost" icon="i-lucide-search" aria-label="Search" @click="open = true" />
    <UContentSearch v-model:search-term="searchTerm" v-model:open="open" :files="files" :navigation="navigation"
        :fuse="{ resultLimit: 42 }" />
</template>
