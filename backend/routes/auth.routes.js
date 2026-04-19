import { Router } from "express";
import {
    signup,
    login,
    logout,
    refreshToken,
    getMe
} from "../controllers/auth.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";

const router = Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// ── Protected route (requires valid access token cookie) ──────────────────────
router.get("/me", verifyAccessToken, getMe);

export default router;
