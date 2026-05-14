import httpStatus from "http-status";
import slugify from "slugify";
import Event from "../models/event.model.js";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { uploadToCloudinary } from "../../utils/cloudinary/uploadCloudinary.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      city,
      state,
      country,
      startDate,
      endDate,
      startTime,
      endTime,
      isFree,
      ticketPrice,
      totalTickets,
      tags,
    } = req.body;

    // basic validation
    if (
      !title ||
      !description ||
      !category ||
      !venue ||
      !city ||
      !country ||
      !startDate ||
      !endDate
    ) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Missing required fields",
      });
    }

    // ticket validation
    if (!isFree && (!ticketPrice || ticketPrice <= 0)) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Paid events must have a valid ticket price",
      });
    }

    // upload banner
    let bannerImage = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, {
        folder: "movent/events",
      });

      bannerImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const event = await Event.create({
      title,
      slug,
      description,
      category,
      venue,
      city,
      state,
      country,
      startDate,
      endDate,
      startTime,
      endTime,
      organizer: req.userDetails.id,
      isFree,
      ticketPrice: isFree ? 0 : ticketPrice,
      totalTickets,
      soldTickets: 0,
      tags,
      bannerImage,
      status: "upcoming",
    });

    return successResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error creating event",
      error: error.message,
    });
  }
};
