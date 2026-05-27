import httpStatus from "http-status";
import slugify from "slugify";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { uploadToCloudinary } from "../../utils/cloudinary/uploadCloudinary.js";

import Event from "../../models/event.js";
import AuditLog from "../../models/auditLog.js";

const normalizeList = (value) => {
  if (!value) return [];

  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap((item) => String(item).split(","))
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildLocation = ({ longitude, latitude }) => {
  const hasLongitude = longitude !== undefined && longitude !== "";
  const hasLatitude = latitude !== undefined && latitude !== "";

  if (!hasLongitude && !hasLatitude) return null;
  if (!hasLongitude || !hasLatitude) return false;

  const lng = Number(longitude);
  const lat = Number(latitude);

  if (
    !Number.isFinite(lng) ||
    !Number.isFinite(lat) ||
    lng < -180 ||
    lng > 180 ||
    lat < -90 ||
    lat > 90
  ) {
    return false;
  }

  return {
    type: "Point",
    coordinates: [lng, lat],
  };
};

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
      entryRequirements,
      agreedToRefundPolicy,
      ticketPrice,
      totalTickets,
      tags,
      longitude,
      latitude,
    } = req.body;

    const free = isFree === true || isFree === "true";

    if (!free && (!ticketPrice || ticketPrice <= 0)) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Paid events must have a valid ticket price",
      });
    }

    const location = buildLocation({ longitude, latitude });

    if (location === false) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Longitude and latitude must both be valid coordinates",
      });
    }

    let bannerImage = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, {
        folder: "movent/events",
      });

      bannerImage = {
        public_id: result.public_id,
        secure_url: result.secure_url,
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
      organizer: req.user.userId,
      isFree: free,
      ticketPrice: free ? 0 : Number(ticketPrice),
      totalTickets: Number(totalTickets),
      soldTickets: 0,
      tags: normalizeList(tags),
      bannerImage,
      status: "draft",
      entryRequirements: normalizeList(entryRequirements),
      agreedToRefundPolicy,
      ...(location && { location }),
    });

    await AuditLog.create({
      action: "event_created",
      performedBy: req.user.userId,
      targetType: "event",
      targetId: event._id,
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
