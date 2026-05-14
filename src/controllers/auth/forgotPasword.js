import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/users.model.js";
import { sendEmail } from "../utils/email.util.js";
import TokenCollection from "../models/token.model.js";
import { resetPasswordTemplate } from "../utils/email/templates/resetPassword.js";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

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

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: process.env.JWT_RESET_EXPIRES_IN },
    );

    let code = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

    const hashedCode = await bcrypt.hash(code, 10);
    // Save reset token in DB
    await TokenCollection.create({
      user: user._id,
      resetToken,
      resetPasswordCode: hashedCode,
      authPurpose: "reset-password",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    // send email to get reset password code
    const resetUrl = `${process.env.FRONTEND_URL_MAIN}/v1/auth/reset-password/${resetToken}`;

    const emailBody = resetPasswordTemplate(user.fullName, resetUrl, code);
    await sendEmail(email, "Reset your password", emailBody);

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
