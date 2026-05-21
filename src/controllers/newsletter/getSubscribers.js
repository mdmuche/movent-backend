import httpStatus from "http-status";

import NewsletterCollection from "../../models/newsletter.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const {
      skip,
      limit: limitNum,
      pagination,
    } = await paginationUtils({
      page,
      limit,
      model: NewsletterCollection,
      query: { isSubscribed: true },
    });

    const subscribers = await NewsletterCollection.find({
      isSubscribed: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Subscribers fetched successfully",
      data: {
        subscribers,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch subscribers",
      error: error.message,
    });
  }
};
