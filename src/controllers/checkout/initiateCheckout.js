import httpStatus from "http-status";
import axios from "axios";
import { v4 } from "uuid";

import PaymentCollection from "../../models/payment.js";
import Event from "../../models/event.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import SystemSettings from "../../models/systemSettings.js";

export const initiateCheckout = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { slug } = req.params;
    const { quantity = 1, billingInfo } = req.body;

    const event = await Event.findOne({ slug });

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    //blocks user from purchasing more than the maximum allowed ticket purchase
    const settings = await SystemSettings.findOne();

    const maxTicketPerPurchase = settings?.maxTicketPerPurchase || 10;

    if (quantity > maxTicketPerPurchase) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: `You can only purchase a maximum of ${maxTicketPerPurchase} tickets per order`,
      });
    }

    const amount = event.ticketPrice * quantity;

    const reference = `MOVENT_${v4()}`;

    await PaymentCollection.create({
      user: userId,
      event: event._id,
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
