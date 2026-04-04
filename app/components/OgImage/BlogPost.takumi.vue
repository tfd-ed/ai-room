<script setup>
defineProps({
  title: { type: String, required: false, default: "Blog Post Title" },
  author: { type: String, required: false, default: "TFDevs" },
  date: { type: String, required: false, default: "" },
  avatar: { type: String, required: false },
});
</script>

<template>
  <div class="w-full h-full flex flex-col p-[60px] justify-between"
    style="font-family: 'Google Sans', sans-serif; color: white; background: #0b1120;">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <div class="text-[26px] font-bold"
          style="color: rgba(255,255,255,0.92); font-family: 'Google Sans', sans-serif;">AI &amp; ML Playroom</div>
        <div class="text-[18px]" style="color: rgba(255,255,255,0.45); font-family: 'Google Sans', sans-serif;">
          Interactive Learning Platform</div>
      </div>
      <!-- Accent dots echoing our orb colors -->
      <div class="flex gap-2 items-center">
        <div
          style="width:14px; height:14px; border-radius:50%; background:#2c3e50; border: 2px solid rgba(255,255,255,0.2);">
        </div>
        <div
          style="width:14px; height:14px; border-radius:50%; background:#e74c3c; border: 2px solid rgba(255,255,255,0.2);">
        </div>
        <div
          style="width:14px; height:14px; border-radius:50%; background:#7f8c8d; border: 2px solid rgba(255,255,255,0.2);">
        </div>
      </div>
    </div>

    <!-- Title -->
    <div
      style="flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden; padding: 32px 0;">
      <h1
        style="font-size: 72px; font-weight: 800; line-height: 1.18; margin: 0; color: white; overflow: hidden; max-height: 256px; font-family: 'Google Sans', sans-serif;">
        {{ title }}
      </h1>
    </div>

    <!-- Footer: author + TFD logo -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-5">
        <div v-if="avatar"
          style="width: 68px; height: 68px; border-radius: 50%; overflow: hidden; border: 3px solid rgba(231,76,60,0.75); flex-shrink: 0;">
          <img :src="avatar" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="flex flex-col gap-1">
          <span style="font-size: 28px; font-weight: 600; color: white; font-family: 'Google Sans', sans-serif;">{{
            author }}</span>
          <span v-if="date"
            style="font-size: 20px; color: rgba(255,255,255,0.45); font-family: 'Google Sans', sans-serif;">{{ date
            }}</span>
        </div>
      </div>
      <!-- TFD Logo — bottom-right corner -->
      <img src="/assets/img/tfd_logo.jpeg" alt="TFDevs" style="width: 72px; height: 72px; object-fit: cover;" />
    </div>

  </div>
</template>
