import httpStatus from "http-status";
import PromoCodeCollection from "../../models/promoCode.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const createPromoCode = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      expiresAt,
      usageLimit,
      isActive = true,
    } = req.body;

    const existing = await PromoCodeCollection.findOne({
      code: code.toUpperCase(),
    });

    if (existing) {
      return errorResponse(res, {
        statusCode: httpStatus.CONFLICT,
        message: "Promo code already exists",
      });
    }

    const promo = await PromoCodeCollection.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
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
