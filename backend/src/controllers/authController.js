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

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already in use by another account",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone },
      { new: true, runValidators: true },
    ).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ============ PASSWORD RESET WITH 6-DIGIT CODE ============

// @desc    Send 6-digit verification code to email
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email address",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "No user found with that email address",
      });
    }

    // Generate 6-digit reset code
    const resetCode = user.generateResetCode();
    await user.save({ validateBeforeSave: false });

    // Email message with the 6-digit code
    const message = `
Hello ${user.name},

You requested a password reset for your Yesekela Café account.

Your 6-digit verification code is: ${resetCode}

This code is valid for 10 minutes.

Please enter this code on the verification page to continue with your password reset.

If you did not request this, please ignore this email and your password will remain unchanged.

Best regards,
Yesekela Café Team
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Code - Yesekela Café",
        message: message,
      });

      res.status(200).json({
        success: true,
        message: "Verification code sent to your email. Please check your inbox.",
        email: user.email,
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      
      // Reset code fields if email fails
      user.resetCode = undefined;
      user.resetCodeExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        error: "Failed to send verification email. Please try again later.",
      });
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to process request",
    });
  }
};

// @desc    Verify 6-digit code
// @route   POST /api/auth/verify-reset-code
exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and verification code",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "No user found with that email address",
      });
    }

    // Check if code is valid
    if (!user.resetCode || user.resetCode !== code) {
      return res.status(400).json({
        success: false,
        error: "Invalid verification code",
      });
    }

    // Check if code is expired
    if (user.resetCodeExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        error: "Verification code has expired. Please request a new one.",
      });
    }

    // Mark code as verified
    user.resetCodeVerified = true;
    await user.save({ validateBeforeSave: false });

    // Generate a temporary token for password reset
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "Code verified successfully. You can now reset your password.",
      resetToken: resetToken,
    });
  } catch (err) {
    console.error("Verify code error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to verify code",
    });
  }
};

// @desc    Reset password after code verification
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    if (!resetToken || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token. Please request a new code.",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if code was verified
    if (!user.resetCodeVerified) {
      return res.status(400).json({
        success: false,
        error: "Verification code not verified. Please verify your code first.",
      });
    }

    // Set new password
    user.password = password;
    user.resetCode = undefined;
    user.resetCodeExpire = undefined;
    user.resetCodeVerified = false;
    await user.save();

    // Send confirmation email
    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Successful - Yesekela Café",
        message: `
Hello ${user.name},

Your password has been successfully reset.

If you did not perform this action, please contact us immediately.

Best regards,
Yesekela Café Team
        `,
      });
    } catch (emailError) {
      console.error("Confirmation email error:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to reset password",
    });
  }
};