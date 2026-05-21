import httpStatus from "http-status";

import NotificationCollection from "../../models/notification.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { page = 1, limit = 10 } = req.query;

    const {
      skip,
      limit: limitNum,
      pagination,
    } = await paginationUtils({
      page,
      limit,
      model: NotificationCollection,
      query: { user: userId },
    });

    const notifications = await NotificationCollection.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Notifications fetched successfully",
      data: {
        notifications,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};
