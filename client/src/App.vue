<template>
  <div id="app-root">
    <!-- ── Top Navigation Bar ─────────────────────────────────────────────── -->
    <header class="yt-nav">
      <!-- Hamburger + Brand -->
      <button class="yt-icon-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <BrandMark class="flex-shrink-0 mr-4" />

      <!-- Search bar (the centrepiece) -->
      <div class="yt-search-bar">
        <input
          v-model="searchQuery"
          @keydown.enter="handleSearch"
          type="text"
          placeholder="Search recipes, cuisines, ingredients..."
          class="yt-search-input"
          aria-label="Search recipes"
        />
        <button class="yt-search-btn" @click="handleSearch" aria-label="Submit search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>
      </div>

      <!-- Right-side actions -->
      <div class="flex items-center gap-2 ml-auto">
        <!-- Dark mode toggle -->
        <button class="yt-icon-btn" @click="toggleDark" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="!isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>

        <template v-if="auth.isAuthenticated">
          <RouterLink to="/posts/create" class="btn-subscribe hidden sm:inline-flex">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>New Post</span>
          </RouterLink>
          <!-- User avatar -->
          <button @click="userMenuOpen = !userMenuOpen" class="relative" aria-label="User menu">
            <div class="yt-avatar-lg cursor-pointer text-sm" style="width:32px;height:32px;font-size:13px">
              {{ userInitial }}
            </div>
            <!-- Dropdown -->
            <div v-if="userMenuOpen" class="absolute right-0 top-full mt-2 w-48 rounded-xl border py-1 z-50"
                 style="background:var(--yt-surface);border-color:var(--yt-border);box-shadow:0 8px 24px rgba(0,0,0,0.15)"
                 @mouseleave="userMenuOpen = false">
              <div class="px-4 py-2 border-b" style="border-color:var(--yt-border)">
                <p class="text-sm font-semibold" style="color:var(--yt-text)">{{ auth.currentUser?.username }}</p>
                <p class="text-xs" style="color:var(--yt-text-muted)">{{ auth.currentUser?.email }}</p>
              </div>
              <RouterLink to="/my-posts" @click="userMenuOpen=false" class="block px-4 py-2 text-sm hover:bg-[var(--yt-surface-alt)]" style="color:var(--yt-text)">My Recipes</RouterLink>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--yt-surface-alt)]" style="color:var(--yt-text)">Sign out</button>
            </div>
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn-secondary text-sm hidden sm:inline-flex">Sign in</RouterLink>
          <RouterLink to="/register" class="btn-subscribe">Join Free</RouterLink>
        </template>
      </div>
    </header>

    <!-- ── Left Sidebar ───────────────────────────────────────────────────── -->
    <!-- Mobile overlay -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="mobileMenuOpen = false"/>

    <nav
      :class="[
        'yt-sidebar',
        sidebarCollapsed ? 'collapsed' : '',
        mobileMenuOpen ? 'mobile-open' : ''
      ]"
      aria-label="Main navigation"
    >
      <div style="padding:12px 0;">
        <!-- Main links -->
        <RouterLink to="/" class="yt-nav-item" :class="{ active: $route.path === '/' }">
          <span class="yt-nav-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </span>
          <span class="yt-nav-label">Home</span>
        </RouterLink>

        <template v-if="auth.isAuthenticated">
          <RouterLink to="/my-posts" class="yt-nav-item" :class="{ active: $route.path === '/my-posts' }">
            <span class="yt-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </span>
            <span class="yt-nav-label">My Recipes</span>
          </RouterLink>
          <RouterLink to="/posts/create" class="yt-nav-item" :class="{ active: $route.path === '/posts/create' }">
            <span class="yt-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </span>
            <span class="yt-nav-label">New Post</span>
          </RouterLink>
        </template>

        <div class="yt-sidebar-divider"/>

        <!-- Category browsing -->
        <p class="yt-nav-section-title">Explore</p>
        <button v-for="cat in categories" :key="cat.label" @click="browseCategory(cat)"
                class="yt-nav-item w-full text-left" :class="{ active: activeCat === cat.label }">
          <span class="yt-nav-icon" style="font-size:20px">{{ cat.icon }}</span>
          <span class="yt-nav-label">{{ cat.label }}</span>
        </button>

        <div class="yt-sidebar-divider"/>

        <!-- Auth links -->
        <template v-if="!auth.isAuthenticated">
          <RouterLink to="/login" class="yt-nav-item">
            <span class="yt-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            </span>
            <span class="yt-nav-label">Sign in</span>
          </RouterLink>
        </template>
        <template v-else>
          <button @click="handleLogout" class="yt-nav-item w-full text-left">
            <span class="yt-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </span>
            <span class="yt-nav-label">Sign out</span>
          </button>
        </template>
      </div>
    </nav>

    <!-- ── Page Content ───────────────────────────────────────────────────── -->
    <main
      :class="[
        'yt-main',
        sidebarCollapsed ? 'sidebar-collapsed' : '',
        'md:block'
      ]"
    >
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import BrandMark from "@/components/BrandMark.vue";

const auth   = useAuthStore();
const router = useRouter();
const route  = useRoute();

// ── Theme ────────────────────────────────────────────────────────────────────
const isDark = ref(localStorage.getItem("theme") === "dark");
function applyTheme() {
  document.documentElement.setAttribute("data-theme", isDark.value ? "dark" : "light");
}
function toggleDark() {
  isDark.value = !isDark.value;
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
  applyTheme();
}
onMounted(() => {
  applyTheme();
  auth.fetchMe();
});

// ── Sidebar ──────────────────────────────────────────────────────────────────
const sidebarCollapsed = ref(window.innerWidth < 1280);
const mobileMenuOpen   = ref(false);
function toggleSidebar() {
  if (window.innerWidth < 768) {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }
}

// Close mobile menu on route change
watch(() => route.path, () => { mobileMenuOpen.value = false; });

// ── Search ───────────────────────────────────────────────────────────────────
const searchQuery = ref("");
function handleSearch() {
  if (!searchQuery.value.trim()) return;
  router.push({ path: "/", query: { search: searchQuery.value.trim() } });
}

// ── User menu ────────────────────────────────────────────────────────────────
const userMenuOpen = ref(false);
const userInitial  = computed(() =>
  auth.currentUser?.username?.charAt(0).toUpperCase() || "?"
);

function handleLogout() {
  userMenuOpen.value = false;
  auth.logout();
  router.push("/");
}

// ── Categories ───────────────────────────────────────────────────────────────
const activeCat = ref("");
const categories = [
  { label: "Breakfast",  icon: "🍳", tag: "Breakfast"  },
  { label: "Lunch",      icon: "🥗", tag: "Lunch"      },
  { label: "Dinner",     icon: "🍽️", tag: "Dinner"     },
  { label: "Desserts",   icon: "🧁", tag: "Dessert"    },
  { label: "Vegan",      icon: "🌱", tag: "Vegan"      },
  { label: "Quick Meals",icon: "⚡", tag: "Quick Meal" },
  { label: "Italian",    icon: "🇮🇹", tag: "Italian"   },
  { label: "Asian",      icon: "🥢", tag: "Asian"      },
];
function browseCategory(cat) {
  activeCat.value = activeCat.value === cat.label ? "" : cat.label;
  router.push({ path: "/", query: activeCat.value ? { tag: cat.tag } : {} });
}
</script>
