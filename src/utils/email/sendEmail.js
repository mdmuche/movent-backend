import { resend } from "../../config/email.js";

export const sendEmail = async (to, subject, body) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: body,
    });

    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};
