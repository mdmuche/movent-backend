import cron from "node-cron";
import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:5001";

cron.schedule("*/5 * * * *", async () => {
  try {
    const res = await axios.get(`${BASE_URL}/v1/ping`);

    console.log("🔄 Keep-alive ping sent:", res.data.time);
  } catch (error) {
    console.error("❌ Ping failed:", error.message);
  }
});
