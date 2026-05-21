import httpStatus from "http-status";

import NewsletterCollection from "../../models/newsletter.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await NewsletterCollection.findOne({
      email,
    });

    if (!subscriber) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Subscriber not found",
      });
    }

    subscriber.isSubscribed = false;

    await subscriber.save();

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Unsubscribed successfully",
      data: subscriber,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to unsubscribe",
      error: error.message,
    });
  }
};
