const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();
const {
  addFood,
  getMenu,
  updateFood,
  deleteFood,
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

router
  .route("/")
  .get(getMenu)
  .post(protect, authorize("admin"), upload.single("imagePath"), addFood);

router
  .route("/:id")
  .put(protect, authorize("admin"), upload.single("imagePath"), updateFood)
  .delete(protect, authorize("admin"), deleteFood);

module.exports = router;
