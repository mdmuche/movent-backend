import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import TokenCollection from "../models/token.js";

export const verifyToken = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    if (!refreshToken) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const storedToken = await TokenCollection.findOne({
      user: decoded.userId,
      authPurpose: "refresh_token",
      refreshToken,
      expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};
