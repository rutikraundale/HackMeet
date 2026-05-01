import express from "express";
import { handleTelegramWebhook } from "../controllers/telegram.controller.js";

const router = express.Router();

/**
 * POST /api/telegram/webhook
 * Telegram Bot API calls this URL for every update.
 * No auth middleware — Telegram sends raw POST requests.
 */
/// Check if this exists in your backend routes
router.post('/api/telegram/webhook', (req, res) => {
    console.log("Telegram sent a message!", req.body);
    res.sendStatus(200); // Always send 200 back to Telegram!
});
export default router;
