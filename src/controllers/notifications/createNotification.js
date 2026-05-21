import httpStatus from "http-status";

import NotificationCollection from "../../models/notification.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const createNotification = async (req, res) => {
  try {
    const { user, title, message, type, metadata } = req.body;

    const notification = await NotificationCollection.create({
      user,
      title,
      message,
      type,
      metadata,
    });

    return successResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create notification",
      error: error.message,
    });
  }
};
