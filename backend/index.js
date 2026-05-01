import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middleware/cors.js";

import connectDB from "./db/connection.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import hackathonRoutes from "./routes/hackathon.route.js";
import teamRoutes from "./routes/team.route.js";
import messageRoutes from "./routes/message.route.js";
import notificationRoutes from "./routes/notification.routes.js";
import telegramRoutes from "./routes/telegram.route.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.options("*", corsMiddleware); // Handle preflight requests for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());            // Parses Cookie header → req.cookies

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/telegram", telegramRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ success: true, message: "HackMeet API is running 🚀" });
});

app.post('/api/telegram/webhook', (req, res) => {
    console.log("Message received from Telegram:", req.body);
    
    // Telegram needs a 200 OK response immediately
    res.status(200).send('ok');
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
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`✅  Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
});