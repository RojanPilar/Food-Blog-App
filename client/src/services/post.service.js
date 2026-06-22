import api from "./api";

const postService = {
  // ── Posts ────────────────────────────────────────────────────────────────────
  async getAllPosts(params = {}) {
    const { data } = await api.get("/posts", { params });
    return data;
  },

  async getPostById(id) {
    const { data } = await api.get(`/posts/${id}`);
    return data;
  },

  async getMyPosts() {
    const { data } = await api.get("/posts/my-posts");
    return data;
  },

  async createPost(postData) {
    const { data } = await api.post("/posts", postData);
    return data;
  },

  async updatePost(id, postData) {
    const { data } = await api.put(`/posts/${id}`, postData);
    return data;
  },

  async deletePost(id) {
    const { data } = await api.delete(`/posts/${id}`);
    return data;
  },

  // ── Comments ─────────────────────────────────────────────────────────────────
  async addComment(postId, commentData) {
    const { data } = await api.post(`/posts/${postId}/comments`, commentData);
    return data;
  },

  async deleteComment(postId, commentId) {
    const { data } = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return data;
  },
};

export default postService;