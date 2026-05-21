import httpStatus from "http-status";

import NotificationCollection from "../../models/notification.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await NotificationCollection.countDocuments({
      user: userId,
      isRead: false,
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Unread count fetched successfully",
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch unread count",
      error: error.message,
    });
  }
};
