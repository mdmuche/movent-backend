import express from "express";

import adminRouter from "./admin.js";
import authRouter from "./auth.js";
import checkoutRouter from "./checkout.js";
import eventRouter from "./event.js";
import newsletterRouter from "./newsletter.js";
import notificationRouter from "./notification.js";
import organizerRouter from "./organizer.js";
import ticketRouter from "./ticket.js";
import userRouter from "./user.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/event", eventRouter);
router.use("/ticket", ticketRouter);
router.use("/organizer", organizerRouter);
router.use("/admin", adminRouter);
router.use("/checkout", checkoutRouter);
router.use("/newsletter", newsletterRouter);
router.use("/notification", notificationRouter);

export default router;
