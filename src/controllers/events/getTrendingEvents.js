import httpStatus from "http-status";

import Event from "../../models/event.js";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getTrendingEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // -----------------------------
    // BASE QUERY
    // -----------------------------
    const query = {
      startDate: { $gte: new Date() },
      status: "upcoming",
    };

    // -----------------------------
    // TOTAL EVENTS
    // -----------------------------
    const total = await Event.countDocuments(query);

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
      total,
    });

    // -----------------------------
    // FETCH TRENDING EVENTS
    // -----------------------------
    const trendingEvents = await Event.find(query)
      .sort({
        soldTickets: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNum)
      .populate("organizer", "fullName email");

    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Trending events fetched successfully",
      data: {
        events: trendingEvents,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch trending events",
      error: error.message,
    });
  }
};
