// import third-party modules
import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import httpStatus from "http-status";

// Import custom modules
import { connectDB } from "./config/connection.config.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { swaggerSpec } from "./config/swagger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

//create an instance of express server object:
const app = express();

app.use(express.json());

app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL_LOCAL,
  process.env.FRONTEND_URL_MAIN,
  process.env.FRONTEND_TEST_URL,
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// auth routes for handling auth-related requests
app.use("/v1/auth", authRoutes);

// user routes for handling user-related requests
app.use("/v1/user", userRoutes);

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).send("Sorry, that route doesn't exist.");
  next();
});

app.get("/", function (req, res) {
  res.send("Welcome to Movent API!");
});

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
