import httpStatus from "http-status";

import User from "../../models/user.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const closeAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    await User.findByIdAndUpdate(userId, {
      accountStatus: "closed",
      closedAt: new Date(),
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Account closed successfully",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error closing account",
      error: error.message,
    });
  }
};
