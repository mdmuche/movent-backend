import httpStatus from "http-status";

import NotificationCollection from "../../models/notifications.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    // check if user has any unread notifications
    const unreadCount = await NotificationCollection.countDocuments({
      user: userId,
      isRead: false,
    });

    // no notifications at all
    if (unreadCount === 0) {
      return successResponse(res, {
        statusCode: httpStatus.OK,
        message: "No unread notifications found",
        data: {
          modifiedCount: 0,
        },
      });
    }

    // mark as read
    const result = await NotificationCollection.updateMany(
      {
        user: userId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    );

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "All notifications marked as read",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to mark notifications",
      error: error.message,
    });
  }
};
