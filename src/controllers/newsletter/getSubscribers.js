import httpStatus from "http-status";

import NewsletterCollection from "../../models/newsletter.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // -------------------------
    // BASE QUERY
    // -------------------------
    const query = { isSubscribed: true };

    // -------------------------
    // TOTAL
    // -------------------------
    const total = await NewsletterCollection.countDocuments(query);

    // -------------------------
    // PAGINATION
    // -------------------------
    const {
      skip,
      limit: limitNum,
      pagination,
    } = paginationUtils({
      page,
      limit,
      total,
    });

    // -------------------------
    // FETCH DATA
    // -------------------------
    const subscribers = await NewsletterCollection.find(query)
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
