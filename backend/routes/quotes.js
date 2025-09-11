// backend/routes/quotes.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

/**
 * GET /api/quotes?language=english&category=sad
 * Returns entire array of quotes from frontend/quotes/{language}/{category}.json
 * This version logs the resolved path and helpful errors.
 */

router.get("/", (req, res) => {
  try {
    let { language, category } = req.query;

    if (!language || !category) {
      return res.status(400).json({ error: "Language and category are required" });
    }

    language = String(language).toLowerCase();
    category = String(category).toLowerCase();

    // Resolve project root reliably (two levels up from routes folder)
    const PROJECT_ROOT = path.resolve(__dirname, "..", ".."); // backend/routes -> project root
    const filePath = path.join(PROJECT_ROOT, "frontend", "quotes", language, `${category}.json`);

    console.log("[/api/quotes] request:", { language, category, filePath });

    if (!fs.existsSync(filePath)) {
      console.error("[/api/quotes] File not found:", filePath);
      return res.status(404).json({ error: "No quotes file found", filePath });
    }

    const fileData = fs.readFileSync(filePath, "utf8");
    const allQuotes = JSON.parse(fileData);

    if (!Array.isArray(allQuotes) || allQuotes.length === 0) {
      return res.status(404).json({ error: "No quotes found in file" });
    }

    // Return full array (frontend expects array of strings)
    return res.json(allQuotes);
  } catch (err) {
    console.error("[/api/quotes] Unexpected error:", err);
    return res.status(500).json({ error: "Failed to read quotes", details: err.message });
  }
});

module.exports = router;
