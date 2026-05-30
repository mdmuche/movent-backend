import httpStatus from "http-status";

import PromoCodeCollection from "../../models/promoCode.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getAllPromoCodes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // -----------------------------
    // TOTAL COUNT
    // -----------------------------
    const total = await PromoCodeCollection.countDocuments();

    // -----------------------------
    // PAGINATION
    // -----------------------------
    const {
      skip,
      limit: limitNum,
      pagination,
    } = await paginationUtils({
      page,
      limit,
      total,
    });

    // -----------------------------
    // FETCH PROMO CODES
    // -----------------------------
    const promoCodes = await PromoCodeCollection.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Promo codes fetched successfully",
      data: {
        promoCodes,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch promo codes",
      error: error.message,
    });
  }
};
