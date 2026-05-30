import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";

import Event from "../../models/event.js";
import TicketCollection from "../../models/ticket.js";
import UserActivity from "../../models/userActivity.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { sendNotification } from "../../services/notification.js";

export const purchaseTicket = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { slug } = req.params;
    const { quantity = 1, ticketType = "regular" } = req.body;

    const event = await Event.findOne({ slug });

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    // ❌ BLOCK PAID EVENTS
    if (!event.isFree) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "This event requires payment. Use checkout instead.",
      });
    }

    // check availability
    const remainingTickets = event.totalTickets - event.soldTickets;

    if (remainingTickets < quantity) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Not enough tickets available",
      });
    }

    // prevent duplicate free ticket purchase
    const existingTicket = await TicketCollection.findOne({
      user: userId,
      event: event._id,
    });

    if (existingTicket) {
      return errorResponse(res, {
        statusCode: httpStatus.CONFLICT,
        message: "You already claimed this free ticket",
      });
    }

    // create ticket
    const ticket = await TicketCollection.create({
      user: userId,
      event: event._id,
      quantity,
      ticketType,
      totalAmount: 0,
      paymentStatus: "paid",
      ticketCode: uuidv4(),
    });

    // update event
    event.soldTickets += quantity;
    await event.save();

    // notification
    await sendNotification({
      user: userId,
      title: "Ticket Claimed 🎟",
      message: `You successfully claimed ${quantity} free ticket(s) for ${event.title}`,
      type: "ticket",
      metadata: {
        eventId: event._id,
        quantity,
      },
    });

    // activity log
    await UserActivity.create({
      user: userId,
      type: "ticket_claim",
      event: event._id,
      metadata: {
        quantity,
      },
    });

    return successResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Free ticket claimed successfully",
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
