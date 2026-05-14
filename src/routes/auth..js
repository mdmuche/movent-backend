import express from "express";

import { validateRequest } from "../middlewares/validateRequest.js";
import { authLimiter } from "../middlewares/rateLimit.js";
import { register } from "../controllers/auth/register.js";
import { verifyEmail } from "../controllers/auth/verifyEmail.js";
import { login } from "../controllers/auth/login.js";
import { registerSchema } from "../validators/auth/register.js";
import { loginSchema } from "../validators/auth/login.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authLimiter,
  register,
);

router.get("/verify-email/:token", verifyEmail);

router.post("/login", validateRequest(loginSchema), authLimiter, login);

export default router;
