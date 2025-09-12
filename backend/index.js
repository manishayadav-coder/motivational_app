const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// ✅ Quotes API
app.get("/api/quotes", (req, res) => {
  const { language, category } = req.query;

  if (!language || !category) {
    return res.status(400).json({ error: "Language and category required" });
  }

  // Path of JSON file
  const filePath = path.join(__dirname, "quotes", language, `${category}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Quotes not found" });
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw);
    return res.json({ quotes: json });
  } catch (err) {
    return res.status(500).json({ error: "Error reading quotes" });
  }
});
