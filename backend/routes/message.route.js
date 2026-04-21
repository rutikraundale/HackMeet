import express from "express";
import { getMessages, sendMessage, getConversations } from "../controllers/message.controller.js";
import verifyAccessToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyAccessToken);

// Route ordering is extremely important. conversations has to go first before it is caught by params :id
router.get("/conversations", getConversations);
router.get("/:otherUserId", getMessages);
router.post("/:receiverId", sendMessage);

export default router;
