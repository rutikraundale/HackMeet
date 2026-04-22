import Team from "../models/team.model.js";
import User from "../models/user.model.js";

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
export const createTeam = async (req, res) => {
    try {
        const { teamName, hackathonId } = req.body;
        const userId = req.user._id;

        if (!teamName || !hackathonId) {
            return res.status(400).json({ success: false, message: "teamName and hackathonId are required." });
        }

        // Check if user is already in a team
        if (req.user.teamId) {
            return res.status(400).json({ success: false, message: "You are already part of a team." });
        }

        const team = new Team({
            teamName,
            hackathonId,
            teamLeader: userId,
            members: [userId] // The creator is automatically an accepted member
        });

        await team.save();

        // Update the user to be a team leader and assign the teamId
        await User.findByIdAndUpdate(userId, {
            isTeamLeader: true,
            teamId: team._id
        });

        res.status(201).json({
            success: true,
            message: "Team created successfully",
            data: team
        });
    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ success: false, message: "Failed to create team" });
    }
};

// @desc    Get my team details
// @route   GET /api/teams/my-team
// @access  Private
export const getMyTeam = async (req, res) => {
    try {
        const user = req.user;
        if (!user.teamId) {
            return res.status(200).json({ success: true, data: null, message: "You do not belong to a team yet." });
        }
        const team = await Team.findById(user.teamId)
            .populate("members", "username email college profilePicture skills")
            .populate("pendingInvites", "username email college profilePicture")
            .populate("joinRequests", "username email college profilePicture skills")
            .populate("teamLeader", "username")
            .populate("hackathonId", "name startDate endDate teamsize");

        if (!team) {
             return res.status(200).json({ success: true, data: null, message: "Team not found." });
        }

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        console.error("Error fetching my team:", error);
        res.status(500).json({ success: false, message: "Failed to fetch team details" });
    }
};

// @desc    Get recommended users based on matching skills
// @route   GET /api/teams/recommendations
// @access  Private (for Team Leaders)
export const getRecommendedUsers = async (req, res) => {
    try {
        const user = req.user;
        
        // Ensure user is a team leader
        if (!user.isTeamLeader) {
            return res.status(403).json({ success: false, message: "Only team leaders can get recommendations." });
        }

        // Find users with at least one matching skill who are NOT currently in a team and NOT the caller
        // Using $or for robustness around missing/null fields
        const recommendedUsers = await User.find({
            _id: { $ne: user._id },
            $or: [{ teamId: { $exists: false } }, { teamId: null }],
            skills: { $in: user.skills },
            isAdmin: { $ne: true }
        }).select("-password");

        res.status(200).json({
            success: true,
            data: recommendedUsers
        });
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ success: false, message: "Failed to fetch recommendations" });
    }
};

// @desc    Invite a user to the team
// @route   POST /api/teams/invite
// @access  Private
export const inviteUser = async (req, res) => {
    try {
        console.log("Invite Request Body:", req.body);
        console.log("Invite Request Headers:", req.headers);
        console.log("Invite Request User:", req.user?._id, "isTeamLeader:", req.user?.isTeamLeader);
        
        const { targetUserId } = req.body;
        const leaderUser = req.user;

        if (!targetUserId) {
            return res.status(400).json({ success: false, message: "targetUserId is required." });
        }

        // Verify the caller is a team leader
        if (!leaderUser.isTeamLeader || !leaderUser.teamId) {
            return res.status(403).json({ success: false, message: "Only team leaders can invite members. Please create a team first." });
        }

        const teamId = leaderUser.teamId;

        // Verify the team exists and isn't locked
        const team = await Team.findById(teamId).populate("hackathonId");
        if (!team) return res.status(404).json({ success: false, message: "Team not found." });
        if (team.islocked) return res.status(400).json({ success: false, message: "Team is locked. Cannot invite more users." });

        // Robust ID comparison
        const isAlreadyMember = team.members.some(memberId => memberId.toString() === targetUserId.toString());
        if (isAlreadyMember) {
            return res.status(400).json({ success: false, message: "User is already a member of this team." });
        }
        
        const isAlreadyInvited = team.pendingInvites?.some(inviteId => inviteId.toString() === targetUserId.toString());
        if (isAlreadyInvited) {
            return res.status(400).json({ success: false, message: "User is already invited." });
        }

        const maxLimit = team.hackathonId?.teamsize || 4; // Default to 4 if not set
        const currentSize = team.members.length + (team.pendingInvites?.length || 0);

        console.log(`Team Size Check: Members: ${team.members.length}, Pending: ${team.pendingInvites?.length || 0}, Total: ${currentSize}, Max: ${maxLimit}`);

        if (currentSize >= maxLimit) {
            return res.status(400).json({ success: false, message: `Cannot invite more members. Team size limit (${maxLimit}) reached (including pending invites). Please cancel some pending invites to free up spots.` });
        }

        // Add the teamId to the invited user's invitations array using $addToSet
        const updatedUser = await User.findByIdAndUpdate(
            targetUserId,
            { $addToSet: { invitations: teamId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "Target user not found." });
        }

        // Add targetUserId to team's pendingInvites
        team.pendingInvites = team.pendingInvites || [];
        team.pendingInvites.push(targetUserId);
        await team.save();

        res.status(200).json({
            success: true,
            message: "Invitation sent successfully."
        });

    } catch (error) {
        console.error("Error sending invite:", error);
        
        if (error.name === "CastError" || error.name === "ValidationError") {
            return res.status(400).json({ 
                success: false, 
                message: error.message || "Invalid ID format or validation failed." 
            });
        }

        res.status(500).json({ success: false, message: "Failed to send invitation" });
    }
};

