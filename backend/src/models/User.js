// backend/src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    // Common fields for all users
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },

    // Customer specific fields
    deliveryAddress: {
      street: { type: String },
      city: { type: String },
      nearBy: { type: String },
    },
    favoriteItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    // Admin specific fields
    adminCode: { type: String, select: false }, // Secret code for admin registration
    adminPermissions: {
      canManageMenu: { type: Boolean, default: false },
      canManageOrders: { type: Boolean, default: false },
      canManageUsers: { type: Boolean, default: false },
      canViewReports: { type: Boolean, default: false },
      canManageSettings: { type: Boolean, default: false },
    },
    department: {
      type: String,
      enum: ["management", "kitchen", "service", "delivery"],
      default: "service",
    },
    employeeId: { type: String, unique: true, sparse: true },
    hireDate: { type: Date },
    salary: { type: Number, select: false },

    // Staff specific fields
    shift: {
      type: String,
      enum: ["morning", "evening", "night"],
      default: "morning",
    },
  },
  { timestamps: true },
);

// Encrypt password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate admin code (for new admin registration)
UserSchema.statics.generateAdminCode = () => {
  return "ADMIN" + Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = mongoose.model("User", UserSchema);
