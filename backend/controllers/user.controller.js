import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import cloudinary from "../utils/cloudinary.js";

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

// ─────────────────────────────────────────────────────────────────────────────
// OWN PROFILE ROUTES  (authenticated user only)
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Get the currently logged-in user's own profile
// @route   GET /api/users/me
// @access  Private
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password")
            .populate("teamId");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching own profile:", error);
        res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
};

// @desc    Update the currently logged-in user's profile (with optional avatar)
// @route   PUT /api/users/me/update
// @access  Private
// @body    FormData – text fields + optional file field "avatar"
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ── Allowed text/array fields ──────────────────────────────────────────
        const allowedFields = [
            "username", "bio", "college",
            "skills", "projects", "hackathonsParticipated",
            "hackathonsWon", "codingPlatforms", "socialLinks",
            "status",
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                let value = req.body[field];

                // Arrays sent as JSON strings (FormData limitation)
                const arrayFields = [
                    "skills", "projects", "hackathonsParticipated",
                    "hackathonsWon", "codingPlatforms", "socialLinks",
                ];
                if (arrayFields.includes(field)) {
                    if (typeof value === "string") {
                        try { value = JSON.parse(value); } catch { value = [value]; }
                    }
                }

                user[field] = value;
            }
        }

        // ── Handle avatar upload ───────────────────────────────────────────────
        if (req.file) {
            // Delete old avatar from Cloudinary if it exists
            if (user.profilePicture) {
                try {
                    // Extract public_id from URL  e.g. hackmeet/avatars/abc123
                    const urlParts = user.profilePicture.split("/");
                    const publicIdWithExt = urlParts.slice(-2).join("/");         // folder/filename.ext
                    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");   // strip extension
                    await cloudinary.uploader.destroy(publicId);
                } catch (delErr) {
                    console.warn("Could not delete old avatar from Cloudinary:", delErr.message);
                }
            }

            // Upload new avatar
            const avatarUrl = await uploadToCloudinary(req.file.buffer, "hackmeet/avatars");
            user.profilePicture = avatarUrl;
        }

        // ── Handle explicit avatar removal ────────────────────────────────────
        if (req.body.removeAvatar === "true" && user.profilePicture) {
            try {
                const urlParts = user.profilePicture.split("/");
                const publicIdWithExt = urlParts.slice(-2).join("/");
                const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
                await cloudinary.uploader.destroy(publicId);
            } catch (delErr) {
                console.warn("Could not delete avatar from Cloudinary:", delErr.message);
            }
            user.profilePicture = "";
        }

        // ── Auto-mark profile as completed ────────────────────────────────────
        if (user.bio && user.college && user.skills?.length > 0) {
            user.isProfileCompleted = true;
        }

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);

        // Multer / file errors
        if (error.message === "Only image files are allowed!") {
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};
