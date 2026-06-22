<template>
  <div v-if="postStore.loading && !loaded" class="page-container py-24 text-center">
    <LoadingSpinner message="Loading recipe..." />
  </div>
  <div v-else-if="postStore.error" class="page-container py-24 text-center">
    <p class="text-red-500 text-sm mb-4">{{ postStore.error }}</p>
    <RouterLink to="/" class="btn-secondary">← Back to recipes</RouterLink>
  </div>
  <PostForm
    v-else
    :initial-data="initialData"
    :loading="saving"
    :error="error"
    is-editing
    @submit="handleSubmit"
  />
</template>

<script setup>
// FIX: EditPostView now correctly pre-populates the form with currentPost data.
// Previously the form was passed no initialData, so every field appeared blank.
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "@/stores/post.store";
import PostForm from "@/components/PostForm.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();

const saving  = ref(false);
const error   = ref("");
const loaded  = ref(false);

// Build initialData from the fetched post so PostForm can populate its reactive form
const initialData = computed(() => {
  const p = postStore.currentPost;
  if (!p) return null;
  return {
    title:       p.title       || "",
    content:     p.content     || "",
    excerpt:     p.excerpt     || "",
    coverImage:  p.coverImage  || "",
    cookingTime: p.cookingTime ?? "",
    prepTime:    p.prepTime    ?? "",
    servings:    p.servings    ?? "",
    difficulty:  p.difficulty  || "",
    cuisine:     p.cuisine     || "",
    tags:        p.tags        ? [...p.tags] : [],
    ingredients: p.ingredients ? [...p.ingredients] : [],
  };
});

onMounted(async () => {
  await postStore.fetchPostById(route.params.id);
  loaded.value = true;
});

async function handleSubmit(payload) {
  saving.value = true;
  error.value  = "";
  try {
    await postStore.updatePost(route.params.id, payload);
    router.push(`/posts/${route.params.id}`);
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to save changes.";
  } finally {
    saving.value = false;
  }
}
</script>
