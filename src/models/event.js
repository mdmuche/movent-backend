import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "music",
        "technology",
        "business",
        "sports",
        "education",
        "fashion",
        "comedy",
        "gaming",
        "other",
      ],
      required: true,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
    },

    country: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
    },

    endTime: {
      type: String,
    },

    ticketType: {
      type: String,
      enum: ["regular", "vip", "vvip"],
      default: "regular",
    },

    ticketPrice: {
      type: Number,
      default: 0,
    },

    totalTickets: {
      type: Number,
      default: 0,
    },

    soldTickets: {
      type: Number,
      default: 0,
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    bannerImage: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },

    tags: [String],
    entryRequirements: {
      type: [String],
    },
    agreedToRefundPolicy: {
      type: Boolean,
      required: true,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "upcoming", "ongoing", "completed", "cancelled"],
      default: "draft",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        validate: {
          validator: (coordinates) => coordinates.length === 2,
          message: "Location coordinates must include longitude and latitude",
        },
      },
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

eventSchema.index({ location: "2dsphere" });
eventSchema.index({ category: 1 });
eventSchema.index({ city: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ approvalStatus: 1 });
const Event = mongoose.model("Event", eventSchema);

export default Event;
