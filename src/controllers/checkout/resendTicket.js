import httpStatus from "http-status";

import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const resendTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.userId;

    const ticket = await TicketCollection.findOne({
      _id: ticketId,
      user: userId,
    })
      .populate("event", "title bannerImage startDate startTime venue")
      .populate("user", "fullName email");

    if (!ticket) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Ticket not found",
      });
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Ticket resent successfully",
      data: ticket,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to resend ticket",
      error: error.message,
    });
  }
};
