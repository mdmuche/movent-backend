import express from "express";

import { subscribeNewsletter } from "../controllers/newsletter/subscribeNewsletter.js";
import { unsubscribeNewsletter } from "../controllers/newsletter/unsubscribeNewsletter.js";
import { getSubscribers } from "../controllers/newsletter/getSubscribers.js";

import { verifyToken } from "../middlewares/verifyAuth.js";
import { rolesAllowed } from "../middlewares/roleBased.js";
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);

router.post("/unsubscribe", unsubscribeNewsletter);

router.get(
  "/subscribers",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  getSubscribers,
);

export default router;
