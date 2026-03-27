const Reservation = require("../models/Reservation.model");
const { sendReservationConfirmation } = require("../utils/email.service");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.createReservation = catchAsync(async (req, res, next) => {
  const { name, email, phone, date, time, guests, specialRequests } = req.body;

  const reservation = await Reservation.create({
    user: req.user ? req.user.id : null,
    name,
    email,
    phone,
    date,
    time,
    guests,
    specialRequests,
  });

  await sendReservationConfirmation(reservation, req.user);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.CREATED,
    data: reservation,
  });
});

exports.getMyReservations = catchAsync(async (req, res, next) => {
  const reservations = await Reservation.find({ user: req.user.id }).sort({
    date: -1,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: reservations.length,
    data: reservations,
  });
});

exports.getAllReservations = catchAsync(async (req, res, next) => {
  const { status, date } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    filter.date = { $gte: startDate, $lte: endDate };
  }

  const reservations = await Reservation.find(filter)
    .populate("user", "name email")
    .sort({ date: -1, time: 1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: reservations.length,
    data: reservations,
  });
});

exports.updateReservationStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return next(new AppError("Reservation not found", HTTP_STATUS.NOT_FOUND));
  }

  reservation.status = status;
  reservation.updatedAt = Date.now();
  await reservation.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.UPDATED,
    data: reservation,
  });
});

exports.cancelReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return next(new AppError("Reservation not found", HTTP_STATUS.NOT_FOUND));
  }

  if (
    reservation.user &&
    reservation.user.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("Not authorized", HTTP_STATUS.FORBIDDEN));
  }

  if (reservation.status === "completed" || reservation.status === "no_show") {
    return next(
      new AppError("Reservation cannot be cancelled", HTTP_STATUS.BAD_REQUEST),
    );
  }

  reservation.status = "cancelled";
  await reservation.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Reservation cancelled successfully",
    data: reservation,
  });
});

exports.checkAvailability = catchAsync(async (req, res, next) => {
  const { date, time, guests } = req.query;

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const reservations = await Reservation.find({
    date: { $gte: startDate, $lte: endDate },
    time: time,
    status: { $in: ["confirmed", "pending"] },
  });

  const totalGuestsBooked = reservations.reduce((sum, r) => sum + r.guests, 0);
  const maxCapacity = 50;
  const available = maxCapacity - totalGuestsBooked >= parseInt(guests);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      available,
      remainingCapacity: maxCapacity - totalGuestsBooked,
    },
  });
});
