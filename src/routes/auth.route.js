import express from "express";

import {
  login,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

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
