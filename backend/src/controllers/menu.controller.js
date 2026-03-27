const Menu = require("../models/Menu.model");
const Category = require("../models/Category.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.getAllMenuItems = catchAsync(async (req, res, next) => {
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

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: menuItems.length,
    data: menuItems,
  });
});

exports.getMenuItemById = catchAsync(async (req, res, next) => {
  const menuItem = await Menu.findById(req.params.id).populate(
    "category",
    "name",
  );

  if (!menuItem) {
    return next(new AppError("Menu item not found", HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: menuItem,
  });
});

exports.getMenuByCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ name: req.params.category });

  if (!category) {
    return next(new AppError("Category not found", HTTP_STATUS.NOT_FOUND));
  }

  const menuItems = await Menu.find({
    category: category._id,
    isAvailable: true,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: menuItems.length,
    data: menuItems,
  });
});

exports.getSpecials = catchAsync(async (req, res, next) => {
  const specials = await Menu.find({ isSpecial: true, isAvailable: true })
    .populate("category", "name")
    .limit(10);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: specials.length,
    data: specials,
  });
});

exports.createMenuItem = catchAsync(async (req, res, next) => {
  const menuItem = await Menu.create(req.body);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.CREATED,
    data: menuItem,
  });
});

exports.updateMenuItem = catchAsync(async (req, res, next) => {
  const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!menuItem) {
    return next(new AppError("Menu item not found", HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.UPDATED,
    data: menuItem,
  });
});

exports.deleteMenuItem = catchAsync(async (req, res, next) => {
  const menuItem = await Menu.findByIdAndDelete(req.params.id);

  if (!menuItem) {
    return next(new AppError("Menu item not found", HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.DELETED,
  });
});

exports.toggleAvailability = catchAsync(async (req, res, next) => {
  const menuItem = await Menu.findById(req.params.id);

  if (!menuItem) {
    return next(new AppError("Menu item not found", HTTP_STATUS.NOT_FOUND));
  }

  menuItem.isAvailable = !menuItem.isAvailable;
  await menuItem.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Item is now ${menuItem.isAvailable ? "available" : "unavailable"}`,
    data: menuItem,
  });
});
