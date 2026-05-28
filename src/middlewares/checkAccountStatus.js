import httpStatus from "http-status";
import User from "../models/user.js";
import { errorResponse } from "../utils/response/error.js";

export const checkAccountStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    // BLOCK CLOSED ACCOUNTS
    if (user.accountStatus === "closed") {
      return errorResponse(res, {
        statusCode: httpStatus.FORBIDDEN,
        message: "This account has been closed.",
      });
    }

    // OPTIONAL: block suspended accounts too
    if (user.accountModerationStatus === "suspended") {
      return errorResponse(res, {
        statusCode: httpStatus.FORBIDDEN,
        message: "This account has been suspended.",
      });
    }

    req.userDetails = user;

    return next();
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Account status check failed",
      error: error.message,
    });
  }
};
