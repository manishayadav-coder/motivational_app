const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// multer storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "uploads",
    resource_type: "auto",
  }),
});

const upload = multer({ storage });

// upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const newPost = new Post({
      caption: req.body.caption || "",
      author: req.body.author || "Anonymous",
      imageUrl: req.file && req.file.mimetype.startsWith("image") ? req.file.path : null,
      videoUrl: req.file && req.file.mimetype.startsWith("video") ? req.file.path : null,
      type: req.file.mimetype.startsWith("video") ? "video" : "image",
    });

    const savedPost = await newPost.save();
    res.json({ success: true, post: savedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

// get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// delete post
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;
