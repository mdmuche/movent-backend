import httpStatus from "http-status";

import NotificationCollection from "../../models/notifications.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await NotificationCollection.updateMany(
      {
        user: userId,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to mark notifications",
      error: error.message,
    });
  }
};
