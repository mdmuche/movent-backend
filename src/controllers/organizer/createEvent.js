import httpStatus from "http-status";
import slugify from "slugify";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { uploadToCloudinary } from "../../utils/cloudinary/uploadCloudinary.js";

import Event from "../../models/event.js";
import AuditLog from "../../models/auditLog.js";
import User from "../../models/user.js";
import { sendNotification } from "../../services/notification.js";

//will need to use geocoding api to convert address to coordinates for location field in event model
//todo import axios from "axios";

const normalizeList = (value) => {
  if (!value) return [];

  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap((item) => String(item).split(","))
    .map((item) => item.trim())
    .filter(Boolean);
};

//todo const buildLocation = ({ latitude, longitude }) => {
//   const hasLongitude = longitude !== undefined && longitude !== "";
//   const hasLatitude = latitude !== undefined && latitude !== "";

//   if (!hasLongitude && !hasLatitude) return null;
//   if (!hasLongitude || !hasLatitude) return false;

//   const lng = Number(longitude);
//   const lat = Number(latitude);

//   if (
//     !Number.isFinite(lng) ||
//     !Number.isFinite(lat) ||
//     lng < -180 ||
//     lng > 180 ||
//     lat < -90 ||
//     lat > 90
//   ) {
//     return false;
//   }

//   return {
//     type: "Point",
//     coordinates: [lng, lat],
//   };
// };

const getBannerImageSource = (req) => {
  if (req.file?.path) return req.file.path;

  if (typeof req.body.bannerImage === "string" && req.body.bannerImage.trim()) {
    return req.body.bannerImage.trim();
  }

  return null;
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
    } = req.body;

    //todo const address = `${venue}, ${city}, ${state}, ${country}`;

    // const geo = await axios.get(
    //   `https://maps.googleapis.com/maps/api/geocode/json`,
    //   {
    //     params: {
    //       address,
    //       key: process.env.GOOGLE_MAPS_KEY,
    //     },
    //   },
    // );

    // if (!geo.data.results || geo.data.results.length === 0) {
    //   return errorResponse(res, {
    //     statusCode: httpStatus.BAD_REQUEST,
    //     message: "Invalid location. Could not geocode address",
    //   });
    // }

    // const { lat, lng } = geo.data.results[0].geometry.location;

    const organizer = await User.findById(req.user.userId);

    if (!organizer) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    const free = isFree === true || isFree === "true";

    if (!free && (!ticketPrice || ticketPrice <= 0)) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Paid events must have a valid ticket price",
      });
    }

    //todo const location = buildLocation({
    //   latitude: Number(lat),
    //   longitude: Number(lng),
    // });

    // if (location === false) {
    //   return errorResponse(res, {
    //     statusCode: httpStatus.BAD_REQUEST,
    //     message: "Longitude and latitude must both be valid coordinates",
    //   });
    // }

    let bannerImage;
    const bannerImageSource = getBannerImageSource(req);

    if (!bannerImageSource) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Event banner image is required",
      });
    }

    const result = await uploadToCloudinary(bannerImageSource, {
      folder: "movent/events",
    });

    bannerImage = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };

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
      approvalStatus:
        organizer.isVerifiedOrganizer && organizer.reputationScore > 50
          ? "approved"
          : "pending",
      entryRequirements: normalizeList(entryRequirements),
      agreedToRefundPolicy,
      //todo ...(location && { location }),
    });
    await AuditLog.create({
      action: "event_created",
      performedBy: req.user.userId,
      targetType: "event",
      targetId: event._id,
    });

    await sendNotification({
      user: req.user.userId,
      title: "Event Created 🎉",
      message: `Your event "${event.title}" has been created successfully.`,
      type: "event",
      metadata: { eventId: event._id },
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
