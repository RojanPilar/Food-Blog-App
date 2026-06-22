const Post = require("../models/Post");

// ── POST /api/posts/:postId/comments — protected ──────────────────────────────
const addComment = async (req, res) => {
  try {
    const { content, rating } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: "Comment content is required." });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const comment = {
      author: req.user._id,
      content: content.trim(),
      rating: rating || null,
    };

    post.comments.push(comment);
    await post.save();

    // Populate the newly added comment's author
    await post.populate("comments.author", "username avatar");

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({ success: true, data: { comment: newComment } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add comment." });
  }
};

// ── DELETE /api/posts/:postId/comments/:commentId — protected ─────────────────
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    const isCommentOwner = comment.author.toString() === req.user._id.toString();
    const isPostOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCommentOwner && !isPostOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({ success: true, message: "Comment deleted.", data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete comment." });
  }
};

module.exports = { addComment, deleteComment };
