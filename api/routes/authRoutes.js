import express from "express";
import { getMe, login, logout, signup } from "../controllers/authControllers.js";
import { protectRoute } from "../middlewares/auth.js";

const router = express.Router();

// Controller functions
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protectRoute, getMe);

export default router;
