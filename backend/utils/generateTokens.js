import jwt from "jsonwebtoken";

/**
 * Generates an access token (short-lived) and a refresh token (long-lived),
 * then attaches both to the response as HTTP-only, Secure cookies.
 *
 * @param {object} res    - Express response object
 * @param {string} userId - MongoDB _id of the authenticated user
 */
const generateTokensAndSetCookies = (res, userId) => {
    // ── Access Token (15 min) ─────────────────────────────────────────────────
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );

    // ── Refresh Token (7 days) ────────────────────────────────────────────────
    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );

    const isProd = process.env.NODE_ENV === "production";

    // ── Attach cookies ────────────────────────────────────────────────────────
    res.cookie("accessToken", accessToken, {
        httpOnly: true,          // Not accessible via document.cookie
        secure: isProd,          // HTTPS only in production
        sameSite: "none",      // CSRF protection
        maxAge: 15 * 60 * 1000  // 15 min in ms
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in ms
    });

    return { accessToken, refreshToken };
};

export default generateTokensAndSetCookies;
