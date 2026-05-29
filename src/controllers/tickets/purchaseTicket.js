import httpStatus from "http-status";
import { v4 } from "uuid";

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
    const { quantity, ticketType } = req.body;

    const event = await Event.findOne({ slug });

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    const remainingTickets = event.totalTickets - event.soldTickets;

    if (remainingTickets < quantity) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Not enough tickets available",
      });
    }

    const totalAmount = event.isFree ? 0 : event.ticketPrice * quantity;

    try {
      const ticket = await TicketCollection.create({
        user: userId,
        event: event._id,
        quantity,
        ticketType,
        totalAmount,
        paymentStatus: "paid",
        ticketCode: v4(),
      });

      event.soldTickets += quantity;
      await event.save();

      // notification logic
      await sendNotification({
        user: userId,
        title: "Ticket Purchase Successful 🎟",
        message: `You successfully purchased ${quantity} ticket(s) for ${event.title}`,
        type: "ticket",
        metadata: {
          eventId: event._id,
          quantity,
          amount: totalAmount,
        },
      });

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
    } catch (err) {
      // handles duplicate key from race condition
      if (err.code === 11000) {
        return errorResponse(res, {
          statusCode: httpStatus.CONFLICT,
          message: "You already purchased this ticket",
        });
      }

      throw err;
    }
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error purchasing ticket",
      error: error.message,
    });
  }
};
