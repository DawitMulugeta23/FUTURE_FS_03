const Food = require("../models/Food");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// @desc    Add new food item
// @route   POST /api/food
exports.addFood = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, quantity } = req.body;
    let imageUrl = "";

    // Validate required fields
    if (!name || !description || !price || !category || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: "Name, description, price, category, and quantity are required",
      });
    }

    const parsedQuantity = Number(quantity);
    if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be a valid number greater than or equal to 0",
      });
    }

    // Handle image upload with better error handling
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "yesekela_cafe/menu",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto" },
          ],
        });
        imageUrl = result.secure_url;
        if (req.file.path) fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          success: false,
          error: "Failed to upload image. Please try again.",
        });
      }
    } else if (req.body.imageUrl) {
      // Handle image URL if provided
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        error: "Food image is required",
      });
    }

    const food = await Food.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: parsedQuantity,
      category,
      image: imageUrl,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json({
      success: true,
      data: food,
      message: "Menu item added successfully!",
    });
  } catch (err) {
    console.error("Add food error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all food items with filtering
// @route   GET /api/food
exports.getMenu = async (req, res) => {
  try {
    const { category, search, isAvailable } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const menu = await Food.find(filter).sort({ category: 1, name: 1 });
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    console.error("Get menu error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update food item
// @route   PUT /api/food/:id
exports.updateFood = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, quantity } = req.body;

    if (
      quantity !== undefined &&
      (Number.isNaN(Number(quantity)) || Number(quantity) < 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be a valid number greater than or equal to 0",
      });
    }

    const updateData = {
      name: name?.trim(),
      description: description?.trim(),
      price: price !== undefined ? Number(price) : undefined,
      quantity: quantity !== undefined ? Number(quantity) : undefined,
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : undefined,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    if (req.file) {
      try {
        // Get existing food to delete old image
        const existingFood = await Food.findById(req.params.id);
        if (existingFood && existingFood.image) {
          const publicId = existingFood.image
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "yesekela_cafe/menu",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto" },
          ],
        });
        updateData.image = result.secure_url;
        if (req.file.path) fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          success: false,
          error: "Failed to upload image. Please try again.",
        });
      }
    }

    const food = await Food.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!food) {
      return res.status(404).json({ success: false, error: "Food not found" });
    }

    res.status(200).json({
      success: true,
      data: food,
      message: "Menu item updated successfully!",
    });
  } catch (err) {
    console.error("Update food error:", err);
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

    // Delete image from cloudinary
    if (food.image) {
      try {
        const publicId = food.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
      }
    }

    await food.deleteOne();
    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully!",
    });
  } catch (err) {
    console.error("Delete food error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Toggle food availability
// @route   PATCH /api/food/:id/toggle
exports.toggleAvailability = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, error: "Food not found" });
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.status(200).json({
      success: true,
      data: food,
      message: `Item is now ${food.isAvailable ? "available" : "unavailable"}`,
    });
  } catch (err) {
    console.error("Toggle availability error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};
