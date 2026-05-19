import httpStatus from "http-status";

import Event from "../../models/event.js";
import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getOrganizerAnalytics = async (req, res) => {
  try {
    const organizerId = req.user.userId;

    const { page = 1, limit = 10 } = req.query;

    // -------------------------
    // ALL EVENTS BY ORGANIZER
    // -------------------------
    const events = await Event.find({ organizer: organizerId });

    const eventIds = events.map((e) => e._id);

    // -------------------------
    // ALL PAID TICKETS
    // -------------------------
    const tickets = await TicketCollection.find({
      event: { $in: eventIds },
      paymentStatus: "paid",
    })
      .populate("user", "fullName email")
      .populate("event", "title");

    // -------------------------
    // TOTAL REVENUE
    // -------------------------
    const totalRevenue = tickets.reduce((acc, ticket) => {
      return acc + (ticket.totalAmount || 0);
    }, 0);

    // -------------------------
    // EVENT STATUS BREAKDOWN
    // -------------------------
    const now = new Date();

    const upcomingEvents = events.filter((e) => new Date(e.startDate) > now);

    const pastEvents = events.filter((e) => new Date(e.endDate) < now);

    const activeEvents = events.filter(
      (e) => new Date(e.startDate) <= now && new Date(e.endDate) >= now,
    );

    // -------------------------
    // PAGINATION (ONLY FOR RECENT ACTIVITY)
    // -------------------------
    const {
      skip,
      limit: limitNum,
      pagination,
    } = paginationUtils({
      page,
      limit,
    });

    const sortedTickets = tickets.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    const paginatedTickets = sortedTickets.slice(skip, skip + limitNum);

    const recentActivity = paginatedTickets.map((ticket) => ({
      type: "ticket_purchase",
      user: ticket.user,
      event: ticket.event,
      amount: ticket.totalAmount,
      createdAt: ticket.createdAt,
    }));

    // -------------------------
    // RESPONSE
    // -------------------------
    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Organizer analytics fetched successfully",
      data: {
        totalEvents: events.length,
        totalTicketsSold: tickets.length,
        totalRevenue,

        upcomingEvents: upcomingEvents.length,
        pastEvents: pastEvents.length,
        activeEvents: activeEvents.length,

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
