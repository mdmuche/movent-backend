import express from "express";
import { verifyToken } from "../middlewares/verifyAuth.js";
import { getMyTickets } from "../controllers/tickets/getMyTickets.js";
import { getUpcomingEvents } from "../controllers/tickets/getUpcommingEvents.js";

const router = express.Router();

// Define the route for tickets
router.get("/my-tickets", verifyToken, getMyTickets);
router.get("/upcoming-events", verifyToken, getUpcomingEvents);

export default router;
