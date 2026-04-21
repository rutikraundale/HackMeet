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
            skills: { $in: user.skills }
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
        const { targetUserId } = req.body;
        const leaderUser = req.user;

        // Verify the caller is a team leader
        if (!leaderUser.isTeamLeader || !leaderUser.teamId) {
            return res.status(403).json({ success: false, message: "Only team leaders can invite members." });
        }

        const teamId = leaderUser.teamId;

        // Verify the team exists and isn't locked
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ success: false, message: "Team not found." });
        if (team.islocked) return res.status(400).json({ success: false, message: "Team is locked. Cannot invite more users." });

        if (team.members.includes(targetUserId)) {
            return res.status(400).json({ success: false, message: "User is already a member of this team." });
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

        res.status(200).json({
            success: true,
            message: "Invitation sent successfully."
        });

    } catch (error) {
        console.error("Error sending invite:", error);
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

        // Add user to team
        const team = await Team.findByIdAndUpdate(
            teamId,
            { $addToSet: { members: userId } },
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

        res.status(200).json({
            success: true,
            message: "Invitation declined successfully."
        });
    } catch (error) {
         console.error("Error declining invite:", error);
         res.status(500).json({ success: false, message: "Failed to decline invitation" });
    }
};
