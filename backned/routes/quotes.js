const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// 📌 GET /api/quote?lang=hindi&cat=sad
router.get("/", (req, res) => {
  let { lang, cat } = req.query;

  if (!lang || !cat) {
    return res.status(400).json({ error: "Language and category are required" });
  }

  // lowercase कर दो ताकि match हो जाए
  lang = lang.toLowerCase();
  cat = cat.toLowerCase();

  // file ka path banao (example: frontend/quotes/hindi/sad.json)
  const filePath = path.join(__dirname, `../frontend/quotes/${lang}/${cat}.json`);

  if (!fs.existsSync(filePath)) {
    console.log("❌ File not found:", filePath);
    return res.status(404).json({ error: "No quotes file found" });
  }

  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const allQuotes = JSON.parse(fileData);

    if (!Array.isArray(allQuotes) || allQuotes.length === 0) {
      return res.status(404).json({ error: "No quotes found in file" });
    }

    // random quote select
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];

    res.json({ quote: randomQuote });
  } catch (err) {
    console.error("❌ Error reading JSON:", err);
    res.status(500).json({ error: "Failed to read quotes" });
  }
});

module.exports = router;
