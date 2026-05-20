import crypto from "crypto";

import PaymentCollection from "../../models/payment.js";
import TicketCollection from "../../models/ticket.js";
import Event from "../../models/event.js";

export const webhook = async (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      return res.sendStatus(401);
    }

    const event = req.body;

    // -----------------------------
    // ONLY HANDLE SUCCESS PAYMENT
    // -----------------------------
    if (event.event === "charge.success") {
      const paymentData = event.data;
      const reference = paymentData.reference;

      // -----------------------------
      // FIND PAYMENT
      // -----------------------------
      const payment = await PaymentCollection.findOne({ reference });

      if (!payment) {
        return res.sendStatus(200);
      }

      // -----------------------------
      // IDENTITY CHECK (PREVENT DOUBLE PROCESSING)
      // -----------------------------
      if (payment.status === "paid") {
        return res.sendStatus(200);
      }

      // -----------------------------
      // UPDATE PAYMENT
      // -----------------------------
      payment.status = "paid";
      payment.paidAt = new Date();

      await payment.save();

      // -----------------------------
      // GET EVENT
      // -----------------------------
      const eventDoc = await Event.findById(payment.event);

      if (eventDoc) {
        // -----------------------------
        // CREATE TICKET
        // -----------------------------
        await TicketCollection.create({
          user: payment.user,
          event: payment.event,
          quantity: payment.quantity,
          totalAmount: payment.amount,
          paymentStatus: "paid",
        });

        // -----------------------------
        // UPDATE SOLD TICKETS
        // -----------------------------
        eventDoc.soldTickets = (eventDoc.soldTickets || 0) + payment.quantity;

        await eventDoc.save();
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
