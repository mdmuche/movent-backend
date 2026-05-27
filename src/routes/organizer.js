import express from "express";

import { validateRequest } from "../middlewares/validateRequest.js";
import { createEvent } from "../controllers/organizer/createEvent.js";
import { updateEvent } from "../controllers/organizer/updateEvent.js";
import { deleteEvent } from "../controllers/organizer/deleteEvent.js";
import { getMyEvents } from "../controllers/organizer/getMyEvents.js";
import { getOrganizerAnalytics } from "../controllers/organizer/getOrganizerAnalytics.js";
import { getEventStats } from "../controllers/organizer/getEventStats.js";

import { requireOrganizer } from "../middlewares/authFlow.js";

import upload from "../config/multer.js";

// validators
import { createEventSchema } from "../validators/organizer/createEvent.js";
import { updateEventSchema } from "../validators/organizer/updateEvent.js";
import { getMyEventsSchema } from "../validators/organizer/getMyEvents.js";
import { getOrganizerAnalyticsSchema } from "../validators/organizer/getOrganizerAnalytics.js";
import { getEventStatsSchema } from "../validators/organizer/getEventStats.js";
import { deleteEventSchema } from "../validators/organizer/deleteEvent.js";

const router = express.Router();

router.get(
  "/analytics",
  requireOrganizer,
  validateRequest(getOrganizerAnalyticsSchema, "query"),
  getOrganizerAnalytics,
);

router.get(
  "/events/:id/stats",
  requireOrganizer,
  validateRequest(getEventStatsSchema, "params"),
  getEventStats,
);

router.get(
  "/my-events",
  requireOrganizer,
  validateRequest(getMyEventsSchema, "query"),
  getMyEvents,
);

router.post(
  "/events",
  requireOrganizer,
  upload.single("bannerImage"),
  validateRequest(createEventSchema),
  createEvent,
);

router.put(
  "/events/:id",
  requireOrganizer,
  upload.single("bannerImage"),
  validateRequest(deleteEventSchema, "params"),
  validateRequest(updateEventSchema),
  updateEvent,
);

router.delete(
  "/events/:id",
  requireOrganizer,
  validateRequest(deleteEventSchema, "params"),
  deleteEvent,
);

export default router;
