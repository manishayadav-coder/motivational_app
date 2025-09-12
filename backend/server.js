// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// Middleware
// ======================





app.use(cors({
  origin: "*",   // testing ke liye sab allow
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.static("public")); // <-- index.html serve करने के लिए

// ======================
// Routes
// ======================
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));

// ✅ Quotes API direct yahin
app.get("/api/quotes", (req, res) => {
  const { language, category } = req.query;

  if (!language || !category) {
    return res.status(400).json({ error: "⚠️ Language and category required" });
  }

  // quotes folder backend ke andar hona chahiye
  const filePath = path.join(__dirname, "quotes", language, `${category}.json`);

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

// ======================
// MongoDB Atlas Connect
// ======================
mongoose
  .connect(
    "mongodb+srv://manisha:TSJtBL0Wwl0GJKry@cluster0.e0crvnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB Connected to Atlas"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ======================
// Start server
// ======================
app.get("/", (req, res) => {
  res.send("backend is working");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
