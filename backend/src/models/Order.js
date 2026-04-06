// backend/src/models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number, default: null },
        discountedPrice: { type: Number, default: null },
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Food",
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
    originalTotalPrice: { type: Number, default: 0.0 },
    discountApplied: { type: Number, default: 0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    paymentReference: { type: String },
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Preparing", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", OrderSchema);
