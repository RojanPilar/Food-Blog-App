<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <p class="font-bold text-7xl mb-2" style="color:var(--yt-accent)">404</p>
      <h1 class="font-bold text-2xl mb-3" style="color:var(--yt-text)">Recipe not found</h1>
      <p class="text-sm mb-8" style="color:var(--yt-text-muted)">
        This page wandered off the menu. Let's get you back to something delicious.
      </p>
      <RouterLink to="/" class="btn-primary">← Back to recipes</RouterLink>
    </div>
  </div>
</template>
