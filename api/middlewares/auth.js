import jwt from "jsonwebtoken";
import User from "../models/User.js";

// protect route middleware
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    }

    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - User not found" });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
