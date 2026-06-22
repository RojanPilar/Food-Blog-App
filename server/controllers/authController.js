const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper: generate JWT ───────────────────────────────────────────────────────
const generateToken = (userId) => {
  // Secret Key Placeholder fallback prevents token crash if .env fails to mount
  const secretKey = process.env.JWT_SECRET || "fallback_temporary_super_secret_key_123";
  
  return jwt.sign({ id: userId }, secretKey, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ── Helper: uniform auth response ─────────────────────────────────────────────
const sendAuthResponse = (res, statusCode, user) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
  });
};

// ── POST /api/auth/register ────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return res.status(400).json({
        success: false,
        message: `${field} is already registered.`,
      });
    }

    const user = await User.create({ username, email, password, bio });
    sendAuthResponse(res, 201, user);
  } catch (error) {
    console.error("❌ REGISTRATION CRASH LOG:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    res.status(500).json({ success: false, message: "Registration failed. Please try again." });
  }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Explicitly select password (it's hidden by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    sendAuthResponse(res, 200, user);
  } catch (error) {
    console.error("❌ LOGIN CRASH LOG:", error);
    res.status(500).json({ success: false, message: "Login failed. Please try again.", debug: error.message });
  }
};

// ── GET /api/auth/me (protected) ──────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    console.error("❌ GET ME CRASH LOG:", error);
    res.status(500).json({ success: false, message: "Could not fetch user profile." });
  }
};

// ── PUT /api/auth/me (protected) ──────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, avatar },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    console.error("❌ UPDATE PROFILE CRASH LOG:", error);
    res.status(500).json({ success: false, message: "Could not update profile." });
  }
};

module.exports = { register, login, getMe, updateProfile };
