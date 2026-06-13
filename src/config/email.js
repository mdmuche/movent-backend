// todo used dotenv for a minor fix we improve this later
import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
