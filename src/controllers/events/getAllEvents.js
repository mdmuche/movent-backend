import httpStatus from "http-status";
import Event from "../models/event.model.js";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      sort = "latest",
      city,
      lng,
      lat,
      radius,
    } = req.query;

    const query = {};

    // -------------------------
    // SEARCH (title / description / tags)
    // -------------------------
    if (search) {
      query.$text = { $search: search };
    }

    // -------------------------
    // CATEGORY FILTER
    // -------------------------
    if (category) {
      query.category = category;
    }

    // -------------------------
    // CITY FILTER
    // -------------------------
    if (city) {
      query.city = city;
    }

    // -------------------------
    // UPCOMING EVENTS FILTER
    // -------------------------
    if (status === "upcoming") {
      query.startDate = { $gte: new Date() };
    }

    if (status === "past") {
      query.startDate = { $lt: new Date() };
    }

    if (status === "available") {
      query.$expr = { $lt: ["$soldTickets", "$totalTickets"] };
    }

    // GEO FILTER
    if (lng && lat && radius) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: Number(radius),
        },
      };
    }

    // -------------------------
    // SORTING
    // -------------------------
    let sortOption = {};

    switch (sort) {
      case "latest":
        sortOption = { createdAt: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "price_asc":
        sortOption = { ticketPrice: 1 };
        break;

      case "price_desc":
        sortOption = { ticketPrice: -1 };
        break;

      case "popularity":
        sortOption = { soldTickets: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    // -------------------------
    // PAGINATION
    // -------------------------
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const events = await Event.find(query)
      .populate("organizer", "fullName email")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Event.countDocuments(query);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Events fetched successfully",
      data: {
        events,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching events",
      error: error.message,
    });
  }
};
