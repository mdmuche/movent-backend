import httpStatus from "http-status";
import mongoose from "mongoose";

import TicketCollection from "../../models/ticket.js";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getUpcomingEvents = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

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
    // UPCOMING EVENTS AGGREGATION
    // -----------------------------
    const upcomingEvents = await TicketCollection.aggregate([
      {
        $match: {
          user: userId,
        },
      },

      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },

      {
        $unwind: "$event",
      },

      {
        $match: {
          "event.startDate": {
            $gte: new Date(),
          },
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: limitNum,
      },

      {
        $replaceRoot: {
          newRoot: "$event",
        },
      },
    ]);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Upcoming events fetched successfully",

      data: {
        events: upcomingEvents,

        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching upcoming events",
      error: error.message,
    });
  }
};
