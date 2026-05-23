import express from "express";

// import { subscribeNewsletter } from "../controllers/newsletter/subscribeNewsletter.js";
import { unsubscribeNewsletter } from "../controllers/newsletter/unsubscribeNewsletter.js";
import { getSubscribers } from "../controllers/newsletter/getSubscribers.js";

import { validateRequest } from "../middlewares/validateRequest.js";
import { verifyToken } from "../middlewares/verifyAuth.js";
import { rolesAllowed } from "../middlewares/roleBased.js";
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";

// import { subscribeNewsletterSchema } from "../validators/newsletter/subscribeNewsletter.js";
import { unsubscribeNewsletterSchema } from "../validators/newsletter/unsubscribeNewsletter.js";
import { getSubscribersSchema } from "../validators/newsletter/getSubscribers.js";

const router = express.Router();

// subscribe user to newsletter
// router.post(
//   "/subscribe",
//   validateRequest(subscribeNewsletterSchema),
//   subscribeNewsletter,
// );

// unsubscribe user from newsletter
router.post(
  "/unsubscribe",
  validateRequest(unsubscribeNewsletterSchema),
  unsubscribeNewsletter,
);

// get all newsletter subscribers (admin only)
router.get(
  "/subscribers",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  validateRequest(getSubscribersSchema, "query"),
  getSubscribers,
);

export default router;
