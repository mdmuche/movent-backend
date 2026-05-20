import httpStatus from "http-status";
import axios from "axios";

import PaymentCollection from "../../models/payment.js";
import Event from "../../models/event.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const initiateCheckout = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { eventId, quantity = 1, billingInfo } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    const amount = event.ticketPrice * quantity;

    const reference = `MOVENT_${Date.now()}`;

    await PaymentCollection.create({
      user: userId,
      event: eventId,
      amount,
      quantity,
      reference,
      billingInfo,
    });

    const paystack = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: billingInfo.email,
        amount: amount * 100,
        reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Checkout initialized successfully",
      data: paystack.data.data,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Checkout failed",
      error: error.message,
    });
  }
};
