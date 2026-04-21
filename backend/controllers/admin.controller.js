import Hackathon from "../models/hackathons.model.js";
import Team from "../models/team.model.js";

// @desc    Create a new hackathon
// @route   POST /api/admin/hackathons
// @access  Private/Admin
export const createHackathon = async (req, res) => {
    try {
        const { name, description, startDate, endDate, location, teamsize, prizes } = req.body;

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
        });

        const createdHackathon = await hackathon.save();

        res.status(201).json({
            success: true,
            data: createdHackathon,
            message: "Hackathon created successfully.",
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

            if (now < start) {
                upcoming.push(hackathon);
            } else if (now > end) {
                past.push(hackathon);
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
