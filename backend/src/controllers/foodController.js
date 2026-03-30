const Food = require("../models/Food");
const cloudinary = require("../config/cloudinary");

// @desc    Add new food item
// @route   POST /api/food
exports.addFood = async (req, res) => {
  try {
    const { name, description, price, category, imagePath } = req.body;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "yesekela_cafe",
    });

    const food = await Food.create({
      name,
      description,
      price,
      category,
      image: result.secure_url,
    });

    res.status(201).json({ success: true, data: food });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all food items
// @route   GET /api/food
exports.getMenu = async (req, res) => {
  try {
    const menu = await Food.find();
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
