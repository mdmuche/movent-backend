import httpStatus from "http-status";

import UserActivity from "../../models/userActivity.js";
import User from "../../models/user.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const getSavedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    const total = user.savedEvents.length;

    const skip = (page - 1) * limit;

    // ✅ slice before populate
    const paginatedIds = user.savedEvents.slice(skip, skip + Number(limit));

    const events = await User.findById(userId).populate({
      path: "savedEvents",
      match: { _id: { $in: paginatedIds } },
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Saved events fetched successfully",
      data: {
        savedEvents: events.savedEvents,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
        },
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching saved events",
      error: error.message,
    });
  }
};
