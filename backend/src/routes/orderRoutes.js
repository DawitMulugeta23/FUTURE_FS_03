const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderDetails,
  getAdminStats,
} = require("../controllers/order.Controller");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/").post(protect, createOrder);
router.route("/verify/:tx_ref").get(verifyPayment);
router.route("/myorders").get(protect, getMyOrders);
router.route("/stats").get(protect, authorize("admin"), getAdminStats);
router.route("/").get(protect, authorize("admin"), getAllOrders);
router.route("/:id").get(protect, authorize("admin"), getOrderDetails);
router.route("/:id/status").put(protect, authorize("admin"), updateOrderStatus);

module.exports = router;
