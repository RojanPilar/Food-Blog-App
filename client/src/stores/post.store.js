import { defineStore } from "pinia";
import { ref } from "vue";
import postService from "@/services/post.service";

export const usePostStore = defineStore("posts", () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const posts = ref([]);
  const currentPost = ref(null);
  const myPosts = ref([]);
  const pagination = ref({ total: 0, page: 1, pages: 1, limit: 10 });
  const loading = ref(false);
  const error = ref(null);

  // ── Actions ────────────────────────────────────────────────────────────────
  async function fetchPosts(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await postService.getAllPosts(params);
      posts.value = res.data.posts;
      pagination.value = res.data.pagination;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to load posts.";
    } finally {
      loading.value = false;
    }
  }

  async function fetchPostById(id) {
    loading.value = true;
    error.value = null;
    currentPost.value = null;
    try {
      const res = await postService.getPostById(id);
      currentPost.value = res.data.post;
    } catch (err) {
      error.value = err.response?.data?.message || "Post not found.";
    } finally {
      loading.value = false;
    }
  }

  async function fetchMyPosts() {
    loading.value = true;
    try {
      const res = await postService.getMyPosts();
      myPosts.value = res.data.posts;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to load your posts.";
    } finally {
      loading.value = false;
    }
  }

  async function createPost(postData) {
    const res = await postService.createPost(postData);
    return res.data.post;
  }

  async function updatePost(id, postData) {
    const res = await postService.updatePost(id, postData);
    currentPost.value = res.data.post;
    return res.data.post;
  }

  async function deletePost(id) {
    await postService.deletePost(id);
    posts.value = posts.value.filter((p) => p._id !== id);
    myPosts.value = myPosts.value.filter((p) => p._id !== id);
  }

  async function addComment(postId, commentData) {
    const res = await postService.addComment(postId, commentData);
    if (currentPost.value) {
      currentPost.value.comments.push(res.data.comment);
    }
    return res.data.comment;
  }

  async function deleteComment(postId, commentId) {
    await postService.deleteComment(postId, commentId);
    if (currentPost.value) {
      currentPost.value.comments = currentPost.value.comments.filter(
        (c) => c._id !== commentId
      );
    }
  }

  return {
    posts, currentPost, myPosts, pagination, loading, error,
    fetchPosts, fetchPostById, fetchMyPosts,
    createPost, updatePost, deletePost,
    addComment, deleteComment,
  };
});