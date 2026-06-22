const Post = require("../models/Post");

// ── GET /api/posts — public: get all posts ─────────────────────────────────────
const getAllPosts = async (req, res) => {
  try {
    const { tag, difficulty, search, page = 1, limit = 10 } = req.query;

    const filter = { isPublished: true };
    if (tag) filter.tags = { $in: [tag] };
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { cuisine: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .populate("author", "username avatar bio")
      .select("-comments") // Exclude comments in list view for performance
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch posts." });
  }
};

// ── GET /api/posts/:id — public: get single post ───────────────────────────────
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar bio")
      .populate("comments.author", "username avatar");

    if (!post || !post.isPublished) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    res.status(200).json({ success: true, data: { post } });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ success: false, message: "Post not found." });
    }
    res.status(500).json({ success: false, message: "Failed to fetch post." });
  }
};

// ── POST /api/posts — protected: create a post ─────────────────────────────────
const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      coverImage,
      cookingTime,
      prepTime,
      servings,
      difficulty,
      tags,
      cuisine,
      ingredients,
    } = req.body;

    const post = await Post.create({
      title,
      content,
      excerpt,
      coverImage,
      cookingTime,
      prepTime,
      servings,
      difficulty,
      tags,
      cuisine,
      ingredients,
      author: req.user._id,
    });

    await post.populate("author", "username avatar");

    res.status(201).json({ success: true, data: { post } });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    res.status(500).json({ success: false, message: "Failed to create post." });
  }
};

// ── PUT /api/posts/:id — protected: owner only ────────────────────────────────
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    // Authorization: only the author can update
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post.",
      });
    }

    const updatableFields = [
      "title", "content", "excerpt", "coverImage",
      "cookingTime", "prepTime", "servings", "difficulty",
      "tags", "cuisine", "ingredients", "isPublished",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) post[field] = req.body[field];
    });

    await post.save();
    await post.populate("author", "username avatar");

    res.status(200).json({ success: true, data: { post } });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    res.status(500).json({ success: false, message: "Failed to update post." });
  }
};

// ── DELETE /api/posts/:id — protected: owner OR admin ─────────────────────────
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post.",
      });
    }

    await post.deleteOne();

    res.status(200).json({ success: true, message: "Post deleted successfully.", data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ success: false, message: "Post not found." });
    }
    res.status(500).json({ success: false, message: "Failed to delete post." });
  }
};

// ── GET /api/posts/my-posts — protected: author's own posts ───────────────────
const getMyPosts = async (req, res) => {
  try {
    // 1. Safety check to make sure the user id exists on the request object
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User context missing from authentication request." 
      });
    }

    // 2. Fetch posts belonging to this author
    const posts = await Post.find({ author: userId })
      .select("-comments")
      .sort({ createdAt: -1 });

    // 3. Always wrap empty values cleanly so the client doesn't choke on undefined lists
    res.status(200).json({ success: true, data: { posts: posts || [] } });
  } catch (error) {
    // 4. Expose the actual error stack trace directly into Git Bash
    console.error("❌ CRITICAL ERROR IN GET_MY_POSTS:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch your posts.", 
      errorDetails: error.message 
    });
  }
};


module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost, getMyPosts };
