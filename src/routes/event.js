import express from "express";

import { getEvent } from "../controllers/events/getEvent.js";
import { getAllEvents } from "../controllers/events/getAllEvents.js";
import { getRecommendations } from "../controllers/events/getRecommendations.js";
import { getTrendingEvents } from "../controllers/events/getTrendingEvents.js";
import { getUpcomingEvents } from "../controllers/events/getUpcomingEvents.js";

import { validateRequest } from "../middlewares/validateRequest.js";
import { requireAuth } from "../middlewares/authFlow.js";

import { getAllEventsSchema } from "../validators/events/getAllEvents.js";
import { getRecommendationsSchema } from "../validators/events/getRecommendations.js";
import { getTrendingEventsSchema } from "../validators/events/getTrendingEvents.js";
import { getUpcomingEventsSchema } from "../validators/events/getUpcomingEvents.js";
import { getEventSchema } from "../validators/events/getEvent.js";

const router = express.Router();

// GET all events
router.get("/", validateRequest(getAllEventsSchema, "query"), getAllEvents);

// trending events
router.get(
  "/trending",
  validateRequest(getTrendingEventsSchema, "query"),
  getTrendingEvents,
);

// recommendations
router.get(
  "/recommendations",
  requireAuth,
  validateRequest(getRecommendationsSchema, "query"),
  getRecommendations,
);

// upcoming events
router.get(
  "/upcoming",
  requireAuth,
  validateRequest(getUpcomingEventsSchema, "query"),
  getUpcomingEvents,
);

// single event (slug param)
router.get("/:slug", validateRequest(getEventSchema, "params"), getEvent);

export default router;
