import express from "express";

import { requireAuth } from "../middlewares/authFlow.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import { getMyTickets } from "../controllers/tickets/getMyTickets.js";
import { purchaseTicket } from "../controllers/tickets/purchaseTicket.js";
import { cancelTicket } from "../controllers/checkout/cancelTicket.js";

import { getMyTicketsSchema } from "../validators/tickets/getMyTickets.js";
import { purchaseTicketSchema } from "../validators/tickets/purchaseTicket.js";
import { cancelTicketSchema } from "../validators/tickets/cancelTicket.js";

const router = express.Router();

// get user tickets
router.get(
  "/my-tickets",
  requireAuth,
  validateRequest(getMyTicketsSchema, "query"),
  getMyTickets,
);

// purchase ticket
router.post(
  "/:slug/purchase",
  requireAuth,
  validateRequest(purchaseTicketSchema),
  purchaseTicket,
);

// Cancel Ticket
router.patch(
  "/cancel/:ticketId",
  requireAuth,
  validateRequest(cancelTicketSchema, "params"),
  cancelTicket,
);
export default router;
