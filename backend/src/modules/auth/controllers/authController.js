import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../../../utils/generateToken.js";
import sendEmail from "../../../utils/sendEmail.js";
import crypto from "crypto";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // BASIC VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // NORMALIZE EMAIL
    const emailNormalized = email.toLowerCase().trim();

    // CHECK USER
    const userExists = await User.findOne({ email: emailNormalized });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // CREATE USER
    const user = await User.create({
      name,
      email: emailNormalized,
      password: hashedPassword,
      role: "user",
    });

    //await sendEmail(
    //  user.email,
    //  "Welcome to E-Commerce Marketplace",
    //  `Hello ${user.name}, your account has been created successfully.`);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // BASIC VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // NORMALIZE EMAIL
    const emailNormalized = email.toLowerCase().trim();

    // FIND USER
    const user = await User.findOne({ email: emailNormalized });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
 
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store hashed token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl =
      `http://localhost:3000/reset-password/${resetToken}`;

    //await sendEmail(
    //  user.email,
    //  "Password Reset",
    //  `Reset your password using this link:\n\n${resetUrl}`
    //);
    console.log("Reset URL:", resetUrl);
    res.json({
    message: "Reset token generated",
    resetToken,
    resetUrl,
});

    res.json({
      message: "Password reset email sent",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log("original token:", req.params.token);

    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    console.log("user found:", user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};