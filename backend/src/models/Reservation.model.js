const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  time: {
    type: String,
    required: [true, "Time is required"],
  },
  guests: {
    type: Number,
    required: [true, "Number of guests is required"],
    min: [1, "At least 1 guest"],
    max: [20, "Maximum 20 guests"],
  },
  specialRequests: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "seated",
      "completed",
      "cancelled",
      "no_show",
    ],
    default: "pending",
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

ReservationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Reservation", ReservationSchema);
