import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
  swipeRight,
  swipeLeft,
  getMatches,
  getUserProfiles,
} from "../controllers/matchControllers.js";

const router = express.Router();

// match routes
router.post("/swipe-right/:likedUserId", protectRoute, swipeRight);
router.post("/swipe-left/:dislikedUserId", protectRoute, swipeLeft);

router.get("/", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfiles);

export default router;
