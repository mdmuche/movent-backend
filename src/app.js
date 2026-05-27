// import third-party modules
import express from "express";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import custom modules
import apiRouter from "./routes/index.js";
import { swaggerSpec } from "./config/swagger.js";
import { generalLimiter } from "./middlewares/rateLimit.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

//create an instance of express server object:
const app = express();
// In production, trust the first proxy (e.g., Vercel) to get correct client IP and handle secure cookies
app.set("trust proxy", 1);

const jsonParser = express.json();
const webhookPath = "/v1/checkout/webhook";

app.use((req, res, next) => {
  if (req.originalUrl === webhookPath) {
    return next();
  }

  return jsonParser(req, res, next);
});

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

app.use("/v1", apiRouter);

app.get("/", function (req, res) {
  res.send("Welcome to Movent API!");
});

app.use(notFound);
app.use(errorHandler);

export default app;
