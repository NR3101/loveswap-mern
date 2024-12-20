import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
  sendMessage,
  getConversations,
} from "../controllers/messageControllers.js";

const router = express.Router();

// message routes
router.post("/send", protectRoute, sendMessage);
router.get("/conversations/:userId", protectRoute, getConversations);

export default router;
