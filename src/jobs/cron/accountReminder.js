import cron from "node-cron";
import User from "../../models/user.js";
import { sendEmail } from "../../utils/email/sendEmail.js";
import { accountDeletionWarningTemplate } from "../../utils/email/templates/accountDeletionWarning.js";

cron.schedule("0 9 * * *", async () => {
  try {
    const now = new Date();

    const users = await User.find({
      accountStatus: "closed",
      closedAt: { $ne: null },
    });

    for (const user of users) {
      const daysClosed =
        (now - new Date(user.closedAt)) / (1000 * 60 * 60 * 24);

      let message = null;

      // 150 days (30 days left)
      if (daysClosed >= 150 && daysClosed < 151) {
        message = accountDeletionWarningTemplate(user.fullName, 30);
      }

      // 173 days (7 days left)
      if (daysClosed >= 173 && daysClosed < 174) {
        message = accountDeletionWarningTemplate(user.fullName, 7);
      }

      // 179 days (1 day left)
      if (daysClosed >= 179 && daysClosed < 180) {
        message = accountDeletionWarningTemplate(user.fullName, 30);
      }

      if (message) {
        await sendEmail(user.email, "Account Deletion Notice", message);
      }
    }
  } catch (error) {
    console.error("Reminder cron failed:", error.message);
  }
});
