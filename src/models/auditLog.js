import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    targetType: {
      type: String,
      enum: ["user", "event", "ticket", "settings"],
    },

    targetId: mongoose.Schema.Types.ObjectId,

    metadata: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
