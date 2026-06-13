import express from "express";

import { getEventCategories } from "../controllers/events/categories.js";
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
import { getEventCategoriesSchema } from "../validators/events/getEventCategories.js";

import { noCache } from "../middlewares/noCache.js";

const router = express.Router();

// event categories
router.get(
  "/categories",
  noCache,
  validateRequest(getEventCategoriesSchema, "query"),
  getEventCategories,
);

// GET all events
router.get(
  "/",
  noCache,
  validateRequest(getAllEventsSchema, "query"),
  getAllEvents,
);

// trending events
router.get(
  "/trending",
  noCache,
  validateRequest(getTrendingEventsSchema, "query"),
  getTrendingEvents,
);

// recommendations
router.get(
  "/recommendations",
  noCache,
  requireAuth,
  validateRequest(getRecommendationsSchema, "query"),
  getRecommendations,
);

// upcoming events
router.get(
  "/upcoming",
  noCache,
  requireAuth,
  validateRequest(getUpcomingEventsSchema, "query"),
  getUpcomingEvents,
);

// single event (slug param)
router.get(
  "/:slug",
  noCache,
  validateRequest(getEventSchema, "params"),
  getEvent,
);

export default router;
