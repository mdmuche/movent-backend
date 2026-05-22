import express from "express";

import { validateRequest } from "../middlewares/validateRequest.js";

import { verifyToken } from "../middlewares/verifyAuth.js";
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";

import upload from "../config/multer.js";

// controllers
import { getProfile } from "../controllers/user/profile.js";
import { getDashboardOverview } from "../controllers/user/getDashboardOverview.js";
import { getSavedEvents } from "../controllers/user/getSavedEvents.js";
import { getUserActivity } from "../controllers/user/userActivity.js";
import { saveEvent } from "../controllers/user/saveEvent.js";
import { deleteSavedEvent } from "../controllers/user/deleteSavedEvent.js";
import { updateProfile } from "../controllers/user/updateProfile.js";
import { updateNotificationPreferences } from "../controllers/user/notificationPreference.js";
import { updateLanguage } from "../controllers/user/updateLanguage.js";
import { closeAccount } from "../controllers/user/closeAccount.js";
import { updateProfilePicture } from "../controllers/user/updateProfilePicture.js";

// validators
import { saveEventSchema } from "../validators/user/saveEvent.js";
import { deleteSavedEventSchema } from "../validators/user/deleteSavedEvent.js";
import { updateProfileSchema } from "../validators/user/updateProfile.js";
import { updateLanguageSchema } from "../validators/user/updateLanguage.js";
import { closeAccountSchema } from "../validators/user/closeAccount.js";
import { updateNotificationPreferencesSchema } from "../validators/user/notificationPreference.js";
import { getSavedEventsSchema } from "../validators/user/getSavedEvents.js";
import { getUserActivitySchema } from "../validators/user/getUserActivity.js";
import { getDashboardOverviewSchema } from "../validators/user/getDashboardOverview.js";

const router = express.Router();

// profile
router.get("/profile", verifyToken, checkAccountStatus, getProfile);

// dashboard
router.get(
  "/dashboard",
  verifyToken,
  checkAccountStatus,
  validateRequest(getDashboardOverviewSchema),
  getDashboardOverview,
);

// save event
router.post(
  "/saved-events/:eventId",
  verifyToken,
  checkAccountStatus,
  validateRequest(saveEventSchema),
  saveEvent,
);

// saved events list
router.get(
  "/saved-events",
  verifyToken,
  checkAccountStatus,
  validateRequest(getSavedEventsSchema),
  getSavedEvents,
);

// activity
router.get(
  "/activity",
  verifyToken,
  checkAccountStatus,
  validateRequest(getUserActivitySchema),
  getUserActivity,
);

// update profile
router.patch(
  "/profile",
  verifyToken,
  checkAccountStatus,
  validateRequest(updateProfileSchema),
  updateProfile,
);

// profile picture
router.patch(
  "/profile/picture",
  verifyToken,
  checkAccountStatus,
  upload.single("profilePicture"),
  updateProfilePicture,
);

// notifications
router.patch(
  "/preferences/notifications",
  verifyToken,
  checkAccountStatus,
  validateRequest(updateNotificationPreferencesSchema),
  updateNotificationPreferences,
);

// language
router.patch(
  "/preferences/language",
  verifyToken,
  checkAccountStatus,
  validateRequest(updateLanguageSchema),
  updateLanguage,
);

// close account
router.delete(
  "/account",
  verifyToken,
  checkAccountStatus,
  validateRequest(closeAccountSchema),
  closeAccount,
);

// delete saved event
router.delete(
  "/saved-events/:eventId",
  verifyToken,
  checkAccountStatus,
  validateRequest(deleteSavedEventSchema),
  deleteSavedEvent,
);

export default router;
