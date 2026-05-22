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
import { validateRequest } from "../middlewares/validateRequest.js";

// validations
import { createNotificationSchema } from "../validators/notifications/createNotification.js";
import { deleteNotificationSchema } from "../validators/notifications/deleteNotification.js";
import { markAsReadSchema } from "../validators/notifications/markAsRead.js";
import { getNotificationsSchema } from "../validators/notifications/getNotifications.js";

const router = express.Router();

// create notification (admin only)
router.post(
  "/",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  validateRequest(createNotificationSchema),
  createNotification,
);

// get user notifications
router.get(
  "/",
  verifyToken,
  checkAccountStatus,
  validateRequest(getNotificationsSchema, "query"),
  getNotifications,
);

// unread count
router.get("/unread-count", verifyToken, checkAccountStatus, getUnreadCount);

// mark single notification as read
router.patch(
  "/:notificationId/read",
  verifyToken,
  checkAccountStatus,
  validateRequest(markAsReadSchema, "params"),
  markAsRead,
);

// mark all as read
router.patch("/mark-all-read", verifyToken, checkAccountStatus, markAllAsRead);

// delete notification
router.delete(
  "/:notificationId",
  verifyToken,
  checkAccountStatus,
  validateRequest(deleteNotificationSchema, "params"),
  deleteNotification,
);

export default router;
