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

    // -----------------------------
    // BASE MATCH
    // -----------------------------
    const baseMatch = {
      startDate: { $gte: new Date() },
      status: "upcoming",
      $expr: {
        $lt: ["$soldTickets", "$totalTickets"],
      },
    };

    let recommendedEvents = [];
    let total = 0;

    // -----------------------------
    // INTEREST-BASED MATCH
    // -----------------------------
    let matchQuery = baseMatch;

    if (user.interests?.length) {
      matchQuery = {
        ...baseMatch,
        category: {
          $in: user.interests,
        },
      };

      total = await Event.countDocuments(matchQuery);
    }

    // -----------------------------
    // FALLBACK TOTAL
    // -----------------------------
    if (!total) {
      matchQuery = baseMatch;

      total = await Event.countDocuments(matchQuery);
    }

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
    // FETCH RECOMMENDED EVENTS
    // -----------------------------
    recommendedEvents = await Event.aggregate([
      {
        $match: matchQuery,
      },

      {
        $sort: user.interests?.length ? { startDate: 1 } : { soldTickets: -1 },
      },

      {
        $skip: skip,
      },

      {
        $limit: limitNum,
      },

      {
        $lookup: {
          from: "users",
          localField: "organizer",
          foreignField: "_id",
          as: "organizer",
        },
      },

      {
        $unwind: "$organizer",
      },

      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          category: 1,
          bannerImage: 1,
          startDate: 1,
          endDate: 1,
          venue: 1,
          city: 1,
          ticketPrice: 1,
          soldTickets: 1,
          totalTickets: 1,

          organizer: {
            _id: "$organizer._id",
            fullName: "$organizer.fullName",
            email: "$organizer.email",
          },
        },
      },
    ]);

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
