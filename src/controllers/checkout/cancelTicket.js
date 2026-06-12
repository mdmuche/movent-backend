import httpStatus from "http-status";
import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const cancelTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.userId;

    const ticket = await TicketCollection.findOne({
      _id: ticketId,
      user: userId,
    });

    if (!ticket) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Ticket not found",
      });
    }

    if (ticket.status === "cancelled") {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Ticket already cancelled",
      });
    }

    if (ticket.attended) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Cannot cancel an already used ticket",
      });
    }

    // cannot after start date
    if (new Date(ticket.event.startDate) <= new Date()) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Cannot cancel ticket after event has started",
      });
    }

    ticket.status = "cancelled";
    await ticket.save();

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Ticket cancelled successfully",
      data: ticket,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to cancel ticket",
      error: error.message,
    });
  }
};
