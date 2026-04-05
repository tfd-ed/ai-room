<script setup>
defineProps({
  colorMode: { type: String, required: false, default: "dark" },
  title: { type: String, required: false, default: "Blog Post Title" },
  author: { type: String, required: false, default: "TFDevs" },
  date: { type: String, required: false, default: "KK" },
  category: { type: String, required: false, default: "Technology" },
  avatar: { type: String, required: false },
  backgroundImage: { type: String, required: false }
});
</script>

<template>
  <div
    class="w-full h-full flex flex-col p-[60px] justify-between bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-white"
    :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : void 0">
    <div class="flex items-center gap-4">
      <!-- <div class="text-6xl">{{ icon }}</div> -->
      <div class="flex flex-col">
        <div class="text-2xl font-bold text-gray-700" style="font-family: 'Google Sans', sans-serif;">AI &
          ML Playroom</div>
        <div class="text-lg text-gray-500" style="font-family: 'Google Sans', sans-serif;">Interactive
          Learning Platform</div>
      </div>
    </div>

    <div class="flex flex-col gap-6">
      <h1 class="text-[80px] font-bold m-0 leading-8" style="font-family: 'Google Sans', sans-serif;">
        {{ title }}
      </h1>
    </div>

    <div class="flex items-center gap-6">
      <div v-if="avatar" class="overflow-hidden border-4 border-neutral-200 dark:border-neutral-800"
        style="width: 80px; height: 80px; border-radius: 50%;">
        <img :src="avatar" alt="Avatar" class="w-full h-full" style="object-fit: cover; border-radius: 50%;">
      </div>
      <div class="flex flex-col">
        <span class="text-[32px]" style="font-family: 'Google Sans', sans-serif;">{{ author
        }}</span>
        <span class="text-[24px] text-neutral-400" style="font-family: 'Google Sans', sans-serif;">{{ date
        }}</span>
      </div>
    </div>
  </div>
</template>
