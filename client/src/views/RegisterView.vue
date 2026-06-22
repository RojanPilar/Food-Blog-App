<template>
  <div class="auth-shell">
    <div class="auth-container">

      <!-- Brand -->
      <div class="auth-brand-block">
        <BrandMark />
        <p class="auth-eyebrow">Create your Rojan Cuisines account</p>
      </div>

      <!-- Card -->
      <div class="auth-card">
        <h1 class="auth-title">Create account</h1>
        <p class="auth-subtitle">Join our community of food storytellers.</p>

        <div v-if="error" class="auth-alert" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="flex-shrink:0;margin-top:1px">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleRegister" novalidate>
          <div class="auth-field">
            <input
              id="reg-username"
              v-model="form.username"
              type="text"
              autocomplete="username"
              placeholder=" "
              minlength="3"
              maxlength="30"
              required
              class="auth-input"
              :disabled="auth.loading"
            />
            <label for="reg-username" class="auth-label">Username</label>
          </div>

          <div class="auth-field">
            <input
              id="reg-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder=" "
              required
              class="auth-input"
              :disabled="auth.loading"
            />
            <label for="reg-email" class="auth-label">Email address</label>
          </div>

          <div class="auth-field" style="margin-bottom: 8px;">
            <input
              id="reg-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder=" "
              minlength="6"
              required
              class="auth-input has-trailing"
              :disabled="auth.loading"
            />
            <label for="reg-password" class="auth-label">Password</label>
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

          <!-- Password strength -->
          <div class="auth-strength-row" style="margin-bottom: 2px;">
            <div v-for="n in 4" :key="n" class="auth-strength-seg" :style="n <= passwordStrength ? { background: strengthColor } : null" />
          </div>
          <p class="auth-strength-label" style="margin-bottom: 20px;">{{ strengthLabel }}</p>

          <div class="auth-field">
            <textarea
              id="reg-bio"
              v-model="form.bio"
              placeholder=" "
              rows="2"
              maxlength="200"
              class="auth-input"
              style="resize: none; padding-top: 20px;"
              :disabled="auth.loading"
            />
            <label for="reg-bio" class="auth-label">Bio (optional)</label>
          </div>
          <p class="auth-counter">{{ form.bio.length }}/200</p>

          <button type="submit" class="auth-btn-primary" :disabled="auth.loading">
            <svg v-if="auth.loading" width="16" height="16" class="animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            {{ auth.loading ? "Creating account…" : "Create account" }}
          </button>
        </form>
      </div>

      <p class="auth-footer">
        Already have an account?
        <RouterLink to="/login" class="auth-link-strong">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import BrandMark from "@/components/BrandMark.vue";

const auth = useAuthStore();
const router = useRouter();
const form = reactive({ username: "", email: "", password: "", bio: "" });
const error = ref("");
const showPassword = ref(false);

const passwordStrength = computed(() => {
  const p = form.password;
  if (!p) return 0;
  let score = 0;
  if (p.length >= 6)  score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p) || /[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score;
});

const strengthColor = computed(() => ({
  1: "#e53935", 2: "#f59e0b", 3: "#1565c0", 4: "#1565c0",
}[passwordStrength.value] || "var(--yt-border)"));

const strengthLabel = computed(() => ({
  0: "Use at least 6 characters",
  1: "Weak password",
  2: "Fair password",
  3: "Good password",
  4: "Strong password",
}[passwordStrength.value]));

async function handleRegister() {
  error.value = "";
  try {
    await auth.register(form);
    router.push("/");
  } catch (err) {
    error.value = typeof err === "string" ? err : "Registration failed. Please try again.";
  }
}
</script>
