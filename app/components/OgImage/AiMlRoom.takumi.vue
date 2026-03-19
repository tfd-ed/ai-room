<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
}>(), {
  title: 'AI & ML Playroom',
  description: 'Interactive explorations of artificial intelligence and machine learning concepts',
  icon: '🧠'
})
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between bg-gradient-to-br from-blue-50 to-indigo-100 p-16"
    style="font-family:'Inter', 'Noto Serif Khmer', sans-serif;">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <!-- <div class="text-6xl">{{ icon }}</div> -->
      <div class="flex flex-col">
        <div class="text-2xl font-bold text-gray-700" style="font-family: 'Inter', 'Noto Serif Khmer', sans-serif;">AI &
          ML Playroom</div>
        <div class="text-lg text-gray-500" style="font-family: 'Inter', 'Noto Serif Khmer', sans-serif;">Interactive
          Learning Platform</div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex items-center">
      <div class="w-full">
        <h1 class="text-7xl font-black text-gray-900 leading-tight mb-6"
          style="font-family: 'Inter', 'Noto Serif Khmer', sans-serif;">
          {{ title }}
        </h1>
        <p class="text-3xl text-gray-600 leading-relaxed" style="font-family: 'Inter', 'Noto Serif Khmer', sans-serif;">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between">
      <div class="text-xl text-gray-500" style="font-family: 'Inter', 'Noto Serif Khmer', sans-serif;">
        Dive deep into mathematics and intuition
      </div>
      <div class="flex gap-2">
        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
        <div class="w-3 h-3 rounded-full bg-indigo-500"></div>
        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
      </div>
    </div>
  </div>
</template>
