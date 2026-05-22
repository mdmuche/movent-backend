import express from "express";

import { verifyToken } from "../middlewares/verifyAuth.js";
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";
import { rolesAllowed } from "../middlewares/roleBased.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import { initiateCheckout } from "../controllers/checkout/innitiateCheckout.js";
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
  verifyToken,
  checkAccountStatus,
  validateRequest(initiateCheckoutSchema),
  initiateCheckout,
);

// Verify payment
router.get(
  "/verify/:reference",
  verifyToken,
  checkAccountStatus,
  validateRequest(verifyPaymentSchema, "params"),
  verifyPayment,
);

//  Apply promo code
router.post(
  "/checkout/promo/apply",
  verifyToken,
  checkAccountStatus,
  validateRequest(applyPromoCodeSchema),
  applyPromoCode,
);

// Refund payment (Admin only)

router.post(
  "/checkout/refund/:ticketId",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  validateRequest(refundPaymentSchema, "params"),
  refundPayment,
);

// Webhook (No auth / No validation)

router.post(
  "/checkout/webhook",
  express.raw({ type: "application/json" }),
  webhook,
);

// Payment History

router.get(
  "/checkout/history",
  verifyToken,
  checkAccountStatus,
  validateRequest(getPaymentHistorySchema, "query"),
  getPaymentHistory,
);

// Payment Details
router.get(
  "/checkout/:reference",
  verifyToken,
  checkAccountStatus,
  validateRequest(getPaymentDetailsSchema, "params"),
  getPaymentDetails,
);

// Cancel Checkout
router.patch(
  "/checkout/cancel/:reference",
  verifyToken,
  checkAccountStatus,
  validateRequest(cancelCheckoutSchema, "params"),
  cancelCheckout,
);

// Resent Ticket

router.post(
  "/checkout/resend-ticket/:ticketId",
  verifyToken,
  checkAccountStatus,
  validateRequest(resendTicketSchema, "params"),
  resendTicket,
);

// Validate Ticket

router.post(
  "/checkout/validate-ticket/:ticketId",
  verifyToken,
  checkAccountStatus,
  validateRequest(validateTicketSchema, "params"),
  validateTicket,
);

export default router;
