import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "ticket_purchase",
        "event_saved",
        "event_attended",
        "event_created",
        "profile_updated",
      ],
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;
