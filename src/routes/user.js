import express from "express";
import { verifyToken } from "../middlewares/verifyAuth.js";
import { getProfile } from "../controllers/user/profile.js";

const router = express.Router();

// Define the route for user
router.get("/profile", verifyToken, getProfile);

export default router;
