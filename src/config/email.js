import nodeMailer from "nodemailer";

export const tp = nodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
  port: 465,
});
