import express from "express";
import {
    getAllUsers,
    getUserProfile,
    getMyProfile,
    updateProfile,
} from "../controllers/user.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Apply middleware to authenticate the user making the request
router.use(verifyAccessToken);

// ── Own-profile routes (must come BEFORE /:id to avoid "me" being treated as ObjectId) ──
// GET  /api/users/me           → return the logged-in user's full profile
router.get("/me", getMyProfile);

// PUT  /api/users/me/update    → update profile fields + optional avatar (field name: "profilePicture")
router.put("/me/update", upload.single("profilePicture"), updateProfile);

// ── Public user routes ────────────────────────────────────────────────────────
// Route to fetch all users (for Discover / Teammates pages)
router.get("/", getAllUsers);

// Route to fetch a user profile by ID
router.get("/:id", getUserProfile);

export default router;
