import express from "express";
import { verifyToken } from "../middlewares/verifyAuth.js";
import { getMyTickets } from "../controllers/tickets/getMyTickets.js";
import { purchaseTicket } from "../controllers/tickets/purchaseTicket.js";
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";

const router = express.Router();

// Define the route for tickets
router.get("/my-tickets", verifyToken, checkAccountStatus, getMyTickets);

router.post("/purchase", verifyToken, checkAccountStatus, purchaseTicket);

export default router;
