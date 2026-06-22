<template>
  <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :style="diffStyle(difficulty)">
    {{ difficulty }}
  </span>
</template>

<script setup>
import { diffStyle } from "@/utils/postDisplay";

defineProps({ difficulty: String });
</script>
