import Notification from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getNotifications = async (req, res) => {
	try {
		const userId = req.user._id;
		const notifications = await Notification.find({ recipient: userId })
			.sort({ createdAt: -1 })
			.populate("sender", "username profilePicture");

		res.status(200).json({ success: true, data: notifications });
	} catch (error) {
		console.log("Error in getNotifications controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const { id } = req.params;
		const notification = await Notification.findByIdAndUpdate(
			id,
			{ isRead: true },
			{ new: true }
		);

		res.status(200).json({ success: true, data: notification });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteNotification = async (req, res) => {
	try {
		const { id } = req.params;
		await Notification.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Notification deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

// Helper function to create and emit notification
export const createNotification = async (recipientId, senderId, type, content, link) => {
	try {
		const notification = new Notification({
			recipient: recipientId,
			sender: senderId,
			type,
			content,
			link,
		});

		await notification.save();

		const populatedNotification = await notification.populate("sender", "username profilePicture");

		const receiverSocketId = getReceiverSocketId(recipientId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newNotification", populatedNotification);
		}
	} catch (error) {
	}
};
