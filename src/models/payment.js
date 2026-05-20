import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    promoCode: {
      type: String,
    },

    billingInfo: {
      fullName: String,
      email: String,
      streetAddress: String,
    },

    paidAt: Date,
    refundedAt: Date,
  },
  { timestamps: true },
);

const PaymentCollection = mongoose.model("Payment", paymentSchema);

export default PaymentCollection;
