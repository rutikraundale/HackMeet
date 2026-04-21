import Hackathon from "../models/hackathons.model.js";

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Private
export const getAllHackathons = async (req, res) => {
    try {
        // Find all hackathons and sort them by start date in ascending order
        const hackathons = await Hackathon.find({}).sort({ startDate: 1 });
        
        res.status(200).json({
            success: true,
            count: hackathons.length,
            data: hackathons
        });
    } catch (error) {
        console.error("Error fetching hackathons:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch hackathons" 
        });
    }
};

// @desc    Get a single hackathon by ID
// @route   GET /api/hackathons/:id
// @access  Private
export const getHackathonById = async (req, res) => {
    try {
        const { id } = req.params;
        const hackathon = await Hackathon.findById(id);

        if (!hackathon) {
            return res.status(404).json({ 
                success: false, 
                message: "Hackathon not found" 
            });
        }

        res.status(200).json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        console.error("Error fetching hackathon details:", error);
        
        // Handle invalid ObjectId format
        if (error.kind === "ObjectId") {
            return res.status(404).json({ 
                success: false, 
                message: "Hackathon not found (Invalid ID format)" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch hackathon details" 
        });
    }
};
