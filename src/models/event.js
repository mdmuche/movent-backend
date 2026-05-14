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
        "tech",
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

    ticket: {
      type: {
        type: String,
        enum: ["regular", "vip", "vvip"],
        default: "regular",
      },

      price: {
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
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    bannerImage: {
      public_id: String,
      secure_url: String,
    },

    tags: [String],

    status: {
      type: String,
      enum: ["draft", "upcoming", "ongoing", "completed", "cancelled"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
