// backend/src/routes/orderRoutes.js
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
} = require("../controllers/order.controller");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes (no authentication needed for payment verification)
router.get("/verify/:tx_ref", verifyPayment);

// Protected routes (require login)
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

// Admin only routes
router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/", protect, authorize("admin"), getAllOrders);
router.get("/:id", protect, authorize("admin"), getOrderDetails);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

module.exports = router;
