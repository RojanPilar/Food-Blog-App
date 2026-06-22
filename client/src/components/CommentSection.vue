<template>
  <section class="mt-10">
    <h2 style="font-weight:700;font-size:22px;color:var(--yt-text);margin-bottom:24px">
      Reviews &amp; Notes
      <span style="font-family:Inter,sans-serif;font-size:14px;font-weight:400;color:var(--yt-text-muted);margin-left:8px">
        {{ comments.length }} comment{{ comments.length !== 1 ? "s" : "" }}
      </span>
    </h2>

    <!-- Add comment form (authenticated users only) -->
    <div v-if="auth.isAuthenticated" class="yt-panel" style="padding:20px;margin-bottom:28px">
      <h3 style="font-size:14px;font-weight:600;color:var(--yt-text);margin-bottom:14px">Leave your review</h3>

      <!-- Star rating picker -->
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:14px">
        <button
          v-for="n in 5"
          :key="n"
          type="button"
          @click="newComment.rating = n"
          style="font-size:24px;line-height:1;background:none;border:none;cursor:pointer;transition:transform 0.1s ease;padding:2px"
          :class="n <= (newComment.rating || 0) ? 'yt-star-filled' : 'yt-star-empty'"
          @mouseenter="$event.target.style.transform = 'scale(1.15)'"
          @mouseleave="$event.target.style.transform = 'scale(1)'"
        >★</button>
        <button
          v-if="newComment.rating"
          type="button"
          @click="newComment.rating = null"
          style="font-size:12px;color:var(--yt-text-muted);margin-left:8px;background:none;border:none;cursor:pointer"
        >Clear</button>
      </div>

      <textarea
        v-model="newComment.content"
        placeholder="Share your experience with this recipe — tips, substitutions, how it turned out..."
        rows="3"
        class="input-field resize-none"
        style="margin-bottom:14px"
      />

      <div style="display:flex;justify-content:flex-end">
        <button
          @click="submitComment"
          :disabled="!newComment.content.trim() || submitting"
          class="btn-primary"
        >
          <svg v-if="submitting" width="16" height="16" class="animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {{ submitting ? "Posting..." : "Post review" }}
        </button>
      </div>
    </div>

    <div v-else class="yt-panel" style="padding:20px;margin-bottom:28px;text-align:center">
      <p style="font-size:14px;color:var(--yt-text-muted)">
        <RouterLink to="/login" style="color:var(--yt-accent);font-weight:600;text-decoration:none" class="hover:underline">Sign in</RouterLink>
        to leave a review
      </p>
    </div>

    <!-- Comment list -->
    <div v-if="comments.length" style="display:flex;flex-direction:column;gap:14px">
      <div v-for="comment in comments" :key="comment._id" class="yt-comment-card">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
          <div style="display:flex;align-items:center;gap:12px">
            <div
              class="yt-avatar-ring"
              style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0"
              :style="avatarStyle(comment.author?.username)"
            >
              {{ comment.author?.username?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <span style="font-size:14px;font-weight:600;color:var(--yt-text)">{{ comment.author?.username }}</span>
              <div style="display:flex;align-items:center;gap:8px;margin-top:2px">
                <span v-if="comment.rating" style="font-size:13px">
                  <span class="yt-star-filled">{{ "★".repeat(comment.rating) }}</span><span class="yt-star-empty">{{ "★".repeat(5 - comment.rating) }}</span>
                </span>
                <span style="font-size:12px;color:var(--yt-text-hint)">{{ formatDate(comment.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Delete button (comment owner, post owner, or admin) -->
          <button
            v-if="canDeleteComment(comment)"
            @click="handleDeleteComment(comment._id)"
            class="yt-icon-danger"
            style="background:none;border:none;cursor:pointer;padding:4px;flex-shrink:0"
            title="Delete comment"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>

        <p style="font-size:14px;color:var(--yt-text);line-height:1.6;margin-top:12px;padding-left:44px">{{ comment.content }}</p>
      </div>
    </div>

    <div v-else style="text-align:center;padding:40px 0;color:var(--yt-text-muted)">
      <p style="font-size:36px;margin-bottom:8px">🍽️</p>
      <p style="font-size:14px">No reviews yet — be the first to share your experience!</p>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { usePostStore } from "@/stores/post.store";
import { avatarStyle, formatDate } from "@/utils/postDisplay";

const props = defineProps({
  comments:   { type: Array, required: true },
  postId:     { type: String, required: true },
  postAuthorId: { type: String, default: "" },
});

const auth = useAuthStore();
const postStore = usePostStore();
const submitting = ref(false);

const newComment = reactive({ content: "", rating: null });

async function submitComment() {
  if (!newComment.content.trim()) return;
  submitting.value = true;
  try {
    await postStore.addComment(props.postId, {
      content: newComment.content,
      rating: newComment.rating,
    });
    newComment.content = "";
    newComment.rating = null;
  } catch {
    alert("Failed to post comment.");
  } finally {
    submitting.value = false;
  }
}

async function handleDeleteComment(commentId) {
  if (!confirm("Delete this comment?")) return;
  await postStore.deleteComment(props.postId, commentId);
}

function canDeleteComment(comment) {
  if (!auth.isAuthenticated) return false;
  const userId = auth.currentUser?._id;
  return (
    comment.author?._id === userId ||
    props.postAuthorId === userId ||
    auth.isAdmin
  );
}
</script>
