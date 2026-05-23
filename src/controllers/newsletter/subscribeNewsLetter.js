import httpStatus from "http-status";

import NewsletterCollection from "../../models/newsletter.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Email is required",
      });
    }

    const existingSubscriber = await NewsletterCollection.findOne({
      email,
    });

    // -----------------------------
    // ALREADY SUBSCRIBED
    // -----------------------------
    if (existingSubscriber && existingSubscriber.isSubscribed) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Email already subscribed",
      });
    }

    // -----------------------------
    // RE-SUBSCRIBE
    // -----------------------------
    if (existingSubscriber) {
      existingSubscriber.isSubscribed = true;

      await existingSubscriber.save();

      return successResponse(res, {
        statusCode: httpStatus.OK,
        message: "Newsletter subscription restored successfully",
        data: existingSubscriber,
      });
    }

    // -----------------------------
    // CREATE NEW SUBSCRIBER
    // -----------------------------
    const subscriber = await NewsletterCollection.create({
      email,
    });

    return successResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Subscribed to newsletter successfully",
      data: subscriber,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to subscribe",
      error: error.message,
    });
  }
};
