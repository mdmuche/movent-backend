import httpStatus from "http-status";
import mongoose from "mongoose";

import Event from "../../models/event.js";
import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const getEventStats = async (req, res) => {
  try {
    const organizerId = new mongoose.Types.ObjectId(req.user.userId);

    const eventId = new mongoose.Types.ObjectId(req.params.id);

    // -------------------------
    // FIND EVENT (SECURITY CHECK)
    // -------------------------
    const event = await Event.findOne({
      _id: eventId,
      organizer: organizerId,
    });

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found or unauthorized",
      });
    }

    // -------------------------
    // TICKET ANALYTICS
    // -------------------------
    const ticketStats = await TicketCollection.aggregate([
      {
        $match: {
          event: eventId,
          paymentStatus: "paid",
        },
      },

      {
        $group: {
          _id: null,

          ticketsSold: {
            $sum: 1,
          },

          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const stats = ticketStats[0] || {
      ticketsSold: 0,
      revenue: 0,
    };

    // -------------------------
    // REMAINING TICKETS
    // -------------------------
    const remainingTickets = event.totalTickets - event.soldTickets;

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Event stats fetched successfully",

      data: {
        eventId: event._id,

        title: event.title,

        ticketsSold: stats.ticketsSold,

        revenue: stats.revenue,

        remainingTickets,

        totalTickets: event.totalTickets,

        soldTickets: event.soldTickets,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching event stats",
      error: error.message,
    });
  }
};
