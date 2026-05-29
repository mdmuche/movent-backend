import httpStatus from "http-status";

import NotificationCollection from "../../models/notifications.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await NotificationCollection.findOne({
      _id: notificationId,
      user: req.user.userId,
    });

    if (!notification) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Notification not found",
      });
    }

    // check if already read
    if (notification.isRead) {
      return successResponse(res, {
        statusCode: httpStatus.OK,
        message: "Notification already marked as read",
        data: notification,
      });
    }

    notification.isRead = true;
    await notification.save();

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to mark notification",
      error: error.message,
    });
  }
};
