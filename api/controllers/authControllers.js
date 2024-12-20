import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { loginSchema, signupSchema } from "../schemas/index.js";

//# Helper functions

// function to create a jwt signing token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// function to set the jwt token as a cookie
const setCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// signup controller
export const signup = async (req, res) => {
  // Validate and sanitize input
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.errors[0].message,
    });
  }

  try {
    // Check if user exists
    const userExists = await User.findOne({ email: result.data.email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user and create jwt token and set it as a cookie
    const newUser = await User.create(result.data);
    const token = signToken(newUser._id);
    setCookie(res, token);

    // Get user without password using select
    const userResponse = await User.findById(newUser._id).select("-password");

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error signing up user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// login controller
export const login = async (req, res) => {
  // Validate and sanitize input
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.errors[0].message,
    });
  }

  try {
    const user = await User.findOne({ email: result.data.email }).select(
      "+password"
    );

    if (!user || !(await user.matchPassword(result.data.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create token and set cookie using helper functions
    const token = signToken(user._id);
    setCookie(res, token);

    // Get user without password
    const userResponse = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// logout controller
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// get me controller
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user: req.user,
  });
};
