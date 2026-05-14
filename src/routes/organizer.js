import express from "express";

import { validateRequest } from "../middlewares/validateRequest.js";
import { createEvent } from "../controllers/organizer/createEvent.js";
import { verifyToken } from "../middlewares/verifyAuth.js";
import { rolesAllowed } from "../middlewares/roleBased.js";
import { createEventSchema } from "../validators/organizer/createEvent.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post(
  "/events",
  validateRequest(createEventSchema),
  verifyToken,
  rolesAllowed("organizer", "admin"),
  upload.single("bannerImage"),
  createEvent,
);

export default router;
