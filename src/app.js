// import third-party modules
import express from "express";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Import custom modules

import monitor from "./middlewares/monitor.js";
import logger from "./utils/logger/logger.js";
import apiRouter from "./routes/index.js";
import healthRouter from "./routes/health.js";
import { swaggerSpec } from "./config/swagger.js";
import { generalLimiter } from "./middlewares/rateLimit.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

//create an instance of express server object:
const app = express();
// In production, trust the first proxy (e.g., Vercel) to get correct client IP and handle secure cookies
app.set("trust proxy", 1);
app.set("etag", false);

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
app.use(monitor);
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

const parseOriginList = (...values) =>
  values
    .flatMap((value) => (value || "").split(","))
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const withDomainVariants = (origins) => {
  const variants = new Set(origins);

  origins.forEach((origin) => {
    try {
      const url = new URL(origin);

      if (url.hostname.startsWith("www.")) {
        url.hostname = url.hostname.slice(4);
        variants.add(url.origin);
      } else {
        url.hostname = `www.${url.hostname}`;
        variants.add(url.origin);
      }
    } catch {
      // Ignore invalid env values; the raw value remains unusable for CORS.
    }
  });

  return variants;
};

const allowedOrigins = withDomainVariants(
  parseOriginList(
    process.env.FRONTEND_URL_LOCAL,
    process.env.FRONTEND_URL_MAIN,
    process.env.FRONTEND_TEST_URL,
  ),
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Cache-Control",
      "Pragma",
      "X-Requested-With",
    ],
    optionsSuccessStatus: 200,
  }),
);

// app.use(generalLimiter);

// Swagger UI setup (only in non-production environments)
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use("/v1", apiRouter);
app.use(healthRouter);

app.get("/", function (req, res) {
  res.send("Welcome to Movent API!");
});

app.use(notFound);
app.use(errorHandler);

export default app;
