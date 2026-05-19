import mongoose from "mongoose";

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    eventUpdates: {
      type: Boolean,
      default: true,
    },

    promotionalOffers: {
      type: Boolean,
      default: true,
    },

    securityAlerts: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const NotificationPreference = mongoose.model(
  "NotificationPreference",
  notificationPreferenceSchema,
);

export default NotificationPreference;
