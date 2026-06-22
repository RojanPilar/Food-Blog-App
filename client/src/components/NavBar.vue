<template>
  <header class="bg-ink text-white sticky top-0 z-50 shadow-lg">
    <div class="page-container">
      <nav class="flex items-center justify-between h-16">

        <!-- Brand -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <span class="text-saffron text-2xl">✦</span>
          <span class="font-display font-bold text-lg tracking-wide group-hover:text-saffron transition-colors">
            The Fork & Pen
          </span>
        </RouterLink>

        <!-- Desktop nav links -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            to="/"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/' }"
          >Recipes</RouterLink>

          <template v-if="auth.isAuthenticated">
            <RouterLink to="/my-posts" class="nav-link">My Kitchen</RouterLink>
            <RouterLink
              to="/posts/create"
              class="ml-2 btn-primary !py-2 !text-xs"
            >
              + New Recipe
            </RouterLink>
            <button
              @click="handleLogout"
              class="nav-link ml-1"
            >Sign out</button>
            <div class="flex items-center gap-2 ml-3 pl-3 border-l border-white/20">
              <div class="w-7 h-7 rounded-full bg-saffron flex items-center justify-center text-xs font-bold text-white">
                {{ userInitial }}
              </div>
              <span class="text-sm text-white/70">{{ auth.currentUser?.username }}</span>
            </div>
          </template>

          <template v-else>
            <RouterLink to="/login" class="nav-link">Sign in</RouterLink>
            <RouterLink to="/register" class="ml-2 btn-primary !py-2 !text-xs">
              Join Free
            </RouterLink>
          </template>
        </div>

        <!-- Mobile menu toggle -->
        <button
          class="md:hidden text-white/70 hover:text-white p-2"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      <!-- Mobile dropdown -->
      <Transition name="slide-down">
        <div v-if="mobileOpen" class="md:hidden pb-4 border-t border-white/10 pt-3 flex flex-col gap-1">
          <RouterLink to="/" class="mobile-nav-link" @click="mobileOpen = false">Recipes</RouterLink>
          <template v-if="auth.isAuthenticated">
            <RouterLink to="/my-posts" class="mobile-nav-link" @click="mobileOpen = false">My Kitchen</RouterLink>
            <RouterLink to="/posts/create" class="mobile-nav-link" @click="mobileOpen = false">+ New Recipe</RouterLink>
            <button @click="handleLogout" class="mobile-nav-link text-left">Sign out</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="mobile-nav-link" @click="mobileOpen = false">Sign in</RouterLink>
            <RouterLink to="/register" class="mobile-nav-link" @click="mobileOpen = false">Join Free</RouterLink>
          </template>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();
const router = useRouter();
const mobileOpen = ref(false);

const userInitial = computed(() =>
  auth.currentUser?.username?.charAt(0).toUpperCase() || "?"
);

function handleLogout() {
  auth.logout();
  mobileOpen.value = false;
  router.push("/");
}
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150 font-medium;
}
.nav-link-active {
  @apply text-white bg-white/10;
}
.mobile-nav-link {
  @apply px-3 py-2.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 w-full font-medium;
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>