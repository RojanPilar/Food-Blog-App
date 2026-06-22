const mongoose = require("mongoose");

// ── Embedded Comment sub-schema ────────────────────────────────────────────────
const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null, // Optional star rating per comment
    },
  },
  { timestamps: true }
);

// ── Main Post schema ───────────────────────────────────────────────────────────
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Culinary Metadata ────────────────────────────────────────────────────
    cookingTime: {
      type: Number, // in minutes
      min: [1, "Cooking time must be at least 1 minute"],
    },
    prepTime: {
      type: Number, // in minutes
      default: 0,
    },
    servings: {
      type: Number,
      min: 1,
      default: 2,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Pro Chef"],
      default: "Intermediate",
    },
    tags: {
      type: [String],
      enum: [
        "Vegan",
        "Vegetarian",
        "Gluten-Free",
        "Dairy-Free",
        "Quick Meal",
        "Dessert",
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snack",
        "Appetizer",
        "Soup",
        "Salad",
        "Seafood",
        "Pasta",
        "Grilling",
        "Baking",
        "Asian",
        "Mediterranean",
        "Mexican",
        "Italian",
        "American",
      ],
      default: [],
    },
    cuisine: {
      type: String,
      default: "",
    },
    ingredients: {
      type: [String],
      default: [],
    },

    // ── Engagement ───────────────────────────────────────────────────────────
    comments: [commentSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ── Virtual: comment count ─────────────────────────────────────────────────────
postSchema.virtual("commentCount").get(function () {
  // SAFE FIX: Prevents crash when .select("-comments") is used
  return this.comments?.length || 0;
});

// ── Auto-generate excerpt if not provided ─────────────────────────────────────
postSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/(<([^>]+)>)/gi, "").substring(0, 250) + "...";
  }
  next();
});

// ── Ensure virtuals are included in JSON output ────────────────────────────────
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Post", postSchema);
