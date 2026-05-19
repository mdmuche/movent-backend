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

const router = express.Router();

// Admin routes for handling admin-related requests
router.get(
  "/overview",
  verifyToken,
  rolesAllowed("admin"),
  getPlatformOverview,
);

// route to get pending events for admin review
router.get("/event-queue", verifyToken, rolesAllowed("admin"), getEventQueue);

// route to get all users (for admin)
router.get("/users", verifyToken, rolesAllowed("admin"), getAllUsers);

// route to get system settings
router.get("/settings", verifyToken, rolesAllowed("admin"), getSystemSettings);

// route to get audit logs
router.get("/audit-logs", verifyToken, rolesAllowed("admin"), getAuditLogs);

// route to make a user an organizer
router.patch(
  "/users/:id/make-organizer",
  verifyToken,
  rolesAllowed("admin"),
  makeOrganizer,
);

// route to flag a user
router.patch(
  "/users/:userId/flag",
  verifyToken,
  rolesAllowed("admin"),
  flagUser,
);

// route to suspend a user
router.patch(
  "/users/:userId/suspend",
  verifyToken,
  rolesAllowed("admin"),
  suspendUser,
);

// route to update system settings
router.patch(
  "/settings",
  verifyToken,
  rolesAllowed("admin"),
  updateSystemSettings,
);

export default router;
