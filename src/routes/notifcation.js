import express from "express";

import { createNotification } from "../controllers/notifications/createNotification.js";
import { deleteNotification } from "../controllers/notifications/deleteNotification.js";
import { markAllAsRead } from "../controllers/notifications/markAllAsRead.js";
import { getNotifications } from "../controllers/notifications/getNotifications.js";
import { getUnreadCount } from "../controllers/notifications/getUnreadCount.js";
import { markAsRead } from "../controllers/notifications/markAsRead.js";
import { verifyToken } from "../middlewares/verifyAuth.js";
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";
import { rolesAllowed } from "../middlewares/roleBased.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  createNotification,
);

router.get("/", verifyToken, checkAccountStatus, getNotifications);

router.get("/unread-count", verifyToken, checkAccountStatus, getUnreadCount);

router.patch(
  "/:notificationId/read",
  verifyToken,
  checkAccountStatus,
  markAsRead,
);

router.patch("/mark-all-read", verifyToken, checkAccountStatus, markAllAsRead);

router.delete(
  "/:notificationId",
  verifyToken,
  checkAccountStatus,
  deleteNotification,
);

export default router;
