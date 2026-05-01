import express from "express";
import { handleTelegramWebhook } from "../controllers/telegram.controller.js";

const router = express.Router();

/**
 * POST /api/telegram/webhook
 * Telegram Bot API calls this URL for every update.
 * No auth middleware — Telegram sends raw POST requests.
 */
router.post("/webhook", handleTelegramWebhook);

export default router;
