import httpStatus from "http-status";
import { nanoid } from "nanoid";

import PromoCodeCollection from "../../models/promoCode.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const createPromoCode = async (req, res) => {
  try {
    const {
      discountType,
      discountValue,
      durationDays,
      usageLimit,
      isActive = true,
    } = req.body;

    if (!durationDays || durationDays <= 0) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "durationDays must be greater than 0",
      });
    }

    const expiresAt = new Date(Date.now() + durationDays * 86400000);

    const code = `MOVENT-${nanoid(8).toUpperCase()}`;

    const promo = await PromoCodeCollection.create({
      code,
      discountType,
      discountValue,
      durationDays,
      expiresAt,
      isActive,
      usageLimit,
    });

    return successResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Promo code created successfully",
      data: promo,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create promo code",
      error: error.message,
    });
  }
};
