import httpStatus from "http-status";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import User from "../../models/user.js";

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOneAndUpdate(
      { authToken: token, authPurpose: "verify-email" },
      { isEmailVerified: true, authToken: "", authPurpose: "" },
      { returnDocument: "after" },
    );

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Invalid or expired verification token.",
      });
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Email Verified Successfully",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while verifying the email",
      error: error.message,
    });
  }
};
