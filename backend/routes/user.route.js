import express from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";

const router = express.Router();

// Apply middleware to authenticate the user making the request
router.use(verifyAccessToken);

// Route to fetch a user profile by ID
router.get("/:id", getUserProfile);

export default router;
