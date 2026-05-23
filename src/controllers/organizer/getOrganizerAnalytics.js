import httpStatus from "http-status";
import mongoose from "mongoose";

import Event from "../../models/event.js";
import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getOrganizerAnalytics = async (req, res) => {
  try {
    const organizerId = new mongoose.Types.ObjectId(req.user.userId);

    const { page = 1, limit = 10 } = req.query;

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
    });

    // -------------------------
    // EVENT ANALYTICS
    // -------------------------
    const events = await Event.aggregate([
      {
        $match: {
          organizer: organizerId,
        },
      },
      {
        $group: {
          _id: null,

          totalEvents: {
            $sum: 1,
          },

          upcomingEvents: {
            $sum: {
              $cond: [{ $gt: ["$startDate", new Date()] }, 1, 0],
            },
          },

          pastEvents: {
            $sum: {
              $cond: [{ $lt: ["$endDate", new Date()] }, 1, 0],
            },
          },

          activeEvents: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ["$startDate", new Date()] },
                    { $gte: ["$endDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // -------------------------
    // GET ORGANIZER EVENT IDS
    // -------------------------
    const organizerEvents = await Event.find({ organizer: organizerId }, "_id");

    const eventIds = organizerEvents.map((event) => event._id);

    // -------------------------
    // TOTAL TICKETS + REVENUE
    // -------------------------
    const ticketStats = await TicketCollection.aggregate([
      {
        $match: {
          event: { $in: eventIds },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,

          totalTicketsSold: {
            $sum: 1,
          },

          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    // -------------------------
    // RECENT ACTIVITY
    // -------------------------
    const recentActivity = await TicketCollection.aggregate([
      {
        $match: {
          event: { $in: eventIds },
          paymentStatus: "paid",
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
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
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
        $project: {
          _id: 0,
          type: "ticket_purchase",

          amount: "$totalAmount",

          createdAt: 1,

          user: {
            _id: "$user._id",
            fullName: "$user.fullName",
            email: "$user.email",
          },

          event: {
            _id: "$event._id",
            title: "$event.title",
          },
        },
      },
    ]);

    // -------------------------
    // RESPONSE
    // -------------------------
    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Organizer analytics fetched successfully",

      data: {
        totalEvents: events[0]?.totalEvents || 0,

        totalTicketsSold: ticketStats[0]?.totalTicketsSold || 0,

        totalRevenue: ticketStats[0]?.totalRevenue || 0,

        upcomingEvents: events[0]?.upcomingEvents || 0,

        pastEvents: events[0]?.pastEvents || 0,

        activeEvents: events[0]?.activeEvents || 0,

        recentActivity,

        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching analytics",
      error: error.message,
    });
  }
};
