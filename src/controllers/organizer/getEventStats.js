import httpStatus from "http-status";
import Event from "../../models/event.model.js";
import TicketCollection from "../../models/ticket.js";
import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const getEventStats = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const eventId = req.params.id;

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
    // GET TICKETS
    // -------------------------
    const tickets = await TicketCollection.find({
      event: eventId,
      paymentStatus: "paid",
    });

    // -------------------------
    // REVENUE CALCULATION
    // -------------------------
    const revenue = tickets.reduce((acc, ticket) => {
      return acc + (ticket.totalAmount || 0);
    }, 0);

    // -------------------------
    // REMAINING TICKETS
    // -------------------------
    const remainingTickets = event.totalTickets - event.soldTickets;

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Event stats fetched successfully",
      data: {
        eventId,
        title: event.title,
        ticketsSold: tickets.length,
        revenue,
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
