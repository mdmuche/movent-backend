import httpStatus from "http-status";

import User from "../../models/user.js";
import UserActivity from "../../models/userActivity.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const flagUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    // prevent flagging admin (important safeguard)
    if (user.role === "admin") {
      return errorResponse(res, {
        statusCode: httpStatus.FORBIDDEN,
        message: "Admin users cannot be flagged",
      });
    }

    user.accountModerationStatus = "flagged";

    await user.save();

    // optional audit trail / activity log
    await UserActivity.create({
      user: userId,
      type: "profile_updated",
      metadata: {
        action: "user_flagged",
        flaggedBy: req.user.userId,
      },
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "User has been flagged successfully",
      data: {
        userId: user._id,
        accountModerationStatus: user.accountModerationStatus,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error flagging user",
      error: error.message,
    });
  }
};
