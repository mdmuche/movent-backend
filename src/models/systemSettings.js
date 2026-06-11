import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    platformCommission: {
      type: Number,
      default: 10,
    },

    maxTicketPerPurchase: {
      type: Number,
      default: 10,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    supportEmail: {
      type: String,
      default: "support@movent.com",
    },
  },
  {
    timestamps: true,
  },
);

const SystemSettings = mongoose.model("SystemSetting", systemSettingsSchema);

export default SystemSettings;
