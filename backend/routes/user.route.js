import express from "express";
import { getAllUsers, getUserProfile } from "../controllers/user.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";

const router = express.Router();

// Apply middleware to authenticate the user making the request
router.use(verifyAccessToken);

// Route to fetch all users (for Discover / Teammates pages)
router.get("/", getAllUsers);

// Route to fetch a user profile by ID
router.get("/:id", getUserProfile);

export default router;
