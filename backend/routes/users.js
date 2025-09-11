const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// ✅ Get Profile
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update Profile
router.put("/update", auth, async (req, res) => {
  try {
    const { username, avatar, bio, password } = req.body;
    let updateData = { username, avatar, bio };

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    // 🔑 यहाँ req.user की जगह req.userId use करेंगे
    const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
