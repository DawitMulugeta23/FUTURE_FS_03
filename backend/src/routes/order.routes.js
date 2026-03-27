const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { protect, admin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createOrderSchema,
  updateOrderStatusSchema,
} = require("../validations/order.validation");

router.post(
  "/",
  protect,
  validate(createOrderSchema),
  orderController.createOrder,
);
router.get("/my-orders", protect, orderController.getMyOrders);
router.get(
  "/analytics/daily",
  protect,
  admin,
  orderController.getDailyAnalytics,
);
router.get("/:id", protect, orderController.getOrderById);
router.patch("/:id/cancel", protect, orderController.cancelOrder);

router.get("/", protect, admin, orderController.getAllOrders);
router.patch(
  "/:id/status",
  protect,
  admin,
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus,
);

module.exports = router;
