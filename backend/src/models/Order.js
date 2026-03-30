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
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Food",
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { Date },
    paymentReference: { type: String }, // Chapa TX_Ref
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
