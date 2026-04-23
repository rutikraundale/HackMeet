import Team from "../models/team.model.js";
import User from "../models/user.model.js";
import Hackathon from "../models/hackathons.model.js";
import { createNotification } from "./notification.controller.js";

// @desc    Create a new hackathon
// @route   POST /api/admin/hackathons
// @access  Private/Admin
export const createHackathon = async (req, res) => {
    try {
        const { name, description, startDate, endDate, location, teamsize, prizes, registeringUrl } = req.body;

        if (!name || !description || !startDate || !endDate || !location || !teamsize) {
            return res.status(400).json({ success: false, message: "Please provide all required fields." });
        }

        const hackathon = new Hackathon({
            name,
            description,
            startDate,
            endDate,
            location,
            teamsize,
            prizes,
            registeringUrl,
        });

        const createdHackathon = await hackathon.save();

        res.status(201).json({
            success: true,
            data: createdHackathon,
            message: "Hackathon created successfully.",
        });

        // Notify all users about the new hackathon
        const users = await User.find({ isAdmin: { $ne: true } }).select("_id");
        users.forEach(user => {
            createNotification(
                user._id,
                req.user._id,
                "hackathon",
                name,
                `/hackathon/${createdHackathon._id}`
            );
        });
    } catch (error) {
        console.error("Error creating hackathon:", error);
        res.status(500).json({ success: false, message: "Failed to create hackathon." });
    }
};

// @desc    Get all hackathons segmented by date (live, upcoming, past)
// @route   GET /api/admin/hackathons
// @access  Private/Admin
export const getHackathonsSegmented = async (req, res) => {
    try {
        const now = new Date();

        const allHackathons = await Hackathon.find({}).sort({ startDate: 1 });

        const live = [];
        const upcoming = [];
        const past = [];

        allHackathons.forEach(hackathon => {
            const start = new Date(hackathon.startDate);
            const end = new Date(hackathon.endDate);

            if (hackathon.status === "terminated" || now > end) {
                past.push(hackathon);
            } else if (now < start) {
                upcoming.push(hackathon);
            } else {
                live.push(hackathon);
            }
        });

        res.status(200).json({
            success: true,
            data: {
                live,
                upcoming,
                past
            }
        });
    } catch (error) {
        console.error("Error fetching hackathons:", error);
        res.status(500).json({ success: false, message: "Failed to fetch hackathons." });
    }
};

// @desc    Update a hackathon
// @route   PUT /api/admin/hackathons/:id
// @access  Private/Admin
export const updateHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const hackathon = await Hackathon.findByIdAndUpdate(id, updates, { new: true });

        if (!hackathon) {
            return res.status(404).json({ success: false, message: "Hackathon not found." });
        }

        res.status(200).json({
            success: true,
            data: hackathon,
            message: "Hackathon updated successfully.",
        });
    } catch (error) {
        console.error("Error updating hackathon:", error);
        res.status(500).json({ success: false, message: "Failed to update hackathon." });
    }
};

// @desc    Delete a hackathon
// @route   DELETE /api/admin/hackathons/:id
// @access  Private/Admin
export const deleteHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        const hackathon = await Hackathon.findByIdAndDelete(id);

        if (!hackathon) {
            return res.status(404).json({ success: false, message: "Hackathon not found." });
        }

        res.status(200).json({
            success: true,
            message: "Hackathon deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting hackathon:", error);
        res.status(500).json({ success: false, message: "Failed to delete hackathon." });
    }
};

// @desc    Terminate a hackathon (set status to terminated)
// @route   PATCH /api/admin/hackathons/:id/terminate
// @access  Private/Admin
export const terminateHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        const hackathon = await Hackathon.findByIdAndUpdate(id, { status: "terminated" }, { new: true });

        if (!hackathon) {
            return res.status(404).json({ success: false, message: "Hackathon not found." });
        }

        res.status(200).json({
            success: true,
            data: hackathon,
            message: "Hackathon terminated successfully.",
        });
    } catch (error) {
        console.error("Error terminating hackathon:", error);
        res.status(500).json({ success: false, message: "Failed to terminate hackathon." });
    }
};

// @desc    Get all teams
// @route   GET /api/admin/teams
// @access  Private/Admin
export const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({})
            .populate("teamLeader", "username email")
            .populate("members", "username email")
            .populate("hackathonId", "name startDate endDate");

        res.status(200).json({
            success: true,
            data: teams
        });
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ success: false, message: "Failed to fetch teams." });
    }
};
