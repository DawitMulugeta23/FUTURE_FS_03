// backend/src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },

    // Track order history for discount
    hasPlacedOrder: { type: Boolean, default: false },
    orderCount: { type: Number, default: 0 },
    firstOrderDate: { type: Date },

    // Google OAuth fields
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: "" },
    emailVerified: { type: Boolean, default: false },

    // Password reset fields
    resetCode: { type: String },
    resetCodeExpire: { type: Date },
    resetCodeVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Hash password before saving - only if password is modified and not from Google
UserSchema.pre("save", async function () {
  if (this.isModified("password") && !this.googleId) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate 6-digit reset code
UserSchema.methods.generateResetCode = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetCode = code;
  this.resetCodeExpire = Date.now() + 10 * 60 * 1000;
  this.resetCodeVerified = false;
  return code;
};

// Verify reset code
UserSchema.methods.verifyResetCode = function (code) {
  return this.resetCode === code && this.resetCodeExpire > Date.now();
};

module.exports = mongoose.model("User", UserSchema);
