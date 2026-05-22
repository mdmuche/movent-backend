import express from "express";

import { validateRequest } from "../middlewares/validateRequest.js";
import { createEvent } from "../controllers/organizer/createEvent.js";
import { updateEvent } from "../controllers/organizer/updateEvent.js";
import { deleteEvent } from "../controllers/organizer/deleteEvent.js";
import { getMyEvents } from "../controllers/organizer/getMyEvents.js";
import { getOrganizerAnalytics } from "../controllers/organizer/getOrganizerAnalytics.js";
import { getEventStats } from "../controllers/organizer/getEventStats.js";

import { verifyToken } from "../middlewares/verifyAuth.js";
import { rolesAllowed } from "../middlewares/roleBased.js";
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";

import upload from "../config/multer.js";

// validators
import { createEventSchema } from "../validators/organizer/createEvent.js";
import { updateEventSchema } from "../validators/organizer/updateEvent.js";
import { getMyEventsSchema } from "../validators/organizer/getMyEvents.js";
import { getOrganizerAnalyticsSchema } from "../validators/organizer/getOrganizerAnalytics.js";
import { getEventStatsSchema } from "../validators/organizer/getEventStats.js";

const router = express.Router();

router.get(
  "/analytics",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("organizer", "admin"),
  validateRequest(getOrganizerAnalyticsSchema),
  getOrganizerAnalytics,
);

router.get(
  "/events/:id/stats",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("organizer", "admin"),
  validateRequest(getEventStatsSchema),
  getEventStats,
);

router.get(
  "/my-events",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("organizer", "admin"),
  validateRequest(getMyEventsSchema),
  getMyEvents,
);

router.post(
  "/events",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("organizer", "admin"),
  upload.single("bannerImage"),
  validateRequest(createEventSchema),
  createEvent,
);

router.put(
  "/events/:id",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("organizer", "admin"),
  upload.single("bannerImage"),
  validateRequest(updateEventSchema),
  updateEvent,
);

router.delete(
  "/events/:id",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("organizer", "admin"),
  deleteEvent,
);

export default router;
