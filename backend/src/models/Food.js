const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ["Coffee", "Pastry", "Meal", "Drink"],
      default: "Coffee",
    },
    isAvailable: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Food", FoodSchema);
