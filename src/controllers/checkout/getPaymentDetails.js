import httpStatus from "http-status";

import PaymentCollection from "../../models/payment.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const getPaymentDetails = async (req, res) => {
  try {
    const { reference } = req.params;
    const query = { reference };

    if (req.userDetails?.role !== "admin") {
      query.user = req.user.userId;
    }

    const payment = await PaymentCollection.findOne(query)
      .populate("user", "fullName email")
      .populate("event", "title bannerImage startDate");

    if (!payment) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Payment not found",
      });
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Payment details fetched successfully",
      data: payment,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch payment details",
      error: error.message,
    });
  }
};
