import express from "express";
import { getMe, login, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";
const router = express.Router();

// Looser — general abuse/brute-force protection
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: "Too many attempts. Please try again later." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);

export default router;
