require("dotenv").config();
const mongoose = require("mongoose");
const User     = require("./models/User");
const Post     = require("./models/Post");

const users = [
  {
    username: "admin",
    email:    "admin@foodblog.dev",
    password: "Admin@123",
    bio:      "Site administrator.",
    role:     "admin",
  },
  {
    username: "chefmarco",
    email:    "marco@foodblog.dev",
    password: "Chef@123",
    bio:      "Italian home cook from Naples.",
  },
  {
    username: "bakerlisa",
    email:    "lisa@foodblog.dev",
    password: "Baker@123",
    bio:      "Sourdough enthusiast and pastry lover.",
  },
  {
    username: "foodieken",
    email:    "ken@foodblog.dev",
    password: "Foodie@123",
    bio:      "Street food explorer.",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing posts to ensure a clean slate
    await Post.deleteMany({});
    console.log("Cleared old posts database collection.");

    for (const u of users) {
      let user = await User.findOne({ email: u.email });
      
      if (!user) {
        user = new User(u);
        await user.save();
        if (u.role) {
          await User.updateOne({ email: u.email }, { role: u.role });
        }
        console.log(`Created user: ${u.username} (${u.role || "user"})`);
      } else {
        if (u.role && user.role !== u.role) {
          await User.updateOne({ email: u.email }, { role: u.role });
          console.log(`Updated role for ${u.username} → ${u.role}`);
        } else {
          console.log(`User ${u.username} already exists`);
        }
      }

      // ── Create dummy posts for creators ──────────────────────────────────
      if (u.username === "chefmarco") {
        await Post.create({
          title: "Authentic Neapolitan Pizza Secrets",
          content: "The secret is all in the hydration of the dough and the temperature of your oven!",
          excerpt: "Learn how to bake authentic Neapolitan style pizza at home.",
          author: user._id,
          category: "Italian",
          isPublished: true,
          difficulty: "Intermediate",
          tags: ["Italian", "Dinner", "Baking"]
        });
        console.log("Created sample post for chefmarco");
      }
      
      if (u.username === "bakerlisa") {
        await Post.create({
          title: "Perfecting My Sourdough Starter",
          content: "Day 7 update: The bubbles are looking magnificent and smells delightfully sour.",
          excerpt: "A simple guide to managing wild yeast sourdough cultures.",
          author: user._id,
          category: "Bakery",
          isPublished: true,
          difficulty: "Beginner",
          tags: ["Baking", "Breakfast"]
        });
        console.log("Created sample post for bakerlisa");
      }
    }

    console.log("\nSeed Operation Successful!");
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected. Done.");
  }
}

seed();
