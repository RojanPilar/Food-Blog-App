// Shared display helpers for post cards & post detail.
// Previously this logic was copy-pasted in both PostCard.vue and
// PostDetailView.vue (including a literal #ff0000 in the avatar palette).
// Centralizing it here means the blue-theme palette only needs to be
// maintained in one place going forward.

const DIFFICULTY_COLORS = {
  Beginner: "background:#e8f5e9;color:#2e7d32",
  Intermediate: "background:#fff3e0;color:#e65100",
  Advanced: "background:#fce4ec;color:#c62828",
  "Pro Chef": "background:#ede7f6;color:#4527a0",
};

// Author-avatar background palette. The original literal "#ff0000" (pure
// YouTube red) has been swapped for a second blue tone — the rest of the
// rotation is left varied on purpose, the same way Slack/Discord/GitHub use
// multi-color avatars; only the brand-red was the actual problem.
const AVATAR_COLORS = ["#1565c0", "#0288d1", "#2e7d32", "#e65100", "#5e35b1", "#00838f", "#558b2f"];

export function diffStyle(level) {
  return DIFFICULTY_COLORS[level] || "background:#f5f5f5;color:#616161";
}

export function avatarStyle(username) {
  const idx = (username?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return `background:${AVATAR_COLORS[idx]};color:#fff;font-weight:700`;
}

export function formatTime(mins) {
  if (!mins) return "";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatDate(dateStr, opts = {}) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: opts.long ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}
