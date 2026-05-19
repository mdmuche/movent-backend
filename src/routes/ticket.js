import express from "express";
import { verifyToken } from "../middlewares/verifyAuth.js";
import { getMyTickets } from "../controllers/tickets/getMyTickets.js";
import { purchaseTicket } from "../controllers/tickets/purchaseTicket.js";

const router = express.Router();

// Define the route for tickets
router.get("/my-tickets", verifyToken, getMyTickets);

router.post("/purchase", verifyToken, purchaseTicket);

export default router;
