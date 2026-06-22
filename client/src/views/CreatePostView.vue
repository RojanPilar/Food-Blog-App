<template>
  <PostForm
    :loading="loading"
    :error="error"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePostStore } from "@/stores/post.store";
import PostForm from "@/components/PostForm.vue";

const router = useRouter();
const postStore = usePostStore();

const loading = ref(false);
const error = ref("");

async function handleSubmit(payload) {
  loading.value = true;
  error.value = "";
  try {
    const post = await postStore.createPost(payload);
    router.push(`/posts/${post._id}`);
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to publish recipe. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
