import express from "express";

import { validateRequest } from "../middlewares/validateRequest.js";
import { createEvent } from "../controllers/organizer/createEvent.js";
import { verifyToken } from "../middlewares/verifyAuth.js";
import { rolesAllowed } from "../middlewares/roleBased.js";
import { createEventSchema } from "../validators/organizer/createEvent.js";
import upload from "../config/multer.js";
import { updateEvent } from "../controllers/organizer/updateEvent.js";
import { deleteEvent } from "../controllers/organizer/deleteEvent.js";
import { getMyEvents } from "../controllers/organizer/getMyEvents.js";
import { getOrganizerAnalytics } from "../controllers/organizer/getOrganizerAnalytics.js";
import { getEventStats } from "../controllers/organizer/getEventStats.js";

const router = express.Router();
router.get(
  "/analytics",
  verifyToken,
  rolesAllowed("organizer", "admin"),
  getOrganizerAnalytics,
);

router.get(
  "/events/:id/stats",
  verifyToken,
  rolesAllowed("organizer", "admin"),
  getEventStats,
);
router.get(
  "/my-events",
  verifyToken,
  rolesAllowed("organizer", "admin"),
  getMyEvents,
);

router.post(
  "/events",
  verifyToken,
  rolesAllowed("organizer", "admin"),
  validateRequest(createEventSchema),
  upload.single("bannerImage"),
  createEvent,
);

router.put(
  "/events/:id",
  verifyToken,
  rolesAllowed("organizer", "admin"),
  upload.single("bannerImage"),
  updateEvent,
);

router.delete(
  "/events/:id",
  verifyToken,
  rolesAllowed("organizer", "admin"),
  deleteEvent,
);

export default router;
