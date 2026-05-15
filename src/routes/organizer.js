import express from "express";

import { validateRequest } from "../middlewares/validateRequest.js";
import { createEvent } from "../controllers/organizer/createEvent.js";
import { verifyToken } from "../middlewares/verifyAuth.js";
import { rolesAllowed } from "../middlewares/roleBased.js";
import { createEventSchema } from "../validators/organizer/createEvent.js";
import upload from "../config/multer.js";
import { updateEvent } from "../controllers/organizer/updateEvent.js";
import { deleteEvent } from "../controllers/organizer/deleteEvent.js";

const router = express.Router();

router.post(
  "/events",
  validateRequest(createEventSchema),
  verifyToken,
  rolesAllowed("organizer", "admin"),
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
