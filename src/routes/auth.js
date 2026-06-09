import express from "express";

import { validateRequest } from "../middlewares/validateRequest.js";
import { authLimiter } from "../middlewares/rateLimit.js";

import { register } from "../controllers/auth/register.js";
import { verifyEmail } from "../controllers/auth/verifyEmail.js";
import { login } from "../controllers/auth/login.js";
import { registerSchema } from "../validators/auth/register.js";
import { loginSchema } from "../validators/auth/login.js";
import { forgotPassword } from "../controllers/auth/forgotPassword.js";
import { resetPassword } from "../controllers/auth/resetPassword.js";
import { refreshToken } from "../controllers/auth/refreshToken.js";
import { logout } from "../controllers/auth/logout.js";

import { forgotPasswordSchema } from "../validators/auth/forgotPassword.js";
import { resetPasswordSchema } from "../validators/auth/resetPassword.js";
import {
  resetPasswordParamsSchema,
  verifyEmailParamsSchema,
} from "../validators/auth/tokenParams.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validateRequest(registerSchema),
  register,
);

router.post(
  "/login",
  // authLimiter,
  validateRequest(loginSchema),
  login,
);

router.get(
  "/verify-email/:token",
  validateRequest(verifyEmailParamsSchema, "params"),
  verifyEmail,
);

router.post(
  "/forgot-password",
  authLimiter,
  validateRequest(forgotPasswordSchema),
  forgotPassword,
);

router.post(
  "/reset-password/:resetToken",
  authLimiter,
  validateRequest(resetPasswordParamsSchema, "params"),
  validateRequest(resetPasswordSchema),
  resetPassword,
);

router.post("/refresh-token", refreshToken);

router.post("/logout", logout);

export default router;
