import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import TokenCollection from "../../models/token.js";
import User from "../../models/user.js";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    try {
      jwt.verify(resetToken, process.env.JWT_RESET_SECRET);
    } catch (error) {
      return errorResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Invalid or expired reset token",
        error: error.message,
      });
    }

    // Check DB for stored token
    const storedToken = await TokenCollection.findOne({
      passwordResetToken: resetToken,
      authPurpose: "password_reset",
    });

    if (!storedToken) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Invalid or expired reset token",
      });
    }

    if (storedToken.expiresAt < new Date()) {
      return errorResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Reset token expired",
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
    await TokenCollection.findByIdAndDelete(storedToken._id);

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
