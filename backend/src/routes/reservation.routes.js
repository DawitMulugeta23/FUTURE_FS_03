const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");
const { protect, admin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createReservationSchema,
  updateReservationStatusSchema,
} = require("../validations/reservation.validation");

router.post(
  "/",
  validate(createReservationSchema),
  reservationController.createReservation,
);
router.get("/check-availability", reservationController.checkAvailability);
router.get(
  "/my-reservations",
  protect,
  reservationController.getMyReservations,
);
router.patch("/:id/cancel", protect, reservationController.cancelReservation);

router.get("/", protect, admin, reservationController.getAllReservations);
router.patch(
  "/:id/status",
  protect,
  admin,
  validate(updateReservationStatusSchema),
  reservationController.updateReservationStatus,
);

module.exports = router;
