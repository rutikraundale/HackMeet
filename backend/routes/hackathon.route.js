import express from "express";
import { getAllHackathons, getHackathonById } from "../controllers/hackathon.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";

const router = express.Router();

// Apply middleware to authenticate the user making the request
router.use(verifyAccessToken);

// Route to fetch all hackathons
router.get("/", getAllHackathons);

// Route to fetch a single hackathon by ID
router.get("/:id", getHackathonById);

export default router;
