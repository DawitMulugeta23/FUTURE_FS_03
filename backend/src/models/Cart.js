// backend/src/models/Cart.js
const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Food",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Remove the pre-save hook that might be causing issues
// CartSchema.pre("save", function(next) {
//   this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
//   this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   next();
// });

module.exports = mongoose.model("Cart", CartSchema);
