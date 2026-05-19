// import third-party modules
import express from "express";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import httpStatus from "http-status";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import custom modules
import { connectDB } from "./config/connection.js";
import authRouter from "./routes/auth..js";
import userRouter from "./routes/user.js";
import eventRouter from "./routes/event.js";
import ticketRouter from "./routes/ticket.js";
import organizerRouter from "./routes/organizer.js";
import adminRouter from "./routes/admin.js";
import { swaggerSpec } from "./config/swagger.js";
import { generalLimiter } from "./middlewares/rateLimit.js";

const PORT = process.env.PORT || 5000;

//create an instance of express server object:
const app = express();
// In production, trust the first proxy (e.g., Vercel) to get correct client IP and handle secure cookies
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL_LOCAL,
  process.env.FRONTEND_URL_MAIN,
  process.env.FRONTEND_TEST_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

app.use(generalLimiter);

// Swagger UI setup (only in non-production environments)
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// routes
// auth routes for handling auth-related requests
app.use("/v1/auth", authRouter);

// user routes for handling user-related requests
app.use("/v1/user", userRouter);

// event routes for handling event-related requests
app.use("/v1/event", eventRouter);

// ticket routes for handling ticket-related requests
app.use("/v1/ticket", ticketRouter);

// organizer routes for handling organizer-related requests
app.use("/v1/organizer", organizerRouter);

// admin routes for handling admin-related requests
app.use("/v1/admin", adminRouter);

app.get("/", function (req, res) {
  res.send("Welcome to Movent API!");
});

app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Sorry that route does not exist.",
  });
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
