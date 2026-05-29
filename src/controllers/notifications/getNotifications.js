import httpStatus from "http-status";

import NotificationCollection from "../../models/notifications.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { page = 1, limit = 10 } = req.query;

    // -------------------------
    // BASE QUERY
    // -------------------------
    const query = { user: userId };

    // -------------------------
    // TOTAL
    // -------------------------
    const total = await NotificationCollection.countDocuments(query);

    // -------------------------
    // PAGINATION
    // -------------------------
    const {
      skip,
      limit: limitNum,
      pagination,
    } = paginationUtils({
      page,
      limit,
      total,
    });

    // -------------------------
    // FETCH NOTIFICATIONS
    // -------------------------
    const notifications = await NotificationCollection.find(query)
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
