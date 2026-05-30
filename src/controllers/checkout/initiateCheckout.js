import httpStatus from "http-status";
import axios from "axios";
import { v4 } from "uuid";

import PaymentCollection from "../../models/payment.js";
import Event from "../../models/event.js";
import PromoCodeCollection from "../../models/promoCode.js";
import SystemSettings from "../../models/systemSettings.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const initiateCheckout = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { slug } = req.params;
    const { quantity = 1, billingInfo } = req.body;

    // -----------------------------
    // CREATE REFERENCE
    // -----------------------------
    const reference = `MOVENT_${v4()}`;

    // -----------------------------
    // GET EVENT
    // -----------------------------
    const event = await Event.findOne({ slug });

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    // -----------------------------
    // SYSTEM SETTINGS CHECK
    // -----------------------------
    const settings = await SystemSettings.findOne();
    const maxTicketPerPurchase = settings?.maxTicketPerPurchase || 10;

    if (quantity > maxTicketPerPurchase) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: `You can only purchase a maximum of ${maxTicketPerPurchase} tickets per order`,
      });
    }

    // -----------------------------
    // CHECK EXISTING SESSION
    // -----------------------------
    let paymentSession = await PaymentCollection.findOne({
      user: userId,
      event: event._id,
      status: "pending",
    });

    // -----------------------------
    // CREATE SESSION IF NOT EXISTS
    // -----------------------------
    if (!paymentSession) {
      paymentSession = await PaymentCollection.create({
        user: userId,
        event: event._id,
        quantity,
        reference,
        amount: event.ticketPrice * quantity,
        status: "pending",
      });
    }

    // -----------------------------
    // APPLY PROMO IF EXISTS
    // -----------------------------
    let amount = paymentSession.amount;

    if (paymentSession.promoCode) {
      const promo = await PromoCodeCollection.findOne({
        code: paymentSession.promoCode.toUpperCase(),
        isActive: true,
      });

      if (promo) {
        if (promo.expiresAt < new Date()) {
          return errorResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Promo code expired",
          });
        }

        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
          return errorResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Promo code usage limit reached",
          });
        }

        amount = paymentSession.finalAmount || amount;
      }
    }

    // -----------------------------
    // UPDATE SESSION
    // -----------------------------
    paymentSession.reference = reference;
    paymentSession.billingInfo = billingInfo;
    paymentSession.status = "initialized";

    await paymentSession.save();

    // -----------------------------
    // INIT PAYSTACK
    // -----------------------------
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