// @desc    Accept an invitation
// @route   POST /api/teams/accept-invite/:teamId
// @access  Private
export const acceptInvitation = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user._id;

        // Verify user has the invitation
        if (!req.user.invitations.includes(teamId)) {
            return res.status(400).json({ success: false, message: "You don't have an invitation for this team." });
        }

        // Verify user isn't already in another team
        if (req.user.teamId) {
             return res.status(400).json({ success: false, message: "You are already in a team. Please leave your current team first." });
        }

        // Verify team isn't full
        const teamCheck = await Team.findById(teamId).populate("hackathonId");
        if (!teamCheck) return res.status(404).json({ success: false, message: "Team not found." });
        
        const maxLimit = teamCheck.hackathonId?.teamsize || 4;
        if (teamCheck.members.length >= maxLimit) {
            return res.status(400).json({ success: false, message: "Team is already full. Cannot join." });
        }

        // Add user to team and remove from pendingInvites
        const team = await Team.findByIdAndUpdate(
            teamId,
            { 
                $addToSet: { members: userId },
                $pull: { pendingInvites: userId }
            },
            { new: true }
        );

        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found." });
        }

        // Update user: remove from invitations, set teamId
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: { invitations: teamId },
                teamId: teamId
            }
        );

        res.status(200).json({
            success: true,
            message: "Invitation accepted successfully.",
            data: team
        });
    } catch (error) {
         console.error("Error accepting invite:", error);
         res.status(500).json({ success: false, message: "Failed to accept invitation" });
    }
};

// @desc    Decline an invitation
// @route   POST /api/teams/decline-invite/:teamId
// @access  Private
export const declineInvitation = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user._id;

        // Update user: remove from invitations
        await User.findByIdAndUpdate(
            userId,
            { $pull: { invitations: teamId } }
        );

        // Update team: remove from pendingInvites
        await Team.findByIdAndUpdate(
            teamId,
            { $pull: { pendingInvites: userId } }
        );

        res.status(200).json({
            success: true,
            message: "Invitation declined successfully."
        });
    } catch (error) {
         console.error("Error declining invite:", error);
         res.status(500).json({ success: false, message: "Failed to decline invitation" });
    }
};

// @desc    Cancel a sent invitation
// @route   POST /api/teams/cancel-invite
// @access  Private (Leader only)
export const cancelInvite = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const leaderUser = req.user;

        if (!leaderUser.isTeamLeader || !leaderUser.teamId) {
            return res.status(403).json({ success: false, message: "Only team leaders can cancel invites." });
        }

        const teamId = leaderUser.teamId;

        // Remove from team's pendingInvites
        await Team.findByIdAndUpdate(
            teamId,
            { $pull: { pendingInvites: targetUserId } }
        );

        // Remove from user's invitations
        await User.findByIdAndUpdate(
            targetUserId,
            { $pull: { invitations: teamId } }
        );

        res.status(200).json({
            success: true,
            message: "Invitation cancelled successfully."
        });
    } catch (error) {
        console.error("Error cancelling invite:", error);
        res.status(500).json({ success: false, message: "Failed to cancel invitation" });
    }
};

