// controllers/service.controller.js
const Service = require("../models/Service.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

// Get all services
exports.getAllServices = catchAsync(async (req, res, next) => {
  const { category, isAvailable, isPopular, search } = req.query;
  const filter = {};

  if (category && category !== "all") filter.category = category;
  if (isAvailable === "true") filter.isAvailable = true;
  if (isPopular === "true") filter.isPopular = true;
  if (search) {
    filter.$text = { $search: search };
  }

  const services = await Service.find(filter).sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// Get single service
exports.getServiceById = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError("Service not found", HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: service,
  });
});

// Create service (Admin only)
exports.createService = catchAsync(async (req, res, next) => {
  const service = await Service.create(req.body);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "Service created successfully",
    data: service,
  });
});

// Update service (Admin only)
exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    return next(new AppError("Service not found", HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Service updated successfully",
    data: service,
  });
});

// Delete service (Admin only)
exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    return next(new AppError("Service not found", HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Service deleted successfully",
  });
});

// Toggle service availability
exports.toggleAvailability = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError("Service not found", HTTP_STATUS.NOT_FOUND));
  }

  service.isAvailable = !service.isAvailable;
  await service.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Service is now ${service.isAvailable ? "available" : "unavailable"}`,
    data: service,
  });
});

// Get popular services
exports.getPopularServices = catchAsync(async (req, res, next) => {
  const services = await Service.find({ isPopular: true, isAvailable: true })
    .limit(6)
    .sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// Get service categories (for filter dropdown)
exports.getServiceCategories = catchAsync(async (req, res, next) => {
  const categories = [
    { value: "food", label: "Food Service" },
    { value: "beverage", label: "Beverage Service" },
    { value: "event", label: "Event Service" },
    { value: "catering", label: "Catering Service" },
    { value: "special", label: "Special Service" },
    { value: "other", label: "Other Service" },
  ];

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: categories,
  });
});
