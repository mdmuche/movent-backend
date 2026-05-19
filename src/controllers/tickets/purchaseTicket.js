import httpStatus from "http-status";

import Event from "../../models/event.js";
import TicketCollection from "../../models/ticket.js";
import UserActivity from "../../models/userActivity.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const purchaseTicket = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { eventId, quantity = 1 } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    // check ticket availability
    const remainingTickets = event.totalTickets - event.soldTickets;

    if (remainingTickets < quantity) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Not enough tickets available",
      });
    }

    // calculate amount
    const totalAmount = event.isFree ? 0 : event.ticketPrice * quantity;

    // create ticket
    const ticket = await TicketCollection.create({
      user: userId,
      event: event._id,
      quantity,
      totalAmount,
      paymentStatus: "paid",
    });

    // increment sold tickets
    event.soldTickets += quantity;

    await event.save();

    // create activity
    await UserActivity.create({
      user: userId,
      type: "ticket_purchase",
      event: event._id,

      metadata: {
        amount: totalAmount,
        quantity,
      },
    });

    return successResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Ticket purchased successfully",
      data: ticket,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error purchasing ticket",
      error: error.message,
    });
  }
};
