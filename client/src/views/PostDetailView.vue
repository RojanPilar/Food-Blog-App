<template>
  <div>
    <!-- Loading -->
    <div v-if="postStore.loading" class="flex items-center justify-center py-32">
      <div class="animate-spin w-10 h-10 border-4 border-[var(--yt-border)] border-t-[var(--yt-accent)] rounded-full"/>
    </div>

    <!-- Error -->
    <div v-else-if="postStore.error" class="yt-page-pad text-center py-24">
      <p class="text-sm mb-4" style="color:var(--yt-danger)">{{ postStore.error }}</p>
      <RouterLink to="/" class="btn-secondary">← Back to recipes</RouterLink>
    </div>

    <article v-else-if="post">
      <!-- ── Hero image (16:9 like a YouTube video) ──────────────────────── -->
      <div style="aspect-ratio:16/9;overflow:hidden;background:var(--yt-surface-alt);max-height:480px">
        <img
          v-if="post.coverImage"
          :src="post.coverImage"
          :alt="post.title"
          style="width:100%;height:100%;object-fit:cover"
        />
        <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:80px;opacity:0.4">
          🍽️
        </div>
      </div>

      <!-- ── Content area ─────────────────────────────────────────────────── -->
      <div class="yt-page-pad" style="max-width:960px">

        <!-- Title -->
        <h1 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:var(--yt-text);line-height:1.2;margin-bottom:12px">
          {{ post.title }}
        </h1>

        <!-- Stats row (views-style) -->
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:12px;font-size:14px;color:var(--yt-text-muted);margin-bottom:16px">
          <span v-if="post.cookingTime">🕐 {{ post.cookingTime }}m cook</span>
          <span v-if="post.prepTime">⏱ {{ post.prepTime }}m prep</span>
          <span v-if="post.servings">👥 Serves {{ post.servings }}</span>
          <span v-if="post.cuisine">🌍 {{ post.cuisine }}</span>
          <span>📅 {{ formatDate(post.createdAt, { long: true }) }}</span>
          <span>💬 {{ post.comments?.length || 0 }} reviews</span>
        </div>

        <!-- ── Channel row (author section, YouTube-style) ─────────────────── -->
        <div class="yt-channel-row">
          <div class="yt-avatar-lg" :style="avatarStyle(post.author?.username)">
            {{ post.author?.username?.charAt(0).toUpperCase() }}
          </div>
          <div style="flex:1">
            <p style="font-weight:600;font-size:15px;color:var(--yt-text)">{{ post.author?.username }}</p>
            <p v-if="post.author?.bio" style="font-size:13px;color:var(--yt-text-muted)">{{ post.author.bio }}</p>
          </div>

          <!-- Owner actions (edit/delete) -->
          <div v-if="isOwner || auth.isAdmin" style="display:flex;gap:8px">
            <RouterLink v-if="isOwner" :to="`/posts/${post._id}/edit`" class="btn-secondary" style="font-size:13px">
              Edit
            </RouterLink>
            <button @click="showDeleteModal = true" class="btn-danger" style="font-size:13px">
              Delete
            </button>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="post.tags?.length || post.difficulty" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px">
          <TagBadge v-for="tag in post.tags" :key="tag" :tag="tag" />
          <span v-if="post.difficulty" class="yt-diff-badge" :style="[diffStyle(post.difficulty), { position: 'static' }]">
            {{ post.difficulty }}
          </span>
        </div>

        <!-- ── Two-column: content + ingredients ──────────────────────────── -->
        <div style="display:flex;flex-direction:column;gap:32px" class="lg:flex-row">

          <!-- Main recipe content -->
          <div style="flex:1;min-width:0">
            <div style="font-size:16px;line-height:1.8;color:var(--yt-text);white-space:pre-line">
              {{ post.content }}
            </div>

            <!-- Comments -->
            <CommentSection
              :comments="post.comments || []"
              :post-id="post._id"
              :post-author-id="post.author?._id"
            />
          </div>

          <!-- Ingredients sidebar -->
          <aside v-if="post.ingredients?.length" style="width:280px;flex-shrink:0" class="lg:self-start lg:sticky lg:top-24">
            <div style="background:var(--yt-surface);border:1px solid var(--yt-border);border-radius:12px;padding:20px">
              <h3 style="font-weight:700;font-size:18px;color:var(--yt-text);margin-bottom:16px">
                Ingredients
              </h3>
              <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
                <li
                  v-for="(ing, i) in post.ingredients"
                  :key="i"
                  style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:var(--yt-text)"
                >
                  <span style="width:22px;height:22px;border-radius:50%;background:var(--yt-accent);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">
                    {{ i + 1 }}
                  </span>
                  {{ ing }}
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <div style="margin-top:32px;padding-top:20px;border-top:1px solid var(--yt-border)">
          <RouterLink to="/" class="btn-ghost" style="padding-left:0">← All recipes</RouterLink>
        </div>
      </div>
    </article>

    <!-- Delete modal -->
    <ModalConfirm
      :show="showDeleteModal"
      title="Delete this recipe?"
      message="This will permanently remove the recipe and all its comments."
      confirm-label="Yes, delete"
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "@/stores/post.store";
import { useAuthStore } from "@/stores/auth.store";
import CommentSection from "@/components/CommentSection.vue";
import ModalConfirm from "@/components/ModalConfirm.vue";
import TagBadge from "@/components/TagBadge.vue";
import { diffStyle, avatarStyle, formatDate } from "@/utils/postDisplay";

const route     = useRoute();
const router    = useRouter();
const postStore = usePostStore();
const auth      = useAuthStore();

const showDeleteModal = ref(false);
const deleting        = ref(false);

const post    = computed(() => postStore.currentPost);
const isOwner = computed(() => auth.currentUser?._id === post.value?.author?._id);

onMounted(() => postStore.fetchPostById(route.params.id));

async function handleDelete() {
  deleting.value = true;
  try {
    await postStore.deletePost(post.value._id);
    router.push("/");
  } catch { alert("Failed to delete."); }
  finally { deleting.value = false; showDeleteModal.value = false; }
}
</script>
