import httpStatus from "http-status";

import PaymentCollection from "../../models/payment.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await PaymentCollection.findById(paymentId);

    if (!payment) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Payment not found",
      });
    }

    if (payment.status === "refunded") {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Payment already refunded",
      });
    }

    payment.status = "refunded";
    payment.refundedAt = new Date();

    await payment.save();

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Payment refunded successfully",
      data: payment,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Refund failed",
      error: error.message,
    });
  }
};
