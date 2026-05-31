import { tp } from "../../config/email.js";

export const sendEmail = async (to, subject, body) => {
  try {
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
      console.error(
        "Email sending failed: EMAIL_USERNAME and EMAIL_PASSWORD must be configured",
      );
      return false;
    }

    await tp.sendMail({
      from: `${process.env.EMAIL_FROM_NAME || "Movent"} <${process.env.EMAIL_USERNAME}>`,
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
