import express from "express";

import { verifyToken } from "../middlewares/verifyAuth.js";
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
import { checkAccountStatus } from "../middlewares/checkAccountStatus.js";
import { updateProfilePicture } from "../controllers/user/updateProfilePicture.js";
import upload from "../config/multer.js";

const router = express.Router();

// routes for user
// route to get user profile
router.get("/profile", verifyToken, checkAccountStatus, getProfile);

// route to get dashboard overview
router.get("/dashboard", verifyToken, checkAccountStatus, getDashboardOverview);

// route to save an event
router.post(
  "/saved-events/:eventId",
  verifyToken,
  checkAccountStatus,
  saveEvent,
);

// route to get saved events
router.get("/saved-events", verifyToken, checkAccountStatus, getSavedEvents);

// route to get user activity
router.get("/activity", verifyToken, checkAccountStatus, getUserActivity);

// route to update user profile
router.patch("/profile", verifyToken, checkAccountStatus, updateProfile);

// route to update profile picture
router.patch(
  "/profile/picture",
  verifyToken,
  checkAccountStatus,
  upload.single("profilePicture"),
  updateProfilePicture,
);

// route to update notification preferences
router.patch(
  "/preferences/notifications",
  verifyToken,
  checkAccountStatus,
  updateNotificationPreferences,
);

// route to update language preference
router.patch(
  "/preferences/language",
  verifyToken,
  checkAccountStatus,
  updateLanguage,
);

// route to close account
router.delete("/account", verifyToken, checkAccountStatus, closeAccount);

// route to delete a saved event
router.delete(
  "/saved-events/:eventId",
  verifyToken,
  checkAccountStatus,
  deleteSavedEvent,
);

export default router;
