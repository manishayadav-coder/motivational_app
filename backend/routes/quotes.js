const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  const { language, category } = req.query;

  if (!language || !category) {
    return res.status(400).json({ error: "⚠️ Language and category required" });
  }

  const filePath = path.join(__dirname, "..", "quotes", language, `${category}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "❌ Quotes not found" });
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw);
    return res.json({ quotes: json });
  } catch (err) {
    console.error("❌ Error reading quotes:", err);
    return res.status(500).json({ error: "Server error while reading quotes" });
  }
});

module.exports = router;
