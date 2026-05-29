import cron from "node-cron";

import TicketCollection from "../../models/ticket.js";
import Event from "../../models/event.js";

import { sendNotification } from "../../services/notification.service.js";

// Runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  try {
    const now = new Date();

    // Get upcoming events in next 7 days
    const upcomingEvents = await Event.find({
      startDate: {
        $gte: now,
        $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      status: "upcoming",
      approvalStatus: "approved",
    });

    for (const event of upcomingEvents) {
      const tickets = await TicketCollection.find({
        event: event._id,
      });

      if (!tickets.length) continue;

      for (const ticket of tickets) {
        const eventDate = new Date(event.startDate);
        const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

        let title = null;
        let message = null;

        // 7 days reminder
        if (diffDays === 7) {
          title = "Event Reminder ⏰";
          message = `"${event.title}" is happening in 7 days. Get ready!`;
        }

        // 1 day reminder
        if (diffDays === 1) {
          title = "Tomorrow's Event 🔥";
          message = `"${event.title}" is happening tomorrow! Don't miss it.`;
        }

        // same day reminder
        if (diffDays === 0) {
          title = "Event Today 🎉";
          message = `"${event.title}" is happening today! See you there.`;
        }

        if (title && message) {
          await sendNotification({
            user: ticket.user,
            title,
            message,
            type: "info",
            metadata: {
              eventId: event._id,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Event reminder cron failed:", error.message);
  }
});
