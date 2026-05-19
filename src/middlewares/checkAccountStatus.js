import httpStatus from "http-status";
import User from "../models/user.js";

export const checkAccountStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // BLOCK CLOSED ACCOUNTS
    if (user.accountStatus === "closed") {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "This account has been closed.",
      });
    }

    // OPTIONAL: block suspended accounts too
    if (user.accountStatus === "suspended") {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "This account has been suspended.",
      });
    }

    req.userDetails = user;

    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Account status check failed",
      error: error.message,
    });
  }
};
