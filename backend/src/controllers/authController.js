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
      phone: user.phone || "",
    },
  });
};

// Customer Registration (Common - first user becomes admin)
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    console.log("Registration attempt:", { name, email, phone });

    // Validation
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

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // First user becomes admin, others become regular users
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    console.log("User count:", userCount, "Role assigned:", role);

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || "",
      role: role,
    });

    console.log("User created successfully:", user._id);

    // Send welcome email (don't await to avoid blocking)
    sendEmail({
      email: user.email,
      subject: "Welcome to Yesekela Cafe!",
      message: `Welcome to Yesekela Cafe, ${name}! We are thrilled to have you.`,
    }).catch((err) => console.error("Email error:", err.message));

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }
    res.status(500).json({
      success: false,
      error: err.message || "Registration failed",
    });
  }
};

// Staff Registration
exports.registerStaff = async (req, res) => {
  try {
    const { name, email, password, phone, managerCode, department, shift } =
      req.body;

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
      phone: phone || "",
      role: "staff",
      isActive: true,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("Staff registration error:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }
    res.status(500).json({
      success: false,
      error: err.message || "Staff registration failed",
    });
  }
};

// Login
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
