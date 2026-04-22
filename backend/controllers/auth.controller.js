import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import generateTokensAndSetCookies from "../utils/generateTokens.js";
import cloudinary, { uploadToCloudinary } from "../utils/cloudinary.js";

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/signup
// ─────────────────────────────────────────────────────────────────────────────
export const signup = async (req, res) => {
    const { username, email, password, bio, college, skills, socialLinks } = req.body;

    try {
        // ── Validate input ────────────────────────────────────────────────────
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Username, email and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });
        }

        // ── Check duplicates ──────────────────────────────────────────────────
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Username";
            return res.status(200).json({
                success: false,
                message: `${field} is already in use.`
            });
        }

        // ── Upload Image or Set Default ───────────────────────────────────────
        let profilePictureUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        if (req.file) {
            try {
                profilePictureUrl = await uploadToCloudinary(req.file.buffer);
            } catch (error) {
                return res.status(500).json({ success: false, message: "Image upload failed: " + error.message });
            }
        }

        // ── Hash password ─────────────────────────────────────────────────────
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Helper to parse potential stringified JSON arrays from FormData
        const parseArray = (field) => {
            if (field === undefined || field === null) return [];
            if (Array.isArray(field)) return field;
            if (typeof field === 'object') return Object.values(field).map(String);
            if (typeof field !== 'string') return [String(field)];
            
            try {
                const parsed = JSON.parse(field);
                return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
            } catch (e) {
                // Return as an array with a single string entry if it's just a comma-separated string or normal string
                return field.split(',').map(item => item.trim()).filter(Boolean);
            }
        };

        // ── Create user ───────────────────────────────────────────────────────
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            bio,
            college,
            profilePicture: profilePictureUrl,
            skills: parseArray(skills),
            socialLinks: parseArray(socialLinks)
        });

        // ── Issue tokens ──────────────────────────────────────────────────────
        generateTokensAndSetCookies(res, newUser._id);

        // ── Respond (never return password) ───────────────────────────────────
        const { password: _pw, ...userWithoutPassword } = newUser.toObject();

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("[signup]", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // ── Find user ─────────────────────────────────────────────────────────
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // ── Verify password ───────────────────────────────────────────────────
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // ── Issue tokens ──────────────────────────────────────────────────────
        generateTokensAndSetCookies(res, user._id);

        const { password: _pw, ...userWithoutPassword } = user.toObject();

        return res.status(200).json({
            success: true,
            message: "Logged in successfully.",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("[login]", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/logout
// ─────────────────────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
    try {
        // Clear both cookies by setting maxAge to 0
        const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" };

        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.error("[logout]", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/refresh-token
//  Called by the client when the access token expires.
// ─────────────────────────────────────────────────────────────────────────────
export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided."
            });
        }

        // Verify the refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Make sure user still exists
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }

        // Issue a fresh pair of tokens (rotation)
        generateTokensAndSetCookies(res, user._id);

        return res.status(200).json({
            success: true,
            message: "Tokens refreshed successfully.",
            user
        });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Refresh token expired. Please log in again."
            });
        }

        console.error("[refreshToken]", error);
        return res.status(403).json({ success: false, message: "Invalid refresh token." });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/auth/me   (protected – requires verifyAccessToken middleware)
// ─────────────────────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password")
            .populate({
                path: "invitations",
                populate: [
                    { path: "hackathonId", select: "name" },
                    { path: "teamLeader", select: "username" }
                ]
            });

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("[getMe]", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
//  PUT /api/auth/profile   (protected – requires verifyAccessToken middleware)
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const {
            bio,
            college,
            skills,
            projects,
            hackathonsParticipated,
            hackathonsWon,
            codingPlatforms,
            socialLinks,
            status,
            removeProfilePicture
        } = req.body;

        // Helper to parse potential stringified JSON arrays from FormData
        const parseArray = (field) => {
            if (field === undefined || field === null) return [];
            if (Array.isArray(field)) return field;
            if (typeof field === 'object') return Object.values(field).map(String);
            if (typeof field !== 'string') return [String(field)];
            
            try {
                const parsed = JSON.parse(field);
                return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
            } catch (e) {
                return field.split(',').map(item => item.trim()).filter(Boolean);
            }
        };

        // Update text fields
        if (bio !== undefined) user.bio = bio;
        if (college !== undefined) user.college = college;
        if (status !== undefined) user.status = status;
        if (skills !== undefined) user.skills = parseArray(skills);
        if (projects !== undefined) user.projects = parseArray(projects);
        if (hackathonsParticipated !== undefined) user.hackathonsParticipated = parseArray(hackathonsParticipated);
        if (hackathonsWon !== undefined) user.hackathonsWon = parseArray(hackathonsWon);
        if (codingPlatforms !== undefined) user.codingPlatforms = parseArray(codingPlatforms);
        if (socialLinks !== undefined) user.socialLinks = parseArray(socialLinks);

        // Handle Profile Picture
        if (removeProfilePicture === "true") {
            // Delete from cloudinary if it exists and is not a default dicebear link
            if (user.profilePicture && user.profilePicture.includes("cloudinary")) {
                try {
                    const publicId = user.profilePicture.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(`hackmeet/avatars/${publicId}`);
                } catch (err) {
                    console.error("Cloudinary delete error:", err);
                }
            }
            user.profilePicture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
        } else if (req.file) {
            // Delete old one if it exists
            if (user.profilePicture && user.profilePicture.includes("cloudinary")) {
                try {
                    const publicId = user.profilePicture.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(`hackmeet/avatars/${publicId}`);
                } catch (err) {
                    console.error("Cloudinary delete error:", err);
                }
            }
            
            // Upload new one
            try {
                const profilePictureUrl = await uploadToCloudinary(req.file.buffer);
                user.profilePicture = profilePictureUrl;
            } catch (error) {
                return res.status(500).json({ success: false, message: "Image upload failed: " + error.message });
            }
        }

        // Mark profile as completed if core fields are present
        if (user.bio && user.college && user.skills?.length > 0) {
            user.isProfileCompleted = true;
        }

        await user.save();

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("[updateProfile]", error);
        return res.status(500).json({ success: false, message: "Internal server error: " + error.message });
    }
};
