import express from "express";

import { getEvent } from "../controllers/events/getEvent.js";
import { getAllEvents } from "../controllers/events/getAllEvents.js";
import { getRecommendations } from "../controllers/events/getRecommendations.js";
import { getTrendingEvents } from "../controllers/events/getTrendingEvents.js";
import { getUpcomingEvents } from "../controllers/events/getUpcommingEvents.js";

const router = express.Router();

router.get("/events", getAllEvents);
router.get("/events/trending", getTrendingEvents);
router.get("/events/recommendations", getRecommendations);
router.get("/events/:slug", getEvent);
router.get("/events/upcoming", getUpcomingEvents);

export default router;
