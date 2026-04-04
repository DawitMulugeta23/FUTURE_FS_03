// backend/src/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "30d",
    },
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// Customer Registration
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password,
      role: role,
    });

    sendEmail({
      email: user.email,
      subject: "Welcome to Yesekela Cafe!",
      message: `Welcome to Yesekela Cafe, ${name}! We are thrilled to have you.`,
    }).catch((err) => console.error("Email error:", err.message));

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Registration failed",
    });
  }
};

// Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email and password",
      });
    }

    const validAdminCode =
      process.env.ADMIN_REGISTRATION_CODE || "YESEKELA_ADMIN_2024";

    if (adminCode !== validAdminCode) {
      return res.status(403).json({
        success: false,
        error: "Invalid admin registration code",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Admin registration failed",
    });
  }
};

// Staff Registration
exports.registerStaff = async (req, res) => {
  try {
    const { name, email, password, managerCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email and password",
      });
    }

    const validManagerCode =
      process.env.MANAGER_REGISTRATION_CODE || "YESEKELA_STAFF_2024";

    if (managerCode !== validManagerCode) {
      return res.status(403).json({
        success: false,
        error: "Invalid staff registration code",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "staff",
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("Staff registration error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Staff registration failed",
    });
  }
};

// Login - FIXED (no next parameter)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: "Account is deactivated. Contact admin.",
      });
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    console.log("Login successful for:", email);
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Login failed",
    });
  }
};
