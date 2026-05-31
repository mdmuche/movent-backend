import nodeMailer from "nodemailer";

const smtpPort = Number.parseInt(process.env.SMTP_PORT, 10) || 587;
const smtpSecure =
  process.env.SMTP_SECURE === "true" ||
  (process.env.SMTP_SECURE !== "false" && smtpPort === 465);

export const tp = nodeMailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: !smtpSecure,
  family: 4,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
