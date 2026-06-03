import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import User from "../../models/user.js";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import TokenCollection from "../../models/token.js";
import { sendEmail } from "../../utils/email/sendEmail.js";
import { resetPasswordTemplate } from "../../utils/email/templates/resetPassword.js";
import { sendNotification } from "../../services/notification.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    // Generate JWT reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: process.env.JWT_RESET_EXPIRES_IN },
    );

    // Save token in DB
    await TokenCollection.create({
      user: user._id,
      authPurpose: "password_reset",
      passwordResetToken: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    // Reset URL
    const resetUrl = `${process.env.FRONTEND_URL_MAIN}/reset-password/${resetToken}`;

    const emailBody = resetPasswordTemplate(user.fullName, resetUrl);

    const emailSent = await sendEmail(email, "Reset your password", emailBody);

    if (!emailSent) {
      await TokenCollection.deleteOne({ passwordResetToken: resetToken });

      return errorResponse(res, {
        statusCode: httpStatus.SERVICE_UNAVAILABLE,
        message: "Reset email could not be sent. Please try again later",
      });
    }

    await sendNotification({
      user: user._id,
      title: "Password Reset Requested 🔐",
      message:
        "We received a request to reset your password. If this wasn't you, ignore this message.",
      type: "system",
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Reset link sent to your email",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while processing your request",
      error: error.message,
    });
  }
};
