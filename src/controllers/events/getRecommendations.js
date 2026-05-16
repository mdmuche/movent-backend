import httpStatus from "http-status";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.userId;

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

    let recommendedEvents = [];

    // -----------------------------
    // 1. BASED ON USER INTERESTS
    // -----------------------------
    if (user.interests && user.interests.length > 0) {
      recommendedEvents = await Event.find({
        category: { $in: user.interests },
        startDate: { $gte: new Date() },
        status: "upcoming",
      })
        .sort({ startDate: 1 })
        .limit(10)
        .populate("organizer", "fullName email");
    }

    // -----------------------------
    // 2. FALLBACK (NO INTERESTS OR EMPTY RESULT)
    // -----------------------------
    if (!recommendedEvents.length) {
      recommendedEvents = await Event.find({
        startDate: { $gte: new Date() },
        status: "upcoming",
      })
        .sort({ soldTickets: -1 }) // trending fallback
        .limit(10)
        .populate("organizer", "fullName email");
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Recommended events fetched successfully",
      data: {
        count: recommendedEvents.length,
        events: recommendedEvents,
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
