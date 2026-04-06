// backend/src/controllers/food.Controller.js
const Food = require("../models/Food");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// @desc    Get single food item by ID (includes ratings)
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

    // Get user's interaction status if logged in
    let userLiked = false;
    let userDisliked = false;
    let userRating = null;

    if (req.user) {
      userLiked = food.hasUserLiked(req.user.id);
      userDisliked = food.hasUserDisliked(req.user.id);
      userRating = food.getUserRating(req.user.id);
    }

    res.status(200).json({
      success: true,
      data: food,
      userLiked,
      userDisliked,
      userRating,
    });
  } catch (err) {
    console.error("Get food by ID error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Add rating to food item
// @route   POST /api/food/:id/rate
exports.rateFood = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const foodId = req.params.id;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid rating between 1 and 5",
      });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        error: "Food item not found",
      });
    }

    // Check if user already rated
    const existingRatingIndex = food.ratings.findIndex(
      (r) => r.user.toString() === userId,
    );

    if (existingRatingIndex > -1) {
      // Update existing rating
      food.ratings[existingRatingIndex].rating = rating;
      if (review) food.ratings[existingRatingIndex].review = review;
    } else {
      // Add new rating
      food.ratings.push({
        user: userId,
        rating,
        review: review || "",
      });
    }

    await food.updateAverageRating();

    res.status(200).json({
      success: true,
      data: {
        averageRating: food.averageRating,
        totalRatings: food.totalRatings,
        userRating: rating,
      },
      message: "Rating submitted successfully!",
    });
  } catch (err) {
    console.error("Rate food error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Toggle like on food item
// @route   POST /api/food/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const foodId = req.params.id;
    const userId = req.user.id;

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        error: "Food item not found",
      });
    }

    const result = await food.toggleLike(userId);

    res.status(200).json({
      success: true,
      data: result,
      message:
        result.action === "liked"
          ? "You liked this item!"
          : "You removed your like",
    });
  } catch (err) {
    console.error("Toggle like error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Toggle dislike on food item
// @route   POST /api/food/:id/dislike
exports.toggleDislike = async (req, res) => {
  try {
    const foodId = req.params.id;
    const userId = req.user.id;

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        error: "Food item not found",
      });
    }

    const result = await food.toggleDislike(userId);

    res.status(200).json({
      success: true,
      data: result,
      message:
        result.action === "disliked"
          ? "You disliked this item"
          : "You removed your dislike",
    });
  } catch (err) {
    console.error("Toggle dislike error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get top rated items
// @route   GET /api/food/top-rated
exports.getTopRated = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const foods = await Food.find({ quantity: { $gt: 0 }, isAvailable: true })
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (err) {
    console.error("Get top rated error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get most liked items
// @route   GET /api/food/most-liked
exports.getMostLiked = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const foods = await Food.find({ quantity: { $gt: 0 }, isAvailable: true })
      .sort({ likeCount: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (err) {
    console.error("Get most liked error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get best selling items (most sold)
// @route   GET /api/food/best-selling
exports.getBestSelling = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const foods = await Food.find({ quantity: { $gt: 0 }, isAvailable: true })
      .sort({ soldCount: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (err) {
    console.error("Get best selling error:", err);
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
      soldCount: 0,
      ratings: [],
      likes: [],
      dislikes: [],
      likeCount: 0,
      dislikeCount: 0,
      averageRating: 0,
      totalRatings: 0,
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
    const { category, search, isAvailable, sortBy } = req.query;
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

    let query = Food.find(filter);

    // Apply sorting
    if (sortBy === "rating") {
      query = query.sort({ averageRating: -1, totalRatings: -1 });
    } else if (sortBy === "popular") {
      query = query.sort({ soldCount: -1 });
    } else if (sortBy === "likes") {
      query = query.sort({ likeCount: -1 });
    } else {
      query = query.sort({ category: 1, name: 1 });
    }

    const menu = await query;
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

    // Calculate total sold count
    const totalSold = menu.reduce(
      (sum, item) => sum + (item.soldCount || 0),
      0,
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
        totalSold: totalSold,
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

// Add this function to food.Controller.js

// @desc    Get related products based on category and likes
// @route   GET /api/food/:id/related
exports.getRelatedProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const limit = parseInt(req.query.limit) || 4;

    // Get the current product
    const currentProduct = await Food.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Find related products:
    // 1. Same category
    // 2. Different from current product
    // 3. In stock
    // 4. Sort by likeCount and soldCount (popularity)
    const relatedProducts = await Food.find({
      _id: { $ne: productId }, // Exclude current product
      category: currentProduct.category, // Same category
      quantity: { $gt: 0 }, // In stock
      isAvailable: true,
    })
      .sort({
        likeCount: -1, // Most liked first
        soldCount: -1, // Then best selling
        averageRating: -1, // Then highest rated
      })
      .limit(limit);

    // If not enough products in same category, get popular products from other categories
    if (relatedProducts.length < limit) {
      const remainingCount = limit - relatedProducts.length;
      const existingIds = [productId, ...relatedProducts.map((p) => p._id)];

      const popularProducts = await Food.find({
        _id: { $nin: existingIds },
        quantity: { $gt: 0 },
        isAvailable: true,
      })
        .sort({
          likeCount: -1,
          soldCount: -1,
          averageRating: -1,
        })
        .limit(remainingCount);

      relatedProducts.push(...popularProducts);
    }

    // Get user's interaction status for each related product if logged in
    let enhancedProducts = [...relatedProducts];

    if (req.user) {
      enhancedProducts = relatedProducts.map((product) => {
        const productObj = product.toObject();
        productObj.userLiked = product.hasUserLiked(req.user.id);
        productObj.userDisliked = product.hasUserDisliked(req.user.id);
        productObj.userRating = product.getUserRating(req.user.id);
        return productObj;
      });
    }

    res.status(200).json({
      success: true,
      count: enhancedProducts.length,
      data: enhancedProducts,
    });
  } catch (err) {
    console.error("Get related products error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
