const express = require("express");
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ── FIX: /my-posts MUST come before /:id — otherwise Express treats "my-posts"
//         as a post ID and calls getPostById, returning a CastError 404.
// ── Public routes ──────────────────────────────────────────────────────────────
router.get("/", getAllPosts);
router.get("/my-posts", protect, getMyPosts); // ← must precede /:id
router.get("/:id", getPostById);

// ── Protected routes ───────────────────────────────────────────────────────────
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
