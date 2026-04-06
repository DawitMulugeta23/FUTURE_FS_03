const Food = require("../models/Food");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// @desc    Get single food item by ID
// @route   GET /api/food/:id
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        error: "Food item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: food,
    });
  } catch (err) {
    console.error("Get food by ID error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Add new food item
// @route   POST /api/food
exports.addFood = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, quantity } =
      req.body;
    let imageUrl = "";

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      quantity === undefined
    ) {
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
      originalPrice: req.body.originalPrice
        ? Number(req.body.originalPrice)
        : Number(price),
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

// @desc    Get menu for customers (excludes zero quantity items)
// @route   GET /api/food
exports.getMenu = async (req, res) => {
  try {
    const { category, search, isAvailable } = req.query;
    let filter = {};

    // For customers, exclude items with quantity 0
    filter.quantity = { $gt: 0 };

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

// @desc    Get all menu items for admin (including zero quantity)
// @route   GET /api/food/admin/all
exports.getAllMenuForAdmin = async (req, res) => {
  try {
    const menu = await Food.find().sort({ category: 1, name: 1 });

    const inStock = menu.filter((item) => item.quantity > 0);
    const outOfStock = menu.filter((item) => item.quantity === 0);
    const lowStock = menu.filter(
      (item) => item.quantity > 0 && item.quantity <= 5,
    );

    res.status(200).json({
      success: true,
      data: {
        all: menu,
        inStock,
        outOfStock,
        lowStock,
        totalItems: menu.length,
        outOfStockCount: outOfStock.length,
        lowStockCount: lowStock.length,
      },
    });
  } catch (err) {
    console.error("Get all menu for admin error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get low stock items for notification
// @route   GET /api/food/low-stock
exports.getLowStockItems = async (req, res) => {
  try {
    const lowStock = await Food.find({
      quantity: { $lte: 5, $gt: 0 },
      isAvailable: true,
    }).sort({ quantity: 1 });

    const outOfStock = await Food.find({
      quantity: 0,
      isAvailable: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: {
        lowStock,
        outOfStock,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
      },
    });
  } catch (err) {
    console.error("Get low stock error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update food item
// @route   PUT /api/food/:id
exports.updateFood = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, quantity } =
      req.body;

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

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    if (req.file) {
      try {
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
