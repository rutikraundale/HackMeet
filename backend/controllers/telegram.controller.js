import mongoose from "mongoose";
import User from "../models/user.model.js";
import { sendTelegramMessage } from "../utils/telegram.js";

/**
 * POST /api/telegram/webhook
 *
 * Telegram sends all bot updates here.
 * We handle two cases:
 *  1. /start <mongoUserId>  – link the user's Telegram chat_id to their DB record
 *  2. Anything else         – ignore silently (return 200 so Telegram stops retrying)
 */
export const handleTelegramWebhook = async (req, res) => {
    // Always ack first so Telegram doesn't time-out and retry
    res.sendStatus(200);

    try {
        const message = req.body?.message;
        if (!message) {
            console.log("[Telegram Webhook] Received update without message:", req.body);
            return;
        }

        const chatId = message.chat?.id;
        const text   = message.text?.trim() || "";

        console.log(`[Telegram Webhook] Received: "${text}" from chatId: ${chatId}`);

        // ── Only handle /start commands ───────────────────────────────────────
        if (!text.startsWith("/start")) {
            console.log("[Telegram Webhook] Skipping non-start message");
            return;
        }

        // /start         → no param  → generic welcome
        // /start <id>    → deep-link from profile page
        const parts       = text.split(" ");
        const mongoUserId = parts[1];

        if (!mongoUserId) {
            await sendTelegramMessage(
                chatId,
                "👋 Welcome to *HackMeet Bot*!\n\nTo connect your account, click the *Connect Telegram* button on your HackMeet profile page.",
            );
            return;
        }

        // ── Validate the mongoUserId ──────────────────────────────────────────
        if (!mongoose.Types.ObjectId.isValid(mongoUserId)) {
            await sendTelegramMessage(chatId, "❌ Invalid link. Please try again from your profile page.");
            return;
        }

        const user = await User.findById(mongoUserId);
        if (!user) {
            await sendTelegramMessage(chatId, "❌ No HackMeet account found for this link. Please sign up first.");
            return;
        }

        // ── Already linked? ───────────────────────────────────────────────────
        if (user.telegramChatId === String(chatId)) {
            await sendTelegramMessage(
                chatId,
                `✅ Your Telegram is *already connected* to HackMeet as *${user.username}*. You're all set!`,
            );
            return;
        }

        // ── Link the chat_id ──────────────────────────────────────────────────
        user.telegramChatId = String(chatId);
        await user.save();

        await sendTelegramMessage(
            chatId,
            `🎉 *Successfully Connected!*\n\nYour Telegram is now linked to HackMeet as *${user.username}*.\nYou'll receive team invites and hackathon alerts right here!`,
        );

        console.log(`[Telegram] Linked chatId ${chatId} → userId ${mongoUserId} (${user.username})`);
    } catch (err) {
        console.error("[Telegram] Webhook handler error:", err);
        // res already sent 200 — nothing more to do
    }
};
