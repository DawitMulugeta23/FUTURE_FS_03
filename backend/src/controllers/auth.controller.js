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
      phone: user.phone,
      deliveryAddress: user.deliveryAddress,
    },
  });
};

// Customer Registration
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, deliveryAddress } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email already registered" });
    }

    // Create customer account
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "user",
      deliveryAddress: deliveryAddress || {},
    });

    // Send welcome email
    try {
      await sendEmail({
        email: user.email,
        subject: "Welcome to Yesekela Cafe!",
        message: `Welcome to Yesekela Cafe, ${name}! We are thrilled to have you. Enjoy our fresh brews and delicious meals!`,
      });
    } catch (emailError) {
      console.error("Welcome email failed:", emailError.message);
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Admin Registration (with admin code verification)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, adminCode, department, employeeId } =
      req.body;

    // Verify admin code (you can set this in .env file)
    const validAdminCode =
      process.env.ADMIN_REGISTRATION_CODE || "YESEKELA_ADMIN_2024";

    if (adminCode !== validAdminCode) {
      return res.status(403).json({
        success: false,
        error: "Invalid admin registration code",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email already registered" });
    }

    // Check if employee ID is unique (if provided)
    if (employeeId) {
      const existingEmployee = await User.findOne({ employeeId });
      if (existingEmployee) {
        return res
          .status(400)
          .json({ success: false, error: "Employee ID already exists" });
      }
    }

    // Create admin account
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "admin",
      department: department || "management",
      employeeId: employeeId || `ADMIN_${Date.now()}`,
      hireDate: new Date(),
      adminPermissions: {
        canManageMenu: true,
        canManageOrders: true,
        canManageUsers: true,
        canViewReports: true,
        canManageSettings: true,
      },
      isActive: true,
    });

    // Send welcome email to admin
    try {
      await sendEmail({
        email: user.email,
        subject: "Welcome to Yesekela Cafe Admin Team!",
        message: `Welcome ${name}! You have been registered as an administrator. You can now manage the cafe operations.`,
      });
    } catch (emailError) {
      console.error("Welcome email failed:", emailError.message);
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Staff Registration (for restaurant staff)
exports.registerStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department,
      shift,
      employeeId,
      managerCode,
    } = req.body;

    // Verify manager code
    const validManagerCode =
      process.env.MANAGER_REGISTRATION_CODE || "YESEKELA_STAFF_2024";

    if (managerCode !== validManagerCode) {
      return res.status(403).json({
        success: false,
        error: "Invalid staff registration code. Please contact manager.",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email already registered" });
    }

    // Check if employee ID is unique
    if (employeeId) {
      const existingEmployee = await User.findOne({ employeeId });
      if (existingEmployee) {
        return res
          .status(400)
          .json({ success: false, error: "Employee ID already exists" });
      }
    }

    // Create staff account
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "staff",
      department: department || "service",
      shift: shift || "morning",
      employeeId: employeeId || `STAFF_${Date.now()}`,
      hireDate: new Date(),
      adminPermissions: {
        canManageMenu: false,
        canManageOrders: department === "kitchen" || department === "service",
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false,
      },
      isActive: true,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Login (common for all roles)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: "Account is deactivated. Contact admin.",
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
