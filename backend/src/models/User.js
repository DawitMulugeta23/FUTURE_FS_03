// backend/src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

    // Password reset fields with 6-digit code
    resetCode: { type: String },
    resetCodeExpire: { type: Date },
    resetCodeVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Hash password before saving - FIXED: removed next parameter
UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
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
  // Generate 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Save hashed code to database
  this.resetCode = code;

  // Set expire (10 minutes)
  this.resetCodeExpire = Date.now() + 10 * 60 * 1000;
  this.resetCodeVerified = false;

  return code;
};

// Verify reset code
UserSchema.methods.verifyResetCode = function (code) {
  return this.resetCode === code && this.resetCodeExpire > Date.now();
};

module.exports = mongoose.model("User", UserSchema);
