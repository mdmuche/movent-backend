import express from "express";

import { verifyToken } from "../middlewares/verifyAuth.js";
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import { getMyTickets } from "../controllers/tickets/getMyTickets.js";
import { purchaseTicket } from "../controllers/tickets/purchaseTicket.js";

import { getMyTicketsSchema } from "../validators/tickets/getMyTickets.js";
import { purchaseTicketSchema } from "../validators/tickets/purchaseTicket.js";

const router = express.Router();

// get user tickets
router.get(
  "/my-tickets",
  verifyToken,
  checkAccountStatus,
  validateRequest(getMyTicketsSchema, "query"),
  getMyTickets,
);

// purchase ticket
router.post(
  "/purchase",
  verifyToken,
  checkAccountStatus,
  validateRequest(purchaseTicketSchema),
  purchaseTicket,
);

export default router;
