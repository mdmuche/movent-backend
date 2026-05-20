import httpStatus from "http-status";
import axios from "axios";

import PaymentCollection from "../../models/payment.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // -----------------------------
    // VERIFY WITH PAYSTACK
    // -----------------------------
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = response.data.data;

    if (data.status !== "success") {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Payment not successful",
      });
    }

    // -----------------------------
    // FIND PAYMENT RECORD
    // -----------------------------
    const payment = await PaymentCollection.findOne({ reference });

    if (!payment) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Payment not found",
      });
    }

    // -----------------------------
    // UPDATE ONLY PAYMENT STATUS
    // -----------------------------
    if (payment.status !== "paid") {
      payment.status = "paid";
      payment.paidAt = new Date();
      await payment.save();
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Payment verified successfully",
      data: {
        reference: payment.reference,
        status: payment.status,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Verification failed",
      error: error.message,
    });
  }
};
