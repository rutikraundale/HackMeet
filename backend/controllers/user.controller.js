import User from "../models/user.model.js";

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID and omit the password
        const user = await User.findById(id).select("-password").populate("teamId");
        
        if (!user) {
            return res.status(404).json({
                success: false, 
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        
        // Handle invalid ObjectId format
        if (error.kind === "ObjectId") {
            return res.status(404).json({
                success: false, 
                message: "User not found (Invalid ID format)"
            });
        }
        
        res.status(500).json({
            success: false, 
            message: "Failed to fetch user profile"
        });
    }
};
