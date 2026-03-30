const User = require("../models/User.model");
const { generateToken } = require("../utils/token.service");
const { sendWelcomeEmail } = require("../utils/email.service");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists", HTTP_STATUS.CONFLICT));
  }

  const isFirstUser = (await User.countDocuments()) === 0;

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: isFirstUser ? "admin" : "customer",
  });

  const token = generateToken(user._id);

  await sendWelcomeEmail(user);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.CREATED,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return next(
      new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED),
    );
  }

  if (!user.isActive) {
    return next(new AppError("Account is deactivated", HTTP_STATUS.FORBIDDEN));
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.SUCCESS,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: user,
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const allowedFields = ["name", "phone", "address"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.UPDATED,
    data: user,
  });
});
