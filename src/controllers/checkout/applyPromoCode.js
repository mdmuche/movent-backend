import httpStatus from "http-status";

import PromoCodeCollection from "../../models/promoCode.js";
import Event from "../../models/event.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const applyPromoCode = async (req, res) => {
  try {
    const { code, eventId, quantity = 1 } = req.body;

    const promo = await PromoCodeCollection.findOne({
      code: code.toUpperCase(),
    });

    if (!promo) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Invalid promo code",
      });
    }

    if (!promo.isActive) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Promo code is inactive",
      });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Promo code expired",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    const originalAmount = event.ticketPrice * quantity;

    let discountedAmount = originalAmount;

    if (promo.discountType === "percentage") {
      discountedAmount =
        originalAmount - (originalAmount * promo.discountValue) / 100;
    } else {
      discountedAmount = originalAmount - promo.discountValue;
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Promo code applied successfully",
      data: {
        originalAmount,
        discountedAmount,
        discount: promo.discountValue,
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
