// models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    // 👤 User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // auth use नहीं कर रहे तो required false
    },

    // 🖼 Image (optional)
    imageUrl: {
      type: String,
      default: null,
    },

    // 🎥 Video (optional)
    videoUrl: {
      type: String,
      default: null,
    },

    // 📌 Post type
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    // ✍️ Caption / Quote
    caption: {
      type: String,
      trim: true,
      default: "",
    },

    // ✍️ Author (extra field for quotes app)
    author: {
      type: String,
      default: "Anonymous",
    },

    // ❤️ Likes
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 💬 Comments
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
