import express from "express";

import {
  login,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { loginSchema, registerSchema } from "../validators/user.validator.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);

router.get("/verify-email/:token", verifyEmail);

router.post("/login", validateRequest(loginSchema), login);

export default router;
