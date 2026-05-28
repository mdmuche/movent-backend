import cron from "node-cron";
import User from "../../models/user.js";
// import logger from "../../utils/logger.js";

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 180); // 6 months

    // STEP 1: Mark old closed accounts as deleted
    const marked = await User.updateMany(
      {
        accountStatus: "closed",
        closedAt: { $lte: cutoffDate },
      },
      {
        $set: {
          accountStatus: "deleted",
          deletedAt: new Date(),
        },
      },
    );

    // STEP 2: Permanently delete after marking
    const deleted = await User.deleteMany({
      accountStatus: "deleted",
      deletedAt: { $lte: cutoffDate },
    });

    console.log(deleted, marked);

    // logger.info("User cleanup job completed", {
    //   markedClosed: marked.modifiedCount,
    //   permanentlyDeleted: deleted.deletedCount,
    // });
  } catch (error) {
    // logger.error("User cleanup cron failed", {
    //   error: error.message,
    // });
    console.log(error);
  }
});
