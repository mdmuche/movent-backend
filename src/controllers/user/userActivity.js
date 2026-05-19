import httpStatus from "http-status";

import UserActivity from "../../models/userActivity.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { page = 1, limit = 20 } = req.query;

    // -----------------------------
    // PAGINATION UTILS
    // -----------------------------
    const {
      skip,
      limit: limitNum,
      pagination,
    } = paginationUtils({
      page,
      limit,
    });

    // -----------------------------
    // FETCH ACTIVITIES (PAGINATED)
    // -----------------------------
    const activities = await UserActivity.find({
      user: userId,
    })
      .populate("event", "title bannerImage startDate")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "User activity fetched successfully",
      data: {
        activities,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching user activity",
      error: error.message,
    });
  }
};
