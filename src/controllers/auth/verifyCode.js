import httpStatus from "http-status";
import bcrypt from "bcryptjs";

import TokenCollection from "../../models/token.js";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const verifyCode = async (req, res) => {
  try {
    const { resetToken, code } = req.body;

    if (!resetToken || !code) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "fields required",
      });
    }

    const databaseToken = await TokenCollection.findOne({
      resetToken,
      authPurpose: "password_reset",
    });

    if (!databaseToken) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "invalid or expired token",
      });
    }

    // optional: check expiry manually (if you didn't use TTL index)
    if (databaseToken.expiresAt < new Date()) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "token expired",
      });
    }

    const isMatch = await bcrypt.compare(code, databaseToken.resetPasswordCode);

    if (!isMatch) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "invalid code",
      });
    }

    databaseToken.isCodeVerified = true;
    await databaseToken.save();

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Code verified successfully",
    });
  } catch (err) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while verifying the code",
      error: err.message,
    });
  }
};
