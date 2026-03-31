const Food = require("../models/Food");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// @desc    Add new food item
// @route   POST /api/food
exports.addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let imageUrl = "";

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: "Name, description, price, and category are required",
      });
    }

    // Handle image upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "yesekela_cafe",
      });
      imageUrl = result.secure_url;
      if (req.file.path) fs.unlinkSync(req.file.path);
    } else if (req.body.imagePath && typeof req.body.imagePath === "string") {
      const result = await cloudinary.uploader.upload(req.body.imagePath, {
        folder: "yesekela_cafe",
      });
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({
        success: false,
        error: "Food image is required",
      });
    }

    const food = await Food.create({
      name,
      description,
      price: Number(price),
      category,
      image: imageUrl,
    });

    res.status(201).json({ success: true, data: food });
  } catch (err) {
    console.error("Add food error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all food items
// @route   GET /api/food
exports.getMenu = async (req, res) => {
  try {
    const menu = await Food.find().sort("category");
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update food item
// @route   PUT /api/food/:id
exports.updateFood = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;
    const updateData = {
      name,
      description,
      price: price !== undefined ? Number(price) : undefined,
      category,
      isAvailable,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "yesekela_cafe",
      });
      updateData.image = result.secure_url;
      if (req.file.path) fs.unlinkSync(req.file.path);
    }

    const food = await Food.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!food) {
      return res.status(404).json({ success: false, error: "Food not found" });
    }

    res.status(200).json({ success: true, data: food });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete food item
// @route   DELETE /api/food/:id
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, error: "Food not found" });
    }

    // Delete from cloudinary if needed
    if (food.image) {
      const publicId = food.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`yesekela_cafe/${publicId}`);
    }

    await food.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Food deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
