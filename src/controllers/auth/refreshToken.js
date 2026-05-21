import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import TokenCollection from "../../models/token.js";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return errorResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        message: "No refresh token provided",
      });
    }

    // Check DB
    const storedToken = await TokenCollection.findOne({
      refreshToken,
    });

    if (!storedToken) {
      return errorResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Invalid refresh token",
      });
    }
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate NEW access token
    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Send new access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Access token refreshed",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while refreshing the access token",
      error: error.message,
    });
  }
};
