// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // <-- index.html serve करने के लिए

// ======================
// Routes
// ======================
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));

// ======================
// MongoDB Atlas Connect
// ======================
mongoose.connect("mongodb+srv://manisha:TSJtBL0Wwl0GJKry@cluster0.e0crvnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
 {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected to Atlas"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ======================
// Start server
// ======================
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
