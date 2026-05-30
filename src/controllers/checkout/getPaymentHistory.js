import httpStatus from "http-status";

import PaymentCollection from "../../models/payment.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { page = 1, limit = 10 } = req.query;

    // -----------------------------
    // TOTAL COUNT
    // -----------------------------
    const total = await PaymentCollection.countDocuments({
      user: userId,
    });

    // -----------------------------
    // PAGINATION UTILS
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
    // FETCH PAYMENTS
    // -----------------------------
    const payments = await PaymentCollection.find({
      user: userId,
    })
      .populate("event", "title bannerImage startDate")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Payment history fetched successfully",
      data: {
        payments,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
};
