import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./db/connection.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true   // Required to allow cookies to be sent cross-origin
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());            // Parses Cookie header → req.cookies

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ success: true, message: "HackMeet API is running 🚀" });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("[GlobalError]", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error."
    });
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅  Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
});