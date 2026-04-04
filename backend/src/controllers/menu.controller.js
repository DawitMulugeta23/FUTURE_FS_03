// backend/src/controllers/menu.controller.js
const Menu = require("../models/Menu.model");
const Category = require("../models/Category.model");

exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, isAvailable, isSpecial, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (isAvailable) filter.isAvailable = isAvailable === "true";
    if (isSpecial) filter.isSpecial = isSpecial === "true";
    if (search) {
      filter.$text = { $search: search };
    }

    const menuItems = await Menu.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id).populate(
      "category",
      "name",
    );

    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, error: "Menu item not found" });
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMenuByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.category });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    const menuItems = await Menu.find({
      category: category._id,
      isAvailable: true,
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSpecials = async (req, res) => {
  try {
    const specials = await Menu.find({ isSpecial: true, isAvailable: true })
      .populate("category", "name")
      .limit(10);

    res.status(200).json({
      success: true,
      count: specials.length,
      data: specials,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.create(req.body);

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, error: "Menu item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, error: "Menu item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, error: "Menu item not found" });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: `Item is now ${menuItem.isAvailable ? "available" : "unavailable"}`,
      data: menuItem,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
