const Review = require("../models/Review.model");
const Menu = require("../models/Menu.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.createReview = catchAsync(async (req, res, next) => {
  const { menuItem, rating, title, comment } = req.body;

  const review = await Review.create({
    user: req.user.id,
    userName: req.user.name,
    menuItem: menuItem || null,
    rating,
    title,
    comment,
  });

  if (menuItem) {
    const menuReviews = await Review.find({ menuItem, isApproved: true });
    const avgRating =
      menuReviews.reduce((sum, r) => sum + r.rating, 0) / menuReviews.length;

    await Menu.findByIdAndUpdate(menuItem, {
      rating: avgRating,
      totalReviews: menuReviews.length,
    });
  }

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.CREATED,
    data: review,
  });
});

exports.getReviewsByMenuItem = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({
    menuItem: req.params.menuId,
    isApproved: true,
  }).sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

exports.getAverageRating = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({
    menuItem: req.params.menuId,
    isApproved: true,
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      averageRating,
      totalReviews: reviews.length,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const { isApproved, menuItem } = req.query;
  const filter = {};

  if (isApproved) filter.isApproved = isApproved === "true";
  if (menuItem) filter.menuItem = menuItem;

  const reviews = await Review.find(filter)
    .populate("user", "name")
    .populate("menuItem", "name")
    .sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", HTTP_STATUS.NOT_FOUND));
  }

  if (review.user.toString() !== req.user.id) {
    return next(new AppError("Not authorized", HTTP_STATUS.FORBIDDEN));
  }

  const { rating, title, comment } = req.body;
  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (comment) review.comment = comment;

  await review.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.UPDATED,
    data: review,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", HTTP_STATUS.NOT_FOUND));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("Not authorized", HTTP_STATUS.FORBIDDEN));
  }

  await review.deleteOne();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.DELETED,
  });
});

exports.approveReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", HTTP_STATUS.NOT_FOUND));
  }

  review.isApproved = true;
  await review.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Review approved",
    data: review,
  });
});
