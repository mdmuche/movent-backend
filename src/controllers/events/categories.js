import httpStatus from "http-status";

import Event from "../../models/event.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

const ALL_CATEGORIES = [
  "music",
  "technology",
  "business",
  "sports",
  "education",
  "culture",
  "fashion",
  "comedy",
  "gaming",
  "other",
];

export const getEventCategories = async (req, res) => {
  try {
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    // Convert aggregation result into lookup object
    const categoryMap = categoryStats.reduce((acc, item) => {
      acc[item.category] = item.count;
      return acc;
    }, {});

    // Ensure all categories are returned
    const categories = ALL_CATEGORIES.map((category) => ({
      category,
      count: categoryMap[category] || 0,
    }));

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};
