import express from "express";
import { 
    createTeam, 
    getMyTeam,
    getRecommendedUsers, 
    inviteUser, 
    acceptInvitation, 
    declineInvitation,
    getLatestCommit
} from "../controllers/team.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyAccessToken);

// Route to create a new team, automatically makes caller the teamLeader
router.post("/", createTeam);

// Route to get my team
router.get("/my-team", getMyTeam);

// Route for team leaders to fetch other users that match their skills
router.get("/recommendations", getRecommendedUsers);

// Route for team leaders to invite a user
router.post("/invite", inviteUser);

// Routes to respond to an invitation
router.post("/accept-invite/:teamId", acceptInvitation);
router.post("/decline-invite/:teamId", declineInvitation);

// Route to get GitHub Repo activity natively
router.get("/:id/commits/latest", getLatestCommit);

export default router;
