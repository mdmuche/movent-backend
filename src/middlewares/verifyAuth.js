import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import TokenCollection from "../models/token.js";
import User from "../models/user.js";

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
    const storedToken = await TokenCollection.findOne({ refreshToken: token });

    if (!storedToken) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // 3. Check if user is suspended
    const user = await User.findById(storedToken.user);
    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended.",
      });
    }

    // 4. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user
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
