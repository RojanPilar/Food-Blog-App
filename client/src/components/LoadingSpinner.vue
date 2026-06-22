<template>
  <div class="flex items-center justify-center py-16">
    <div class="flex flex-col items-center gap-3">
      <div class="w-8 h-8 rounded-full animate-spin" style="border:3px solid var(--yt-border);border-top-color:var(--yt-accent)" />
      <p v-if="message" style="font-size:14px;color:var(--yt-text-muted)">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ message: { type: String, default: "" } });
</script>
