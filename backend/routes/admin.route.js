import express from "express";
import { createHackathon, getHackathonsSegmented, getAllTeams } from "../controllers/admin.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// Apply middleware to all routes in this file
router.use(verifyAccessToken);
router.use(verifyAdmin);

router.post("/hackathons", createHackathon);
router.get("/hackathons", getHackathonsSegmented);
router.get("/teams", getAllTeams);

export default router;
