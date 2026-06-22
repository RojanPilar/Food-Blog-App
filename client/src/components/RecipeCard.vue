<template>
  <RouterLink :to="`/posts/${post._id}`" class="recipe-card block group">
    <!-- Cover image -->
    <div class="relative aspect-[4/3] overflow-hidden bg-parchment">
      <img
        v-if="post.coverImage"
        :src="post.coverImage"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-saffron/10 to-saffron/20"
      >
        <span class="text-4xl">🍽️</span>
      </div>

      <!-- Difficulty badge overlaid on image -->
      <div class="absolute top-3 right-3">
        <DifficultyBadge :difficulty="post.difficulty" />
      </div>

      <!-- Gradient scrim at bottom of image -->
      <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
    </div>

    <!-- Card body -->
    <div class="p-5">
      <!-- Tags -->
      <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 mb-3">
        <TagBadge
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          :tag="tag"
        />
        <span
          v-if="post.tags.length > 3"
          class="text-xs text-muted font-medium px-2 py-1"
        >+{{ post.tags.length - 3 }}</span>
      </div>

      <!-- Title -->
      <h3 class="font-display font-bold text-xl text-ink leading-snug mb-2 group-hover:text-saffron-dark transition-colors line-clamp-2">
        {{ post.title }}
      </h3>

      <!-- Excerpt -->
      <p class="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
        {{ post.excerpt || post.content?.substring(0, 120) + "..." }}
      </p>

      <!-- Meta row -->
      <div class="flex items-center justify-between pt-3 border-t border-border">
        <!-- Author -->
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-saffron/20 flex items-center justify-center text-xs font-bold text-saffron-dark">
            {{ post.author?.username?.charAt(0).toUpperCase() }}
          </div>
          <span class="text-xs text-muted font-medium">{{ post.author?.username }}</span>
        </div>

        <!-- Cook time + comments -->
        <div class="flex items-center gap-3 text-xs text-muted">
          <span v-if="post.cookingTime" class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ post.cookingTime }}m
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            {{ post.commentCount ?? 0 }}
          </span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import TagBadge from "./TagBadge.vue";
import DifficultyBadge from "./DifficultyBadge.vue";

defineProps({
  post: { type: Object, required: true },
});
</script>