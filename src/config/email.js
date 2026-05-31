import nodeMailer from "nodemailer";
import dns from "node:dns/promises";

const smtpPort = Number.parseInt(process.env.SMTP_PORT, 10) || 587;
const smtpSecure =
  process.env.SMTP_SECURE === "true" ||
  (process.env.SMTP_SECURE !== "false" && smtpPort === 465);
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";

const resolveSocketOptions = async () => {
  if (process.env.SMTP_FORCE_IPV4 === "false") {
    return false;
  }

  const [address] = await dns.resolve4(smtpHost);

  return {
    host: address,
    servername: smtpHost,
    tls: {
      servername: smtpHost,
    },
  };
};

export const tp = nodeMailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: !smtpSecure,
  family: 4,
  getSocket: (_options, callback) => {
    resolveSocketOptions().then(
      (socketOptions) => callback(null, socketOptions),
      (error) => callback(error),
    );
  },
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
