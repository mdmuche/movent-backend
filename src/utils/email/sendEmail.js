import { tp } from "../../config/email.js";

export const sendEmail = async (to, subject, body) => {
  try {
    await tp.sendMail({
      from: `Your App Name <${process.env.EMAIL_USERNAME}>`,
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
