const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    avatar: { 
      type: String, 
      default: "" 
    },
    bio: { 
      type: String, 
      default: ""   // ✅ User अपनी bio डाल सके
    },
    followers: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    following: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }]
  },
  { timestamps: true }
);

// 🔐 Password Hash Middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Password Match Method
UserSchema.methods.matchPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// ✅ Fix: अगर User model पहले से compile है तो उसी को use करो
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
