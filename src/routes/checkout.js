import express from "express";

import { verifyToken } from "../middlewares/verifyAuth.js";
import { initiateCheckout } from "../controllers/checkout/innitiateCheckout.js";
import { verifyPayment } from "../controllers/checkout/verifyPayment.js";
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";
import { applyPromoCode } from "../controllers/checkout/applyPromoCode.js";
import { rolesAllowed } from "../middlewares/roleBased.js";
import { refundPayment } from "../controllers/checkout/refundPayment.js";
import { webhook } from "../controllers/checkout/webhook.js";
import { getPaymentHistory } from "../controllers/checkout/getPaymentHistory.js";
import { getPaymentDetails } from "../controllers/checkout/getPaymentDetails.js";
import { cancelCheckout } from "../controllers/checkout/cancelCheckout.js";
import { resendTicket } from "../controllers/checkout/resendTicket.js";
import { validateTicket } from "../controllers/checkout/validateTicket.js";

const router = express.Router();

router.post("/initiate", verifyToken, checkAccountStatus, initiateCheckout);

router.get(
  "/verify/:reference",
  verifyToken,
  checkAccountStatus,
  verifyPayment,
);
router.post(
  "/checkout/promo/apply",
  verifyToken,
  checkAccountStatus,
  applyPromoCode,
);

router.post(
  "/checkout/refund/:ticketId",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  refundPayment,
);

router.post("/checkout/webhook", webhook);

router.get(
  "/checkout/history",
  verifyToken,
  checkAccountStatus,
  getPaymentHistory,
);

router.get(
  "/checkout/:reference",
  verifyToken,
  checkAccountStatus,
  getPaymentDetails,
);

router.patch(
  "/checkout/cancel/:reference",
  verifyToken,
  checkAccountStatus,
  cancelCheckout,
);

router.post(
  "/checkout/resend-ticket/:ticketId",
  verifyToken,
  checkAccountStatus,
  resendTicket,
);

router.post(
  "/checkout/validate-ticket/:ticketId",
  verifyToken,
  checkAccountStatus,
  validateTicket,
);
export default router;
