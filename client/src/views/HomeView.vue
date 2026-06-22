<template>
  <div>
    <!-- ── Category chip filter row ─────────────────────────────────────── -->
    <div class="yt-chips">
      <button class="yt-chip" :class="{ active: !filters.tag && !filters.difficulty }" @click="clearFilters">
        All
      </button>
      <button
        v-for="chip in chips"
        :key="chip.value"
        class="yt-chip"
        :class="{ active: filters.tag === chip.value || filters.difficulty === chip.value }"
        @click="activateChip(chip)"
      >
        {{ chip.label }}
      </button>
    </div>

    <!-- ── Content area ──────────────────────────────────────────────────── -->
    <div class="yt-page-pad">

      <!-- Loading -->
      <div v-if="postStore.loading" class="flex items-center justify-center py-24">
        <div class="animate-spin w-10 h-10 border-4 border-[var(--yt-border)] border-t-[var(--yt-accent)] rounded-full"/>
      </div>

      <!-- Error -->
      <div v-else-if="postStore.error" class="text-center py-24">
        <p class="text-sm mb-4" style="color:var(--yt-danger)">{{ postStore.error }}</p>
        <button @click="loadPosts" class="btn-secondary">Try again</button>
      </div>

      <!-- Empty state -->
      <div v-else-if="!postStore.posts.length" class="text-center py-24">
        <div class="text-7xl mb-4">🍳</div>
        <h3 class="text-2xl font-bold mb-2" style="color:var(--yt-text)">No recipes found</h3>
        <p class="text-sm mb-6" style="color:var(--yt-text-muted)">
          {{ hasFilters ? "Try a different filter." : "Be the first to share a recipe!" }}
        </p>
        <RouterLink v-if="auth.isAuthenticated" to="/posts/create" class="btn-primary">
          + Share a recipe
        </RouterLink>
      </div>

      <!-- Post grid -->
      <template v-else>
        <p class="text-sm mb-5" style="color:var(--yt-text-muted)">
          {{ postStore.pagination.total }} recipe{{ postStore.pagination.total !== 1 ? "s" : "" }}
          <span v-if="hasFilters"> · filtered</span>
        </p>

        <div class="yt-grid">
          <PostCard
            v-for="post in postStore.posts"
            :key="post._id"
            :post="post"
          />
        </div>

        <!-- Pagination -->
        <div v-if="postStore.pagination.pages > 1" class="flex justify-center items-center gap-2 mt-10">
          <button
            v-for="p in postStore.pagination.pages"
            :key="p"
            @click="goToPage(p)"
            :class="[
              'w-9 h-9 rounded-full text-sm font-semibold transition-colors',
              p === currentPage
                ? 'text-white'
                : 'hover:bg-[var(--yt-surface-alt)]'
            ]"
            :style="p === currentPage ? 'background:var(--yt-text);color:var(--yt-surface)' : 'color:var(--yt-text-muted)'"
          >{{ p }}</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "@/stores/post.store";
import { useAuthStore } from "@/stores/auth.store";
import PostCard from "@/components/PostCard.vue";

const postStore = usePostStore();
const auth      = useAuthStore();
const route     = useRoute();
const router    = useRouter();
const currentPage = ref(1);

const chips = [
  { label: "Breakfast",   value: "Breakfast",   type: "tag" },
  { label: "Lunch",       value: "Lunch",       type: "tag" },
  { label: "Dinner",      value: "Dinner",      type: "tag" },
  { label: "Desserts",    value: "Dessert",     type: "tag" },
  { label: "Vegan",       value: "Vegan",       type: "tag" },
  { label: "Quick Meals", value: "Quick Meal",  type: "tag" },
  { label: "Beginner",    value: "Beginner",    type: "difficulty" },
  { label: "Italian",     value: "Italian",     type: "tag" },
  { label: "Pasta",       value: "Pasta",       type: "tag" },
  { label: "Asian",       value: "Asian",       type: "tag" },
];

const filters = reactive({ search: "", tag: "", difficulty: "" });
const hasFilters = computed(() => filters.search || filters.tag || filters.difficulty);

function activateChip(chip) {
  if (chip.type === "tag") {
    filters.tag = filters.tag === chip.value ? "" : chip.value;
    filters.difficulty = "";
  } else {
    filters.difficulty = filters.difficulty === chip.value ? "" : chip.value;
    filters.tag = "";
  }
  currentPage.value = 1;
  loadPosts();
}

function clearFilters() {
  Object.assign(filters, { search: "", tag: "", difficulty: "" });
  currentPage.value = 1;
  loadPosts();
  router.replace({ query: {} });
}

function goToPage(p) {
  currentPage.value = p;
  loadPosts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function loadPosts() {
  const params = { page: currentPage.value, limit: 12 };
  if (filters.search)     params.search = filters.search;
  if (filters.tag)        params.tag = filters.tag;
  if (filters.difficulty) params.difficulty = filters.difficulty;
  await postStore.fetchPosts(params);
}

// Sync filters from URL query (for App.vue search + sidebar category clicks)
watch(() => route.query, (q) => {
  if (q.search)     { filters.search = q.search;         filters.tag = ""; filters.difficulty = ""; }
  else if (q.tag)   { filters.tag = q.tag;               filters.search = ""; filters.difficulty = ""; }
  else              { Object.assign(filters, { search: "", tag: "", difficulty: "" }); }
  currentPage.value = 1;
  loadPosts();
}, { immediate: false });

onMounted(() => {
  if (route.query.search) filters.search = route.query.search;
  if (route.query.tag)    filters.tag    = route.query.tag;
  loadPosts();
});
</script>
