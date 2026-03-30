// models/Service.model.js
const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Service name is required"],
    trim: true,
    unique: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  price: {
    type: Number,
    default: 0,
    min: [0, "Price cannot be negative"],
  },
  duration: {
    type: Number,
    default: 30,
    min: [5, "Duration must be at least 5 minutes"],
    max: [480, "Duration cannot exceed 8 hours"],
  },
  category: {
    type: String,
    enum: ["food", "beverage", "event", "catering", "special", "other"],
    default: "other",
  },
  image: {
    type: String,
    default: "default-service.jpg",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  requirements: {
    type: String,
    maxlength: [500, "Requirements cannot exceed 500 characters"],
  },
  includes: [String],
  maxCapacity: {
    type: Number,
    default: null,
  },
  bookingRequired: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ServiceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

ServiceSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Service", ServiceSchema);
