import express from "express";

import { verifyToken } from "../middlewares/verifyAuth.js";
import { rolesAllowed } from "../middlewares/roleBased.js";

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
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";

const router = express.Router();

// Admin routes for handling admin-related requests
router.get(
  "/overview",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  getPlatformOverview,
);

// route to get pending events for admin review
router.get(
  "/event-queue",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  getEventQueue,
);

// route to get all users (for admin)
router.get(
  "/users",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  getAllUsers,
);

// route to get system settings
router.get(
  "/settings",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  getSystemSettings,
);

// route to get audit logs
router.get(
  "/audit-logs",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  getAuditLogs,
);

// route to export reports
router.get(
  "/reports/export",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  exportReports,
);
// route to make a user an organizer
router.patch(
  "/users/:id/make-organizer",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  makeOrganizer,
);

// route to flag a user
router.patch(
  "/users/:userId/flag",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  flagUser,
);

// route to suspend a user
router.patch(
  "/users/:userId/suspend",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  suspendUser,
);

// route to update system settings
router.patch(
  "/settings",
  verifyToken,
  checkAccountStatus,
  rolesAllowed("admin"),
  updateSystemSettings,
);

export default router;
