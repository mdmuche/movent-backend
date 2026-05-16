import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import TokenCollection from "../models/token.js";

export const verifyToken = async (req, res, next) => {
  try {
    // 1. Get token from cookies (NOT headers anymore)
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 2. Check token exists in DB (THIS IS YOUR NEW ADDITION)
    const storedToken = await TokenCollection.findOne({ token });

    if (!storedToken) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // 3. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};
