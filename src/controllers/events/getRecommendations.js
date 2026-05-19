import httpStatus from "http-status";
import User from "../../models/user.js";
import Event from "../../models/event.js";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return errorResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Unauthorized access",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    const {
      skip,
      limit: limitNum,
      pagination,
    } = paginationUtils({
      page,
      limit,
    });

    const baseQuery = {
      startDate: { $gte: new Date() },
      status: "upcoming",
      $expr: { $lt: ["$soldTickets", "$totalTickets"] },
    };

    let recommendedEvents = [];

    // -----------------------------
    // 1. INTEREST BASED
    // -----------------------------
    if (user.interests?.length) {
      recommendedEvents = await Event.find({
        ...baseQuery,
        category: { $in: user.interests },
      })
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limitNum)
        .populate("organizer", "fullName email");
    }

    // -----------------------------
    // 2. FALLBACK
    // -----------------------------
    if (!recommendedEvents.length) {
      recommendedEvents = await Event.find(baseQuery)
        .sort({ soldTickets: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("organizer", "fullName email");
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Recommended events fetched successfully",
      data: {
        events: recommendedEvents,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch recommendations",
      error: error.message,
    });
  }
};
