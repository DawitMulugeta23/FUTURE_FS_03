// backend/src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },

    // Staff/Admin specific fields
    department: {
      type: String,
      enum: ["management", "kitchen", "service", "delivery"],
      default: "service",
    },
    employeeId: { type: String, unique: true, sparse: true },
    hireDate: { type: Date },
    shift: {
      type: String,
      enum: ["morning", "evening", "night"],
      default: "morning",
    },
  },
  { timestamps: true },
);

// Encrypt password before saving - FIXED: properly handle next
UserSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
