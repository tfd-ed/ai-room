<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description,
  ogType: 'article',
  ogUrl: `https://ai.tfdevs.com${route.path}`,
  ogSiteName: 'AI/ML Room',
  twitterCard: 'summary_large_image',
  twitterTitle: page.value.title,
  twitterDescription: page.value.description,
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
