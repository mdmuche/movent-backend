import express from "express";

import {
  requireAdmin,
  requireAuth,
  requireOrganizer,
} from "../middlewares/authFlow.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import { initiateCheckout } from "../controllers/checkout/initiateCheckout.js";
import { verifyPayment } from "../controllers/checkout/verifyPayment.js";
import { applyPromoCode } from "../controllers/checkout/applyPromoCode.js";
import { refundPayment } from "../controllers/checkout/refundPayment.js";
import { webhook } from "../controllers/checkout/webhook.js";
import { getPaymentHistory } from "../controllers/checkout/getPaymentHistory.js";
import { getPaymentDetails } from "../controllers/checkout/getPaymentDetails.js";
import { cancelCheckout } from "../controllers/checkout/cancelCheckout.js";
import { resendTicket } from "../controllers/checkout/resendTicket.js";
import { validateTicket } from "../controllers/checkout/validateTicket.js";

// validators
import { initiateCheckoutSchema } from "../validators/checkout/initiateCheckout.js";
import { verifyPaymentSchema } from "../validators/checkout/verifyPayment.js";
import { applyPromoCodeSchema } from "../validators/checkout/applyPromoCode.js";
import { refundPaymentSchema } from "../validators/checkout/refundPayment.js";
import { getPaymentHistorySchema } from "../validators/checkout/getPaymentHistory.js";
import { getPaymentDetailsSchema } from "../validators/checkout/getPaymentDetails.js";
import { cancelCheckoutSchema } from "../validators/checkout/cancelCheckout.js";
import { resendTicketSchema } from "../validators/checkout/resendTicket.js";
import { validateTicketSchema } from "../validators/checkout/validateTicket.js";

const router = express.Router();

// initiate checkout
router.post(
  "/initiate",
  requireAuth,
  validateRequest(initiateCheckoutSchema),
  initiateCheckout,
);

// Verify payment
router.get(
  "/verify/:reference",
  requireAuth,
  validateRequest(verifyPaymentSchema, "params"),
  verifyPayment,
);

//  Apply promo code
router.post(
  "/promo/apply",
  requireAuth,
  validateRequest(applyPromoCodeSchema),
  applyPromoCode,
);

// Refund payment (Admin only)

router.post(
  "/refund/:paymentId",
  requireAdmin,
  validateRequest(refundPaymentSchema, "params"),
  refundPayment,
);

// Webhook (No auth / No validation)

router.post("/webhook", express.raw({ type: "application/json" }), webhook);

// Payment History

router.get(
  "/history",
  requireAuth,
  validateRequest(getPaymentHistorySchema, "query"),
  getPaymentHistory,
);

// Payment Details
router.get(
  "/:reference",
  requireAuth,
  validateRequest(getPaymentDetailsSchema, "params"),
  getPaymentDetails,
);

// Cancel Checkout
router.patch(
  "/cancel/:reference",
  requireAuth,
  validateRequest(cancelCheckoutSchema, "params"),
  cancelCheckout,
);

// Resent Ticket

router.post(
  "/resend-ticket/:ticketId",
  requireAuth,
  validateRequest(resendTicketSchema, "params"),
  resendTicket,
);

// Validate Ticket

router.post(
  "/validate-ticket/:ticketId",
  requireOrganizer,
  validateRequest(validateTicketSchema, "params"),
  validateTicket,
);

export default router;
