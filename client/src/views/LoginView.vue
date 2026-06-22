<template>
  <div class="auth-shell">
    <div class="auth-container">

      <!-- Brand -->
      <div class="auth-brand-block">
        <BrandMark />
        <p class="auth-eyebrow">Sign in to continue to Rojan Cuisines</p>
      </div>

      <!-- Card -->
      <div class="auth-card">
        <h1 class="auth-title">Sign in</h1>
        <p class="auth-subtitle">Welcome back — your recipe box missed you.</p>

        <div v-if="error" class="auth-alert" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="flex-shrink:0;margin-top:1px">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleLogin" novalidate>
          <div class="auth-field">
            <input
              id="login-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder=" "
              required
              class="auth-input"
              :disabled="auth.loading"
            />
            <label for="login-email" class="auth-label">Email address</label>
          </div>

          <div class="auth-field">
            <input
              id="login-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder=" "
              required
              class="auth-input has-trailing"
              :disabled="auth.loading"
            />
            <label for="login-password" class="auth-label">Password</label>
            <button
              type="button"
              class="auth-trailing-btn"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>

          <div class="auth-row-between">
            <button type="button" class="auth-text-link" @click="showForgot = !showForgot">
              Forgot password?
            </button>
          </div>
          <p v-if="showForgot" class="auth-notice">
            Password recovery isn't part of this preview build yet — reach out to your administrator to reset it.
          </p>

          <button type="submit" class="auth-btn-primary" :disabled="auth.loading">
            <svg v-if="auth.loading" width="16" height="16" class="animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            {{ auth.loading ? "Signing in…" : "Sign in" }}
          </button>
        </form>
      </div>

      <p class="auth-footer">
        New to Rojan Cuisines?
        <RouterLink to="/register" class="auth-link-strong">Create account</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import BrandMark from "@/components/BrandMark.vue";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = reactive({ email: "", password: "" });
const error = ref("");
const showPassword = ref(false);
const showForgot = ref(false);

async function handleLogin() {
  error.value = "";
  try {
    await auth.login(form);
    const redirect = route.query.redirect || "/";
    router.push(redirect);
  } catch (err) {
    error.value = typeof err === "string" ? err : "Invalid email or password.";
  }
}
</script>
