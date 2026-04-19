import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Middleware – verifyAccessToken
 *
 * Reads the `accessToken` cookie, verifies it with JWT_ACCESS_SECRET,
 * then attaches the full user document (minus password) to req.user.
 *
 * On expiry the client should call POST /api/auth/refresh-token.
 */
const verifyAccessToken = async (req, res, next) => {
    try {
        // Check for token in cookies OR Authorization header (Bearer token)
        let token = req.cookies?.accessToken;

        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized – no access token provided."
            });
        }

        // Verify and decode
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Fetch user and strip password
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized – user not found."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token expired. Please refresh your token."
            });
        }

        return res.status(403).json({
            success: false,
            message: "Forbidden – invalid access token."
        });
    }
};

export default verifyAccessToken;
