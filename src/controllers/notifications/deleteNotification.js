import httpStatus from "http-status";

import NotificationCollection from "../../models/notifications.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const deleteNotification = async (req, res) => {
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

    await notification.deleteOne();

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};
