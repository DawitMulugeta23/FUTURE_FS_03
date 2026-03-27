const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { protect, admin } = require("../middleware/auth.middleware");

router.use(protect, admin);

router.get("/dashboard", adminController.getDashboardStats);
router.get("/analytics/sales", adminController.getSalesAnalytics);
router.get("/analytics/customers", adminController.getCustomerAnalytics);
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);
router.get("/settings", adminController.getSettings);

module.exports = router;
