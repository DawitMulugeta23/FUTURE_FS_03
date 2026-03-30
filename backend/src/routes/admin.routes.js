const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const menuController = require("../controllers/menu.controller");
const { protect, admin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createMenuSchema,
  updateMenuSchema,
} = require("../validations/menu.validation");

router.use(protect, admin);

router.get("/dashboard", adminController.getDashboardStats);
router.get("/analytics/sales", adminController.getSalesAnalytics);
router.get("/analytics/customers", adminController.getCustomerAnalytics);
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);
router.get("/settings", adminController.getSettings);

router.post("/menu", validate(createMenuSchema), menuController.createMenuItem);
router.put(
  "/menu/:id",
  validate(updateMenuSchema),
  menuController.updateMenuItem,
);
router.delete("/menu/:id", menuController.deleteMenuItem);
router.patch("/menu/:id/availability", menuController.toggleAvailability);

module.exports = router;
