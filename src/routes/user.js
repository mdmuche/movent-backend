import express from "express";
import { verifyToken } from "../middlewares/verifyAuth.js";
import { getProfile } from "../controllers/user/profile.js";
import { getDashboardOverview } from "../controllers/user/getDashboardOverview.js";
import { getSavedEvents } from "../controllers/user/getSavedEvents.js";

const router = express.Router();

// Define the route for user
router.get("/profile", verifyToken, getProfile);
router.get("/", verifyToken, getDashboardOverview);
router.get("/saved-events", verifyToken, getSavedEvents);

export default router;
