import httpStatus from "http-status";
import Event from "../models/event.model.js";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const getTrendingEvents = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const trendingEvents = await Event.find({
      startDate: { $gte: new Date() },
      status: "upcoming",
    })
      .sort({
        soldTickets: -1,
        createdAt: -1,
      })
      .limit(limit)
      .populate("organizer", "fullName email");

    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Trending events fetched successfully",
      data: {
        count: trendingEvents.length,
        events: trendingEvents,
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
