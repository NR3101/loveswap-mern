import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { updateProfile } from "../controllers/userControllers.js";

const router = express.Router();

// update user profile
router.put("/update", protectRoute, updateProfile);

export default router;
