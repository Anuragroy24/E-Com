import { Router } from "express";
import rateLimit from "express-rate-limit";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import {
    register,
    login,
    refreshAccessToken,
    logout,
    getProfile
} from "../controllers/auth.controller.js";

const router = Router();

// Bonus: throttle brute-force login attempts.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts, please try again later" }
});

router.post("/register", registerValidator, validate, register);
router.post("/login", loginLimiter, loginValidator, validate, login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getProfile);

export default router;
