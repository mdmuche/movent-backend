import nodeMailer from "nodemailer";
import dns from "node:dns/promises";

const smtpPort = Number.parseInt(process.env.SMTP_PORT, 10) || 587;
const smtpSecure =
  process.env.SMTP_SECURE === "true" ||
  (process.env.SMTP_SECURE !== "false" && smtpPort === 465);
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";

const resolveSmtpHost = async () => {
  if (process.env.SMTP_FORCE_IPV4 === "false") {
    return smtpHost;
  }

  const [address] = await dns.resolve4(smtpHost);

  return address;
};

const smtpConnectionHost =
  process.env.SMTP_HOST_IPV4 || (await resolveSmtpHost());

export const tp = nodeMailer.createTransport({
  host: smtpConnectionHost,
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: !smtpSecure,
  tls: {
    servername: smtpHost,
  },
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
