<template>
  <div class="page-container py-12">
    <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 style="font-weight:700;font-size:30px;color:var(--yt-text)">My Kitchen</h1>
        <p style="font-size:14px;color:var(--yt-text-muted);margin-top:4px">Recipes you've shared with the community.</p>
      </div>
      <RouterLink to="/posts/create" class="btn-primary">+ New recipe</RouterLink>
    </div>

    <LoadingSpinner v-if="postStore.loading" message="Loading your recipes..." />

    <div v-else-if="postStore.error" class="text-center py-20">
      <p style="font-size:14px;color:var(--yt-danger)">{{ postStore.error }}</p>
      <button @click="loadPosts" class="btn-secondary mt-4">Try again</button>
    </div>

    <div v-else-if="!postStore.myPosts.length" class="text-center py-24">
      <p class="text-6xl mb-4">📖</p>
      <h3 style="font-weight:700;font-size:22px;color:var(--yt-text);margin-bottom:8px">No recipes yet</h3>
      <p style="font-size:14px;color:var(--yt-text-muted);margin-bottom:24px">Everything you publish will show up here.</p>
      <RouterLink to="/posts/create" class="btn-primary">+ Share your first recipe</RouterLink>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="post in postStore.myPosts"
        :key="post._id"
        class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
        style="background:var(--yt-surface);border:1px solid var(--yt-border);border-radius:16px"
      >
        <!-- Thumbnail -->
        <RouterLink :to="`/posts/${post._id}`" class="block w-full sm:w-32 sm:flex-shrink-0">
          <div class="aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden" style="background:var(--yt-surface-alt)">
            <img
              v-if="post.coverImage"
              :src="post.coverImage"
              :alt="post.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
          </div>
        </RouterLink>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <RouterLink
            :to="`/posts/${post._id}`"
            class="font-semibold text-lg line-clamp-1 transition-colors"
            style="color:var(--yt-text)"
            @mouseenter="$event.target.style.color = 'var(--yt-accent)'"
            @mouseleave="$event.target.style.color = 'var(--yt-text)'"
          >
            {{ post.title }}
          </RouterLink>
          <div class="flex items-center gap-3 mt-1.5 text-xs flex-wrap" style="color:var(--yt-text-muted)">
            <DifficultyBadge v-if="post.difficulty" :difficulty="post.difficulty" />
            <span v-if="post.cookingTime">{{ post.cookingTime }}m</span>
            <span>{{ commentCount(post) }} comment{{ commentCount(post) !== 1 ? "s" : "" }}</span>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 flex-shrink-0">
          <RouterLink :to="`/posts/${post._id}/edit`" class="btn-secondary !text-xs">Edit</RouterLink>
          <button @click="confirmDelete(post)" class="btn-danger !text-xs">Delete</button>
        </div>
      </div>
    </div>

    <ModalConfirm
      :show="!!postToDelete"
      title="Delete this recipe?"
      message="This will permanently remove the recipe and all its comments."
      confirm-label="Yes, delete"
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="postToDelete = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePostStore } from "@/stores/post.store";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import DifficultyBadge from "@/components/DifficultyBadge.vue";
import ModalConfirm from "@/components/ModalConfirm.vue";
import { formatDate } from "@/utils/postDisplay";

const postStore = usePostStore();
const postToDelete = ref(null);
const deleting = ref(false);

function loadPosts() {
  postStore.fetchMyPosts();
}

function confirmDelete(post) {
  postToDelete.value = post;
}

async function handleDelete() {
  if (!postToDelete.value) return;
  deleting.value = true;
  try {
    await postStore.deletePost(postToDelete.value._id);
    postToDelete.value = null;
  } catch {
    alert("Failed to delete recipe.");
  } finally {
    deleting.value = false;
  }
}

function commentCount(post) {
  return post.commentCount ?? post.comments?.length ?? 0;
}

onMounted(loadPosts);
</script>
