<template>
  <RouterLink :to="`/posts/${post._id}`" class="yt-card block">
    <!-- 16:9 thumbnail -->
    <div class="yt-thumb">
      <img
        v-if="post.coverImage"
        :src="post.coverImage"
        :alt="post.title"
        loading="lazy"
      />
      <div v-else class="yt-thumb-placeholder">🍽️</div>

      <!-- Difficulty badge -->
      <span v-if="post.difficulty" class="yt-diff-badge" :style="diffStyle(post.difficulty)">
        {{ post.difficulty }}
      </span>

      <!-- Cook time "duration" badge (bottom-right like YouTube) -->
      <span v-if="post.cookingTime" class="yt-duration">
        {{ formatTime(post.cookingTime) }}
      </span>
    </div>

    <!-- Card meta (channel-style) -->
    <div class="yt-card-meta">
      <!-- Author avatar -->
      <div class="yt-avatar-sm" :style="avatarStyle(post.author?.username)">
        {{ post.author?.username?.charAt(0).toUpperCase() || "?" }}
      </div>

      <div class="yt-card-info">
        <!-- Title -->
        <p class="yt-card-title">{{ post.title }}</p>

        <!-- Author name -->
        <p class="yt-card-author">{{ post.author?.username || "Unknown" }}</p>

        <!-- Stats row -->
        <p class="yt-card-stats">
          <span v-if="post.cookingTime">{{ post.cookingTime }}m cook</span>
          <span v-if="post.cookingTime && post.servings"> · </span>
          <span v-if="post.servings">serves {{ post.servings }}</span>
          <span v-if="(post.cookingTime || post.servings) && post.commentCount"> · </span>
          <span v-if="post.commentCount">{{ post.commentCount }} review{{ post.commentCount !== 1 ? 's' : '' }}</span>
          <span v-if="!post.cookingTime && !post.servings && !post.commentCount">
            {{ formatDate(post.createdAt) }}
          </span>
        </p>

        <!-- Tags (max 2, subtle) -->
        <div v-if="post.tags?.length" class="flex flex-wrap gap-1 mt-1.5">
          <TagBadge v-for="tag in post.tags.slice(0, 2)" :key="tag" :tag="tag" />
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import TagBadge from "@/components/TagBadge.vue";
import { diffStyle, avatarStyle, formatTime, formatDate } from "@/utils/postDisplay";

defineProps({ post: { type: Object, required: true } });
</script>
