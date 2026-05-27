import dotenv from "dotenv";
dotenv.config();

const { connectDB } = await import("./config/connection.js");
const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, function () {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
