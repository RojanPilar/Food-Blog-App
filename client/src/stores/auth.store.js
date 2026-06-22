import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authService from "@/services/auth.service";

export const useAuthStore = defineStore("auth", () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const token = ref(localStorage.getItem("token") || null);
  const loading = ref(false);
  const error = ref(null);

  // ── Getters ────────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const currentUser = computed(() => user.value);

  // ── Helpers ────────────────────────────────────────────────────────────────
  function persistSession(userData, tokenValue) {
    user.value = userData;
    token.value = tokenValue;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenValue);
  }

  function clearSession() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async function register(userData) {
    loading.value = true;
    error.value = null;
    try {
      const res = await authService.register(userData);
      persistSession(res.data.user, res.token);
      return res;
    } catch (err) {
      error.value = err.response?.data?.message || "Registration failed.";
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function login(credentials) {
    loading.value = true;
    error.value = null;
    try {
      const res = await authService.login(credentials);
      persistSession(res.data.user, res.token);
      return res;
    } catch (err) {
      error.value = err.response?.data?.message || "Login failed.";
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMe() {
    if (!token.value) return;
    try {
      const res = await authService.getMe();
      user.value = res.data.user;
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch {
      clearSession();
    }
  }

  function logout() {
    clearSession();
  }

  return {
    user, token, loading, error,
    isAuthenticated, isAdmin, currentUser,
    register, login, fetchMe, logout,
  };
});