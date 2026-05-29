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
      const daysClosed = Math.floor(
        (now - new Date(user.closedAt)) / (1000 * 60 * 60 * 24),
      );

      let emailTemplate = null;
      let daysLeft = null;

      if (daysClosed >= 150 && daysClosed < 151) {
        daysLeft = 30;
      }

      if (daysClosed >= 173 && daysClosed < 174) {
        daysLeft = 7;
      }

      if (daysClosed >= 179 && daysClosed < 180) {
        daysLeft = 1;
      }

      if (daysLeft) {
        emailTemplate = accountDeletionWarningTemplate(user.fullName, daysLeft);

        await sendEmail(user.email, "Account Deletion Notice", emailTemplate);
      }
    }
  } catch (error) {
    console.error("Reminder cron failed:", error.message);
  }
});
