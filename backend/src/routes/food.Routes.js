// backend/src/routes/food.Routes.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();
const {
  addFood,
  getMenu,
  getFoodById,
  updateFood,
  deleteFood,
  toggleAvailability,
  getAllMenuForAdmin,
  getLowStockItems,
  rateFood,
  toggleLike,
  toggleDislike,
  getTopRated,
  getMostLiked,
  getBestSelling,
  getRelatedProducts, // ADD THIS
} = require("../controllers/food.Controller");
const { protect, authorize } = require("../middleware/authMiddleware");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Public routes (no auth needed for viewing menu)
router.get("/", getMenu);
router.get("/top-rated", getTopRated);
router.get("/most-liked", getMostLiked);
router.get("/best-selling", getBestSelling);
router.get("/:id", getFoodById);
router.get("/:id/related", getRelatedProducts); // ADD THIS ROUTE

// Protected routes (require login for interactions)
router.post("/:id/rate", protect, rateFood);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/dislike", protect, toggleDislike);

// Admin only routes
router.get("/admin/all", protect, authorize("admin"), getAllMenuForAdmin);
router.get("/admin/low-stock", protect, authorize("admin"), getLowStockItems);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("imagePath"),
  addFood,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("imagePath"),
  updateFood,
);
router.delete("/:id", protect, authorize("admin"), deleteFood);
router.patch("/:id/toggle", protect, authorize("admin"), toggleAvailability);

module.exports = router;
