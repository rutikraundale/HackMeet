import express from "express";
import verifyAccessToken from "../middleware/verifyToken.js";
import { getNotifications, markAsRead, deleteNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", verifyAccessToken, getNotifications);
router.put("/:id/read", verifyAccessToken, markAsRead);
router.delete("/:id", verifyAccessToken, deleteNotification);

export default router;
