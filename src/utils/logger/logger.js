import winston from "winston";

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),

    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),

  transports: [
    // Save all logs
    new winston.transports.File({
      filename: "logs/combined.log",
    }),

    // Save only errors
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Show logs in console
    new winston.transports.Console(),
  ],
});

export default logger;
