const express = require("express");
const router = express.Router();
const { addFood, getMenu } = require("../controllers/foodController");
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMenu)
  .post(protect, authorize('admin'), addFood);
  
module.exports = router;
