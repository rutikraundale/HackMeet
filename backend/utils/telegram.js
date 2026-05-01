import axios from "axios";
import User from "../models/user.model.js";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

/**
 * Low-level: send a text message to a specific Telegram chat.
 * @param {string|number} chatId
 * @param {string}        text   – supports Markdown
 */
export const sendTelegramMessage = async (chatId, text, parseMode = "Markdown") => {
    try {
        const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatId,
            text,
            parse_mode: parseMode,
        });
        return res.data;
    } catch (error) {
        console.error("[Telegram] sendMessage error:", error.response?.data || error.message);
        // Don't throw – a Telegram failure should never break the main request
    }
};

/**
 * High-level: look up a user's telegramChatId and send a notification.
 * Silently skips if the user hasn't connected Telegram.
 *
 * @param {string|ObjectId} userId   – MongoDB _id of the recipient
 * @param {string}          message  – Markdown-formatted text to send
 */
export const notifyViaTelegram = async (userId, message) => {
    try {
        const user = await User.findById(userId).select("telegramChatId");
        if (!user?.telegramChatId) return; // not connected – skip silently
        await sendTelegramMessage(user.telegramChatId, message);
    } catch (err) {
        console.error("[Telegram] notifyViaTelegram error:", err.message);
    }
};
