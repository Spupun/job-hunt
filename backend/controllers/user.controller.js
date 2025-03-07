import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message:
          "All fields are required: fullName, email, phoneNumber, password, role.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists for this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "User registered successfully.",
      success: true,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error during user registration:", err.message);
    return res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
      success: false,
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required: email, password, and role.",
        success: false,
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist for this email.",
        success: false,
      });
    }

    // Check if user role matches
    if (user.role !== role) {
      return res.status(400).json({
        message: "Incorrect role for this user.",
        success: false,
      });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password.",
        success: false,
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 86400000,
    });

    // Return success response
    return res.status(200).json({
      message: "Login successful.",
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
      success: false,
      error: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // Send a response to the client
    return res.status(200).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (err) {
    console.error("Error during logout:", err.message);
    return res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
      success: false,
      error: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;

    if (!fullName && !email && !phoneNumber && !bio && !skills) {
      return res.status(400).json({
        message:
          "At least one field (fullName, email, phoneNumber, bio, or skills) is required to update.",
        success: false,
      });
    }

    if (skills) user.skills = skillsArrary;
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Update user data
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;

    // Save the updated user
    await user.save();

    // Return the updated user data in the response
    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error during user update:", err.message);
    return res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
      success: false,
      error: err.message,
    });
  }
};
