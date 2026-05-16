import httpStatus from "http-status";
import Event from "../../models/event.model.js";
import TicketCollection from "../../models/ticket.js";
import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const getOrganizerAnalytics = async (req, res) => {
  try {
    const organizerId = req.user.userId;

    // -------------------------
    // ALL EVENTS BY ORGANIZER
    // -------------------------
    const events = await Event.find({ organizer: organizerId });

    const eventIds = events.map((e) => e._id);

    // -------------------------
    // ALL TICKETS FOR THESE EVENTS
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
    // UPCOMING / PAST / ACTIVE
    // -------------------------
    const now = new Date();

    const upcomingEvents = events.filter((e) => new Date(e.startDate) > now);

    const pastEvents = events.filter((e) => new Date(e.endDate) < now);

    const activeEvents = events.filter(
      (e) => new Date(e.startDate) <= now && new Date(e.endDate) >= now,
    );

    // -------------------------
    // RECENT ACTIVITY (LAST 10 TICKET PURCHASES)
    // -------------------------
    const recentActivity = tickets
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map((ticket) => ({
        type: "ticket_purchase",
        user: ticket.user,
        event: ticket.event,
        amount: ticket.totalAmount,
        createdAt: ticket.createdAt,
      }));

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
