import httpStatus from "http-status";

import TicketCollection from "../../models/ticket.js";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getUpcomingEvents = async (req, res) => {
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
    // FETCH TICKETS (PAGINATED)
    // -----------------------------
    const tickets = await TicketCollection.find({
      user: userId,
    })
      .populate({
        path: "event",
        match: { startDate: { $gte: new Date() } },
      })
      .skip(skip)
      .limit(limitNum);

    // -----------------------------
    // EXTRACT UPCOMING EVENTS
    // -----------------------------
    const upcomingEvents = tickets.map((t) => t.event).filter(Boolean);

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
