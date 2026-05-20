import httpStatus from "http-status";

import PaymentCollection from "../../models/payment.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const cancelCheckout = async (req, res) => {
  try {
    const { reference } = req.params;
    const userId = req.user.userId;

    const payment = await PaymentCollection.findOne({
      reference,
      user: userId,
    });

    if (!payment) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Payment not found",
      });
    }

    if (payment.status === "paid") {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Cannot cancel a completed payment",
      });
    }

    payment.status = "cancelled";

    await payment.save();

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Checkout cancelled successfully",
      data: payment,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to cancel checkout",
      error: error.message,
    });
  }
};
