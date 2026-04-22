import express from "express";
import { 
    createHackathon, 
    getHackathonsSegmented, 
    getAllTeams, 
    updateHackathon, 
    deleteHackathon, 
    terminateHackathon 
} from "../controllers/admin.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// Apply middleware to all routes in this file
router.use(verifyAccessToken);
router.use(verifyAdmin);

router.post("/hackathons", createHackathon);
router.get("/hackathons", getHackathonsSegmented);
router.put("/hackathons/:id", updateHackathon);
router.delete("/hackathons/:id", deleteHackathon);
router.patch("/hackathons/:id/terminate", terminateHackathon);
router.get("/teams", getAllTeams);

export default router;
