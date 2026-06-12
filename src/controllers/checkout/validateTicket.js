import httpStatus from "http-status";

import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const validateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await TicketCollection.findById(ticketId)
      .populate("event", "title startDate endDate venue organizer")
      .populate("user", "fullName email");

    if (!ticket) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Ticket not found",
      });
    }

    if (!ticket.event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found for this ticket",
      });
    }

    if (
      req.userDetails.role !== "admin" &&
      ticket.event.organizer.toString() !== req.user.userId
    ) {
      return errorResponse(res, {
        statusCode: httpStatus.FORBIDDEN,
        message: "Unauthorized to validate this ticket",
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

    // -----------------------------
    // STATUS CHECK
    // -----------------------------
    if (ticket.status === "cancelled") {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "This ticket was cancelled",
      });
    }

    if (ticket.attended) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Ticket already used",
      });
    }

    // -----------------------------
    // EVENT TIME CHECK
    // -----------------------------
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

    // -----------------------------
    // MARK AS USED
    // -----------------------------
    ticket.attended = true;
    ticket.status = "used";
    ticket.checkedInAt = new Date();

    await ticket.save();

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
