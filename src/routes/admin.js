import express from "express";

import { requireAdmin } from "../middlewares/authFlow.js";

import { getPlatformOverview } from "../controllers/admin/getPlatformOverview.js";
import { getEventQueue } from "../controllers/admin/getEventQueue.js";
import { getAllUsers } from "../controllers/admin/getAllUsers.js";
import { getSystemSettings } from "../controllers/admin/getSystemSettings.js";
import { updateSystemSettings } from "../controllers/admin/updateSystemSettings.js";
import { getAuditLogs } from "../controllers/admin/getAuditLogs.js";
import { makeOrganizer } from "../controllers/admin/makeOrganizer.js";
import { flagUser } from "../controllers/admin/flagUser.js";
import { suspendUser } from "../controllers/admin/suspendUser.js";
import { exportReports } from "../controllers/admin/exportReport.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { getAllUsersSchema } from "../validators/admin/getAllUsers.js";
import { getAuditLogsSchema } from "../validators/admin/getAuditLogs.js";
import { exportReportsSchema } from "../validators/admin/exportReport.js";
import { makeOrganizerSchema } from "../validators/admin/makeOrganizer.js";
import { flagUserSchema } from "../validators/admin/flagUser.js";
import {
  suspendUserBodySchema,
  suspendUserSchema,
} from "../validators/admin/suspendUser.js";
import { updateSystemSettingsSchema } from "../validators/admin/updateSystemSettings.js";
import { getEventQueueSchema } from "../validators/admin/getEventQueue.js";

const router = express.Router();

// Admin routes for handling admin-related requests
router.get("/overview", requireAdmin, getPlatformOverview);

// route to get pending events for admin review
router.get(
  "/event-queue",
  requireAdmin,
  validateRequest(getEventQueueSchema, "query"),
  getEventQueue,
);

// route to get all users (for admin)
router.get(
  "/",
  requireAdmin,
  validateRequest(getAllUsersSchema, "query"),
  getAllUsers,
);

// route to get system settings
router.get("/settings", requireAdmin, getSystemSettings);

// route to get audit logs
router.get(
  "/audit-logs",
  requireAdmin,
  validateRequest(getAuditLogsSchema, "query"),
  getAuditLogs,
);

// route to export reports
router.get(
  "/reports/export",
  requireAdmin,
  validateRequest(exportReportsSchema, "query"),
  exportReports,
);
// route to make a user an organizer
router.patch(
  "/users/:id/make-organizer",
  requireAdmin,
  validateRequest(makeOrganizerSchema, "params"),
  makeOrganizer,
);

// route to flag a user
router.patch(
  "/users/:userId/flag",
  requireAdmin,
  validateRequest(flagUserSchema, "params"),
  flagUser,
);

// route to suspend a user
router.patch(
  "/users/:userId/suspend",
  requireAdmin,
  validateRequest(suspendUserSchema, "params"),
  validateRequest(suspendUserBodySchema),
  suspendUser,
);

// route to update system settings
router.patch(
  "/settings",
  requireAdmin,
  validateRequest(updateSystemSettingsSchema),
  updateSystemSettings,
);

export default router;
