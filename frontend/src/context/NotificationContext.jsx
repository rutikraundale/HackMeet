import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { get, put, del } from "../utils/api";

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
	const { socket } = useSocket();
	const { user } = useAuth();
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		if (user) {
			fetchNotifications();
		}
	}, [user]);

	useEffect(() => {
		if (socket) {
			socket.on("newNotification", (notification) => {
				setNotifications((prev) => [notification, ...prev]);
				setUnreadCount((prev) => prev + 1);
				
				// Optional: Play sound or show browser notification
				if (Notification.permission === "granted") {
					new Notification("HackMeet", {
						body: notification.content,
						icon: "/favicon.ico",
					});
				}
			});

			return () => socket.off("newNotification");
		}
	}, [socket]);

	const fetchNotifications = async () => {
		try {
			const res = await get("/notifications");
			setNotifications(res.data);
			setUnreadCount(res.data.filter((n) => !n.isRead).length);
		} catch (error) {
			console.error("Error fetching notifications:", error);
		}
	};

	const markAsRead = async (id) => {
		try {
			await put(`/notifications/${id}/read`);
			setNotifications((prev) =>
				prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
			);
			setUnreadCount((prev) => Math.max(0, prev - 1));
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	};

	const deleteNotification = async (id) => {
		try {
			await del(`/notifications/${id}`);
			setNotifications((prev) => {
				const filtered = prev.filter((n) => n._id !== id);
				const wasUnread = prev.find((n) => n._id === id && !n.isRead);
				if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
				return filtered;
			});
		} catch (error) {
			console.error("Error deleting notification:", error);
		}
	};

	return (
		<NotificationContext.Provider
			value={{ notifications, unreadCount, markAsRead, deleteNotification, fetchNotifications }}
		>
			{children}
		</NotificationContext.Provider>
	);
};