// @desc    Fetch latest commit from team's github repo
// @route   GET /api/teams/:id/commits/latest
// @access  Private
export const getLatestCommit = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findById(id);

        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found." });
        }

        if (!team.gitRepoLink) {
            return res.status(400).json({ success: false, message: "No GitHub repository linked to this team." });
        }

        // Extract owner and repo from URL, e.g., https://github.com/owner/repo
        const match = team.gitRepoLink.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        
        if (!match) {
             return res.status(400).json({ success: false, message: "Invalid GitHub repository URL." });
        }

        const [, owner, repo] = match;
        const repoClean = repo.replace(/\.git$/, ''); // Remove .git if present

        const githubToken = process.env.GITHUB_KEY;

        const response = await fetch(`https://api.github.com/repos/${owner}/${repoClean}/commits`, {
            headers: {
                "Authorization": `token ${githubToken}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (!response.ok) {
             return res.status(response.status).json({ success: false, message: "Failed to fetch commits from GitHub." });
        }

        const commits = await response.json();

        if (commits.length === 0) {
             return res.status(200).json({ success: true, message: "No commits found.", data: null });
        }

        res.status(200).json({
             success: true,
             data: commits.slice(0, 5) // Return the 5 most recent commits
        });

    } catch (error) {
         console.error("Error fetching latest commit:", error);
         res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// @desc    Update team details (e.g. gitRepoLink, todos, teamName)
// @route   PUT /api/teams/:id
// @access  Private
export const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { gitRepoLink, todos, teamName } = req.body;
        const userId = req.user._id;

        const team = await Team.findById(id);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found." });
        }

        // Verify the user is a member of the team
        if (!team.members.includes(userId)) {
            return res.status(403).json({ success: false, message: "Only team members can update the team." });
        }

        if (gitRepoLink !== undefined) team.gitRepoLink = gitRepoLink;
        if (todos !== undefined) team.todos = todos;

        // Only leader can update the name
        if (teamName !== undefined) {
            if (team.teamLeader.toString() !== userId.toString()) {
                return res.status(403).json({ success: false, message: "Only the team leader can change the team name." });
            }
            team.teamName = teamName;
        }

        await team.save();

        res.status(200).json({
            success: true,
            message: "Team updated successfully.",
            data: team
        });
    } catch (error) {
        console.error("Error updating team:", error);
        res.status(500).json({ success: false, message: "Failed to update team." });
    }
};

// @desc    Delete a team
// @route   DELETE /api/teams/:id
// @access  Private (Leader only)
export const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const team = await Team.findById(id);
        if (!team) return res.status(404).json({ success: false, message: "Team not found." });

        if (team.teamLeader.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Only the team leader can delete the team." });
        }

        // Unset teamId for all members
        await User.updateMany(
            { _id: { $in: team.members } },
            { $unset: { teamId: "" }, isTeamLeader: false }
        );

        // Also remove team from any pending invites
        if (team.pendingInvites && team.pendingInvites.length > 0) {
            await User.updateMany(
                { _id: { $in: team.pendingInvites } },
                { $pull: { invitations: team._id } }
            );
        }

        await Team.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Team deleted successfully." });
    } catch (error) {
        console.error("Error deleting team:", error);
        res.status(500).json({ success: false, message: "Failed to delete team." });
    }
};

// @desc    Remove a member from the team
// @route   DELETE /api/teams/:teamId/members/:memberId
// @access  Private (Leader only)
export const removeMember = async (req, res) => {
    try {
        const { teamId, memberId } = req.params;
        const leaderId = req.user._id;

        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ success: false, message: "Team not found." });

        if (team.teamLeader.toString() !== leaderId.toString()) {
            return res.status(403).json({ success: false, message: "Only the team leader can remove members." });
        }

        if (leaderId.toString() === memberId.toString()) {
            return res.status(400).json({ success: false, message: "You cannot remove yourself. Delete the team instead." });
        }

        if (!team.members.includes(memberId)) {
             return res.status(400).json({ success: false, message: "User is not a member of this team." });
        }

        // Remove from team members array
        team.members = team.members.filter(id => id.toString() !== memberId.toString());
        await team.save();

        // Update the removed user's record
        await User.findByIdAndUpdate(memberId, { $unset: { teamId: "" } });

        res.status(200).json({ success: true, message: "Member removed successfully." });
    } catch (error) {
        console.error("Error removing member:", error);
        res.status(500).json({ success: false, message: "Failed to remove member." });
    }
};

// @desc    Leave the current team
// @route   POST /api/teams/leave
// @access  Private (Members only)
export const leaveTeam = async (req, res) => {
    try {
        const userId = req.user._id;
        const teamId = req.user.teamId;

        if (!teamId) {
            return res.status(400).json({ success: false, message: "You are not in a team." });
        }

        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ success: false, message: "Team not found." });

        if (team.teamLeader.toString() === userId.toString()) {
            return res.status(400).json({ success: false, message: "Team leader cannot leave. You must delete the team or transfer leadership." });
        }

        // Remove user from team members
        team.members = team.members.filter(id => id.toString() !== userId.toString());
        await team.save();

        // Update user record
        await User.findByIdAndUpdate(userId, { $unset: { teamId: "" } });

        res.status(200).json({ success: true, message: "You have left the team successfully." });
    } catch (error) {
        console.error("Error leaving team:", error);
        res.status(500).json({ success: false, message: "Failed to leave team." });
    }
};

// @desc    Get all teams with vacant members
// @route   GET /api/teams/open
// @access  Private
export const getOpenTeams = async (req, res) => {
    try {
        const teams = await Team.find({ islocked: false })
            .populate("hackathonId", "name startDate endDate teamsize status")
            .populate("teamLeader", "username profilePicture college")
            .populate("members", "username");

        // Filter out teams that are full
        const openTeams = teams.filter(team => {
            const maxSize = team.hackathonId?.teamsize || 4;
            const currentSize = team.members.length;
            const hackStatus = team.hackathonId?.status || "active";
            return currentSize < maxSize && hackStatus !== "terminated";
        });

        res.status(200).json({ success: true, data: openTeams });
    } catch (error) {
        console.error("Error fetching open teams:", error);
        res.status(500).json({ success: false, message: "Failed to fetch teams." });
    }
};

// @desc    Request to join a team
// @route   POST /api/teams/:id/request
// @access  Private
export const requestToJoin = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (req.user.teamId) {
            return res.status(400).json({ success: false, message: "You are already in a team." });
        }

        const team = await Team.findById(id).populate("hackathonId");
        if (!team) return res.status(404).json({ success: false, message: "Team not found." });

        if (team.islocked) return res.status(400).json({ success: false, message: "Team is locked." });

        if (team.members.includes(userId)) {
            return res.status(400).json({ success: false, message: "You are already a member." });
        }

        if (team.joinRequests && team.joinRequests.includes(userId)) {
            return res.status(400).json({ success: false, message: "You have already requested to join this team." });
        }

        const maxLimit = team.hackathonId?.teamsize || 4;
        if (team.members.length >= maxLimit) {
            return res.status(400).json({ success: false, message: "Team is already full." });
        }

        team.joinRequests = team.joinRequests || [];
        team.joinRequests.push(userId);
        await team.save();

        res.status(200).json({ success: true, message: "Request sent successfully." });
    } catch (error) {
        console.error("Error requesting to join:", error);
        res.status(500).json({ success: false, message: "Failed to send request." });
    }
};

// @desc    Accept a join request
// @route   POST /api/teams/:id/accept-request/:userId
// @access  Private (Leader only)
export const acceptJoinRequest = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const leaderId = req.user._id;

        const team = await Team.findById(id).populate("hackathonId");
        if (!team) return res.status(404).json({ success: false, message: "Team not found." });

        if (team.teamLeader.toString() !== leaderId.toString()) {
            return res.status(403).json({ success: false, message: "Only the team leader can accept requests." });
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ success: false, message: "User not found." });

        if (targetUser.teamId) {
             // Remove request if they already joined another team
             team.joinRequests = team.joinRequests.filter(reqId => reqId.toString() !== userId.toString());
             await team.save();
             return res.status(400).json({ success: false, message: "User has already joined another team." });
        }

        const maxLimit = team.hackathonId?.teamsize || 4;
        if (team.members.length >= maxLimit) {
            return res.status(400).json({ success: false, message: "Team is already full." });
        }

        // Add to members, remove from requests
        team.members.push(userId);
        team.joinRequests = team.joinRequests.filter(reqId => reqId.toString() !== userId.toString());
        await team.save();

        targetUser.teamId = team._id;
        // Also remove any invitations the user has for this team since they just joined
        targetUser.invitations = targetUser.invitations.filter(inv => inv.toString() !== team._id.toString());
        await targetUser.save();

        res.status(200).json({ success: true, message: "Request accepted." });
    } catch (error) {
        console.error("Error accepting request:", error);
        res.status(500).json({ success: false, message: "Failed to accept request." });
    }
};

// @desc    Reject a join request
// @route   POST /api/teams/:id/reject-request/:userId
// @access  Private (Leader only)
export const rejectJoinRequest = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const leaderId = req.user._id;

        const team = await Team.findById(id);
        if (!team) return res.status(404).json({ success: false, message: "Team not found." });

        if (team.teamLeader.toString() !== leaderId.toString()) {
            return res.status(403).json({ success: false, message: "Only the team leader can reject requests." });
        }

        team.joinRequests = team.joinRequests.filter(reqId => reqId.toString() !== userId.toString());
        await team.save();

        res.status(200).json({ success: true, message: "Request rejected." });
    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ success: false, message: "Failed to reject request." });
    }
};
