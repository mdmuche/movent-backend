import express from "express";

import { createNotification } from "../controllers/notifications/createNotification.js";
import { deleteNotification } from "../controllers/notifications/deleteNotification.js";
import { markAllAsRead } from "../controllers/notifications/markAllAsRead.js";
import { getNotifications } from "../controllers/notifications/getNotifications.js";
import { getUnreadCount } from "../controllers/notifications/getUnreadCount.js";
import { markAsRead } from "../controllers/notifications/markAsRead.js";

import { requireAdmin, requireAuth } from "../middlewares/authFlow.js";
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
  requireAdmin,
  validateRequest(createNotificationSchema),
  createNotification,
);

// get user notifications
router.get(
  "/",
  requireAuth,
  validateRequest(getNotificationsSchema, "query"),
  getNotifications,
);

// unread count
router.get("/unread-count", requireAuth, getUnreadCount);

// mark single notification as read
router.patch(
  "/:notificationId/read",
  requireAuth,
  validateRequest(markAsReadSchema, "params"),
  markAsRead,
);

// mark all as read
router.patch("/mark-all-read", requireAuth, markAllAsRead);

// delete notification
router.delete(
  "/:notificationId",
  requireAuth,
  validateRequest(deleteNotificationSchema, "params"),
  deleteNotification,
);

export default router;
