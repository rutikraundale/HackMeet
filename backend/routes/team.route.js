import express from "express";
import { 
    createTeam, 
    getMyTeam,
    getRecommendedUsers, 
    inviteUser, 
    acceptInvitation, 
    declineInvitation,
    getLatestCommit,
    updateTeam,
    deleteTeam,
    removeMember,
    leaveTeam,
    getOpenTeams,
    requestToJoin,
    acceptJoinRequest,
    rejectJoinRequest,
    cancelInvite
} from "../controllers/team.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyAccessToken);

// Route to get all teams with open spots
router.get("/open", getOpenTeams);

// Route to create a new team, automatically makes caller the teamLeader
router.post("/", createTeam);

// Route to get my team
router.get("/my-team", getMyTeam);

// Route for team leaders to fetch other users that match their skills
router.get("/recommendations", getRecommendedUsers);

// Route for team leaders to invite a user
router.post("/invite", inviteUser);

// Route to cancel an invite
router.post("/cancel-invite", cancelInvite);

// Routes to respond to an invitation
router.post("/accept-invite/:teamId", acceptInvitation);
router.post("/decline-invite/:teamId", declineInvitation);

// Route to request to join a team
router.post("/:id/request", requestToJoin);

// Routes for team leaders to accept or reject join requests
router.post("/:id/accept-request/:userId", acceptJoinRequest);
router.post("/:id/reject-request/:userId", rejectJoinRequest);

// Route to get GitHub Repo activity natively
router.get("/:id/commits/latest", getLatestCommit);

// Route to update team (e.g. gitRepoLink, todos, teamName)
router.put("/:id", updateTeam);

// Route to delete team (Leader only)
router.delete("/:id", deleteTeam);

// Route to remove member (Leader only)
router.delete("/:teamId/members/:memberId", removeMember);

// Route to leave team (Members only)
router.post("/leave", leaveTeam);

export default router;
