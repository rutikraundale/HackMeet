/**
 * register-webhook.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Run this ONCE whenever your public URL changes (e.g. after starting ngrok).
 *
 * Usage:
 *   node register-webhook.js https://YOUR_NGROK_URL
 *
 * Example:
 *   node register-webhook.js https://abc123.ngrok.io
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const [, , publicUrl] = process.argv;

if (!publicUrl) {
    console.error("❌  Usage: node register-webhook.js https://YOUR_PUBLIC_URL");
    process.exit(1);
}

const WEBHOOK_URL = `${publicUrl}/api/telegram/webhook`;
const API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`;

const { data } = await axios.post(API_URL, { url: WEBHOOK_URL });

if (data.ok) {
    console.log(`✅  Webhook registered: ${WEBHOOK_URL}`);
} else {
    console.error("❌  Failed to register webhook:", data);
}
