import User from "../models/user.model.js";

// @desc    Get all users (excluding password)
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ 
            _id: { $ne: req.user._id },
            isAdmin: { $ne: true } 
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

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
