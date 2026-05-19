import httpStatus from "http-status";

import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { page = 1, limit = 10 } = req.query;

    // -----------------------------
    // PAGINATION UTILS (ONLY FOR LIST DATA)
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
    // TOTAL TICKETS (NO PAGINATION NEEDED)
    // -----------------------------
    const purchasedTickets = await TicketCollection.countDocuments({
      user: userId,
    });

    // -----------------------------
    // UPCOMING EVENTS QUERY
    // -----------------------------
    const tickets = await TicketCollection.find({
      user: userId,
    })
      .populate({
        path: "event",
        match: { startDate: { $gte: new Date() } },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const upcomingEvents = tickets.map((t) => t.event).filter(Boolean);

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Dashboard overview fetched successfully",
      data: {
        purchasedTickets,
        upcomingEvents,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching dashboard overview",
      error: error.message,
    });
  }
};
