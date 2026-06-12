import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    reference: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    ticketType: {
      type: String,
      enum: ["regular", "vip"],
      default: "regular",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "used"],
      default: "active",
    },

    checkedInAt: {
      type: Date,
    },

    ticketCode: {
      type: String,
      unique: true,
    },

    attended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const TicketCollection = mongoose.model("Ticket", ticketSchema);

export default TicketCollection;
