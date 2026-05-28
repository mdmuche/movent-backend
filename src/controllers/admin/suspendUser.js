import httpStatus from "http-status";

import User from "../../models/user.js";
import UserActivity from "../../models/userActivity.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    // prevent admin suspension
    if (user.role === "admin") {
      return errorResponse(res, {
        statusCode: httpStatus.FORBIDDEN,
        message: "Admin users cannot be suspended",
      });
    }

    // prevent re-suspending already suspended users
    if (user.accountModerationStatus === "suspended") {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "User is already suspended",
      });
    }

    user.accountModerationStatus = "suspended";

    await user.save();

    // log admin action in activity/audit system
    await UserActivity.create({
      user: userId,
      type: "profile_updated",
      metadata: {
        action: "user_suspended",
        suspendedBy: adminId,
        reason: req.body?.reason || "No reason provided",
      },
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "User suspended successfully",
      data: {
        userId: user._id,
        accountModerationStatus: user.accountModerationStatus,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error suspending user",
      error: error.message,
    });
  }
};
