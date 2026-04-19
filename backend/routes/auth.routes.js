import { Router } from "express";
import {
    signup,
    login,
    logout,
    refreshToken,
    getMe,
    updateProfile
} from "../controllers/auth.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";

const router = Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// ── Protected routes (requires valid access token cookie) ─────────────────────
router.get("/me", verifyAccessToken, getMe);
router.put("/profile", verifyAccessToken, upload.single("profilePicture"), updateProfile);

export default router;
