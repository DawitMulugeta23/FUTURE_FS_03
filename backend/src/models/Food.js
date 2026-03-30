const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    category: {
      type: String,
      enum: ["Coffee", "Pastry", "Meal", "Drink"],
      default: "Coffee",
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Food", FoodSchema);
