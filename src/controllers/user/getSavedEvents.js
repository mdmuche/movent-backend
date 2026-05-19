import httpStatus from "http-status";

import User from "../../models/user.js";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getSavedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { page = 1, limit = 10 } = req.query;

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
    // FETCH USER WITH PAGINATED SAVED EVENTS
    // -----------------------------
    const user = await User.findById(userId).populate({
      path: "savedEvents",
      options: {
        sort: { createdAt: -1 },
        skip,
        limit: limitNum,
      },
    });

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Saved events fetched successfully",
      data: {
        savedEvents: user.savedEvents,
        pagination,
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
