import httpStatus from "http-status";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import PaymentCollection from "../../models/payment.js";
import TicketCollection from "../../models/ticket.js";
import Event from "../../models/event.js";
import UserActivity from "../../models/userActivity.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { sendNotification } from "../../services/notification.js";

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // -----------------------------
    // VERIFY WITH PAYSTACK
    // -----------------------------
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paystackData = response.data.data;

    if (paystackData.status !== "success") {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Payment not successful",
      });
    }

    // -----------------------------
    // FIND PAYMENT
    // -----------------------------
    const payment = await PaymentCollection.findOne({ reference });

    if (!payment) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Payment record not found",
      });
    }

    // -----------------------------
    // IDENTITY CHECK (FULL FIX)
    // -----------------------------
    const existingTicket = await TicketCollection.findOne({ reference });

    if (existingTicket) {
      return successResponse(res, {
        statusCode: httpStatus.OK,
        message: "Payment already processed",
        data: existingTicket,
      });
    }

    // -----------------------------
    // UPDATE PAYMENT
    // -----------------------------
    payment.status = "paid";
    payment.paidAt = new Date();
    await payment.save();

    // -----------------------------
    // GET EVENT
    // -----------------------------
    const event = await Event.findById(payment.event);

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    // -----------------------------
    // CREATE TICKET (SAFE)
    // -----------------------------
    const ticket = await TicketCollection.create({
      user: payment.user,
      event: payment.event,
      quantity: payment.quantity,
      ticketType: payment.ticketType,
      totalAmount: payment.amount,
      paymentStatus: "paid",
      ticketCode: uuidv4(),
      reference,
    });

    // -----------------------------
    // UPDATE EVENT SALES
    // -----------------------------
    event.soldTickets += payment.quantity;
    await event.save();

    // -----------------------------
    // NOTIFICATION
    // -----------------------------
    await sendNotification({
      user: payment.user,
      title: "Ticket Purchase Successful 🎟",
      message: `Your payment for ${event.title} was successful and your ticket is confirmed.`,
      type: "ticket",
      metadata: {
        eventId: event._id,
        quantity: payment.quantity,
        amount: payment.amount,
      },
    });

    // -----------------------------
    // ACTIVITY LOG
    // -----------------------------
    await UserActivity.create({
      user: payment.user,
      type: "ticket_purchase",
      event: event._id,
      metadata: {
        amount: payment.amount,
        quantity: payment.quantity,
        reference,
      },
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Payment verified and ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    // -----------------------------
    // HANDLE DUPLICATE KEY ERROR
    // -----------------------------
    if (error.code === 11000) {
      return errorResponse(res, {
        statusCode: httpStatus.CONFLICT,
        message: "Ticket already exists for this payment",
        error: null,
      });
    }

    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Verification failed",
      error: error.message,
    });
  }
};
