import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import generateTokensAndSetCookies from "../utils/generateTokens.js";

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/signup
// ─────────────────────────────────────────────────────────────────────────────
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

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
            return res.status(409).json({
                success: false,
                message: `${field} is already in use.`
            });
        }

        // ── Hash password ─────────────────────────────────────────────────────
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ── Create user ───────────────────────────────────────────────────────
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
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
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // ── Verify password ───────────────────────────────────────────────────
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
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
        // req.user is set by the verifyAccessToken middleware
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error("[getMe]", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
