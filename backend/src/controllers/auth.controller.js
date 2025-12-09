const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { signupSchema, loginSchema } = require("../validations/auth.validation");
const emailService = require("../services/email.service");

exports.signup = async (req, res, next) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET ||
        "dummy_jwt_secret_for_development_only_change_in_production",
      { expiresIn: "1h" }
    );
    const verificationLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/verify-email?token=${token}`;

    await emailService.sendEmail({
      to: email,
      subject: "Verify Your Email",
      template: "verify-email",
      context: { name, verificationLink },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Signup successful! Please check your email.",
      });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "dummy_jwt_secret_for_development_only_change_in_production"
    );
    const user = await User.findById(decoded.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.isVerified)
      return res
        .status(400)
        .json({ success: false, message: "Already verified" });

    user.isVerified = true;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    console.log("Login attempt with body:", req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET ||
        "dummy_jwt_secret_for_development_only_change_in_production",
      { expiresIn: "7d" }
    );
    res.status(200).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password").populate('subscription');  
      
      
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// Forgot password - send reset link
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { id: user._id, type: "password-reset" },
      process.env.JWT_SECRET ||
        "dummy_jwt_secret_for_development_only_change_in_production",
      { expiresIn: "1h" }
    );

    // Create reset link
    const resetLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password?token=${resetToken}`;

    try {
      // Send password reset email
      await emailService.sendEmail({
        to: email,
        subject: "Password Reset Request",
        template: "password-reset",
        context: {
          name: user.name,
          resetLink,
          expiryTime: "1 hour",
        },
      });

      res.status(200).json({
        success: true,
        message: "Password reset link sent to your email.",
      });
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again.",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Reset password with token
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    try {
      // Verify reset token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET ||
          "dummy_jwt_secret_for_development_only_change_in_production"
      );

      if (decoded.type !== "password-reset") {
        return res.status(400).json({
          success: false,
          message: "Invalid reset token",
        });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password reset successfully. You can now login with your new password.",
      });
    } catch (tokenError) {
      if (tokenError.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "Reset token has expired. Please request a new one.",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }
  } catch (err) {
    next(err);
  }
};
