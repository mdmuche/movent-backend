import httpStatus from "http-status";

import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const validateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await TicketCollection.findById(ticketId)
      .populate("event", "title startDate endDate venue")
      .populate("user", "fullName email");

    if (!ticket) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Ticket not found",
      });
    }

    // -----------------------------
    // BASIC VALIDATION LOGIC
    // -----------------------------
    if (ticket.paymentStatus !== "paid") {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Invalid ticket (payment not completed)",
      });
    }

    const now = new Date();

    if (ticket.event.startDate && new Date(ticket.event.startDate) > now) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Event has not started yet",
      });
    }

    if (ticket.event.endDate && new Date(ticket.event.endDate) < now) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Event has already ended",
      });
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Ticket is valid",
      data: {
        valid: true,
        ticket,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Ticket validation failed",
      error: error.message,
    });
  }
};
