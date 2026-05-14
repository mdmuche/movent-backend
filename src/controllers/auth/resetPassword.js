import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import User from "../models/users.model.js";
import TokenCollection from "../models/token.model.js";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    // Verify JWT token
    jwt.verify(resetToken, process.env.JWT_RESET_SECRET);

    // Check DB for stored token
    const storedToken = await TokenCollection.findOne({
      resetToken,
      authPurpose: "reset-password",
    });

    if (!storedToken) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Invalid or expired reset token",
      });
    }

    if (!storedToken.isCodeVerified) {
      return errorResponse(res, {
        statusCode: httpStatus.FORBIDDEN,
        message: "Code verification required",
      });
    }

    // Find user
    const user = await User.findById(storedToken.user);

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    // Update password
    user.password = newPassword;

    await user.save();

    // Delete used token
    await TokenCollection.deleteOne({
      resetToken,
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Password reset successful",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while resetting the password",
      error: error.message,
    });
  }
};
