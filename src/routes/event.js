import express from "express";

import { getEvent } from "../controllers/events/getEvent.js";
import { getAllEvents } from "../controllers/events/getAllEvents.js";
import { getRecommendations } from "../controllers/events/getRecommendations.js";
import { getTrendingEvents } from "../controllers/events/getTrendingEvents.js";
import { getUpcomingEvents } from "../controllers/events/getUpcommingEvents.js";

import { validateRequest } from "../middlewares/validateRequest.js";

import { getAllEventsSchema } from "../validators/events/getAllEvents.js";
import { getRecommendationsSchema } from "../validators/events/getRecommendations.js";
import { getTrendingEventsSchema } from "../validators/events/getTrendingEvents.js";
import { getUpcomingEventsSchema } from "../validators/events/getUpcomingEvents.js";

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
  validateRequest(getRecommendationsSchema, "query"),
  getRecommendations,
);

// single event (slug param)
router.get("/:slug", getEvent);

// upcoming events
router.get(
  "/upcoming",
  validateRequest(getUpcomingEventsSchema, "query"),
  getUpcomingEvents,
);

export default router;
