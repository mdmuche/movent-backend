import express from "express";

import { validateRequest } from "../middlewares/validateRequest.js";

import { requireAuth } from "../middlewares/authFlow.js";

import upload from "../config/multer.js";

// controllers
import { getProfile } from "../controllers/user/profile.js";
import { getDashboardOverview } from "../controllers/user/getDashboardOverview.js";
import { getSavedEvents } from "../controllers/user/getSavedEvents.js";
import { getUserActivity } from "../controllers/user/userActivity.js";
import { toggleSaveEvent } from "../controllers/user/toggleSaveEvent.js";
import { updateProfile } from "../controllers/user/updateProfile.js";
import { updateNotificationPreferences } from "../controllers/user/notificationPreference.js";
import { updateLanguage } from "../controllers/user/updateLanguage.js";
import { closeAccount } from "../controllers/user/closeAccount.js";
import { updateProfilePicture } from "../controllers/user/updateProfilePicture.js";

// validators
import { toggleSaveEventSchema } from "../validators/user/toggleSaveEvent.js";

import { updateProfileSchema } from "../validators/user/updateProfile.js";
import { updateLanguageSchema } from "../validators/user/updateLanguage.js";
import { closeAccountSchema } from "../validators/user/closeAccount.js";
import { updateNotificationPreferencesSchema } from "../validators/user/notificationPreference.js";
import { getSavedEventsSchema } from "../validators/user/getSavedEvents.js";
import { getUserActivitySchema } from "../validators/user/getUserActivity.js";
import { getDashboardOverviewSchema } from "../validators/user/getDashboardOverview.js";

const router = express.Router();

// profile
router.get("/profile", requireAuth, getProfile);

// dashboard
router.get(
  "/dashboard",
  requireAuth,
  validateRequest(getDashboardOverviewSchema, "query"),
  getDashboardOverview,
);

// save event
router.post(
  "/saved-events/:eventId",
  requireAuth,
  validateRequest(toggleSaveEventSchema, "params"),
  toggleSaveEvent,
);

// saved events list
router.get(
  "/saved-events",
  requireAuth,
  validateRequest(getSavedEventsSchema, "query"),
  getSavedEvents,
);

// activity
router.get(
  "/activity",
  requireAuth,
  validateRequest(getUserActivitySchema, "query"),
  getUserActivity,
);

// update profile
router.patch(
  "/profile",
  requireAuth,
  validateRequest(updateProfileSchema),
  updateProfile,
);

// profile picture
router.patch(
  "/profile/picture",
  requireAuth,
  upload.single("profilePicture"),
  updateProfilePicture,
);

// notifications
router.patch(
  "/notification/preferences",
  requireAuth,
  validateRequest(updateNotificationPreferencesSchema),
  updateNotificationPreferences,
);

// language
router.patch(
  "/language/preference",
  requireAuth,
  validateRequest(updateLanguageSchema),
  updateLanguage,
);

// close account
router.delete(
  "/account",
  requireAuth,
  validateRequest(closeAccountSchema),
  closeAccount,
);

export default router;
