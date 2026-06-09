import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { errorResponse } from "../utils/response/error.js";

export const verifyToken = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return errorResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = decoded;
    return next();
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};
