// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const menuController = require("../controllers/menu.controller");
const serviceController = require("../controllers/service.controller");
const { protect, admin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createMenuSchema,
  updateMenuSchema,
} = require("../validations/menu.validation");
const {
  createServiceSchema,
  updateServiceSchema,
} = require("../validations/service.validation");

router.use(protect, admin);

// Dashboard
router.get("/dashboard", adminController.getDashboardStats);
router.get("/analytics/sales", adminController.getSalesAnalytics);
router.get("/analytics/customers", adminController.getCustomerAnalytics);

// User management
router.get("/users", adminController.getAllUsers);
router.get("/users/search/:email", adminController.getUserByEmail);
router.patch("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);
router.post("/users/send-message", adminController.sendMessageByEmail);
router.post("/users/send-message/email", adminController.sendMessageByEmail);

// Settings
router.get("/settings", adminController.getSettings);

// Menu management
router.post("/menu", validate(createMenuSchema), menuController.createMenuItem);
router.put(
  "/menu/:id",
  validate(updateMenuSchema),
  menuController.updateMenuItem,
);
router.delete("/menu/:id", menuController.deleteMenuItem);
router.patch("/menu/:id/availability", menuController.toggleAvailability);

// Service management
router.get("/services", adminController.getAllServices);
router.post(
  "/services",
  validate(createServiceSchema),
  serviceController.createService,
);
router.put(
  "/services/:id",
  validate(updateServiceSchema),
  serviceController.updateService,
);
router.delete("/services/:id", serviceController.deleteService);
router.patch(
  "/services/:id/availability",
  serviceController.toggleAvailability,
);

module.exports = router;
