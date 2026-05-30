import httpStatus from "http-status";

import PromoCodeCollection from "../../models/promoCode.js";
import Event from "../../models/event.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import PaymentCollection from "../../models/payment.js";

export const applyPromoCode = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { slug } = req.params;
    const { code, quantity = 1 } = req.body;

    const event = await Event.findOne({ slug });

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    const promo = await PromoCodeCollection.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promo) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Invalid promo code",
      });
    }

    if (promo.expiresAt < new Date()) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Promo code expired",
      });
    }

    const baseAmount = event.ticketPrice * quantity;

    let discountAmount = 0;

    if (promo.discountType === "percentage") {
      discountAmount = (baseAmount * promo.discountValue) / 100;
    } else {
      discountAmount = promo.discountValue;
    }

    const finalAmount = baseAmount - discountAmount;

    // 🔥 SAVE INTO PENDING PAYMENT SESSION
    await PaymentCollection.findOneAndUpdate(
      {
        user: userId,
        event: event._id,
        status: "pending",
      },
      {
        user: userId,
        event: event._id,
        quantity,
        promoCode: promo.code,
        discountAmount,
        finalAmount,
        amount: baseAmount,
        status: "pending",
      },
      { upsert: true, new: true },
    );

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Promo applied successfully",
      data: {
        originalAmount: baseAmount,
        discountAmount,
        finalAmount,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to apply promo code",
      error: error.message,
    });
  }
};
