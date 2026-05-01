import React, { useState, useRef, useEffect } from "react";
import { Bell, X, Check, Trash2 } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
	const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleNotificationClick = (notification) => {
		markAsRead(notification._id);
		navigate(notification.link);
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="p-2 min-w-[44px] min-h-[44px] rounded-full hover:bg-slate-800 transition relative text-gray-300 flex items-center justify-center"
			>
				<Bell className="w-5 h-5" />
				{unreadCount > 0 && (
					<span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900">
						{unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<>
					{/* Backdrop for mobile */}
					<div 
						className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] md:hidden"
						onClick={() => setIsOpen(false)}
					/>
					
					/* notification-dropdown enables mobile width fix via index.css */
					<div className="notification-dropdown absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-200">
						<div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
							<h3 className="font-semibold text-white">Notifications</h3>
							<button 
								onClick={() => setIsOpen(false)} 
								className="text-gray-400 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

					<div className="max-h-96 overflow-y-auto">
						{notifications.length === 0 ? (
							<div className="p-8 text-center text-gray-500">
								<Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
								<p>No notifications yet</p>
							</div>
						) : (
							notifications.map((n) => (
								<div
									key={n._id}
									className={`p-3 md:p-4 border-b border-slate-700/50 flex gap-2 md:gap-3 hover:bg-slate-700/30 transition cursor-pointer relative group ${
										!n.isRead ? "bg-blue-500/5" : ""
									}`}
									onClick={() => handleNotificationClick(n)}
								>
									<div className="relative shrink-0">
										<img loading="lazy"
											src={n.sender?.profilePic || n.sender?.profilePicture || "/default-avatar.png"}
											alt=""
											className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-slate-600"
										/>
										{!n.isRead && (
											<div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-500 rounded-full border-2 border-slate-800"></div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs md:text-sm text-gray-200 leading-snug">
											{n.type === "hackathon" ? (
												<span className="font-semibold text-blue-400">New Hackathon</span>
											) : (
												<span className="font-semibold text-white">{n.sender?.username}</span>
											)}{" "}
											{n.content}
										</p>
										<p className="text-[10px] md:text-xs text-gray-500 mt-1">
											{new Date(n.createdAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
									<div className="flex flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition shrink-0 self-center">
										{!n.isRead && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													markAsRead(n._id);
												}}
												className="p-1.5 hover:text-blue-400 text-gray-400 bg-slate-700/50 md:bg-transparent rounded-md"
												title="Mark as read"
											>
												<Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
											</button>
										)}
										<button
											onClick={(e) => {
												e.stopPropagation();
												deleteNotification(n._id);
											}}
											className="p-1.5 hover:text-red-400 text-gray-400 bg-slate-700/50 md:bg-transparent rounded-md"
											title="Delete"
										>
											<Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
										</button>
									</div>
								</div>
							))
						)}
					</div>

					{notifications.length > 0 && (
						<div className="p-3 text-center bg-slate-900/50 border-t border-slate-700">
							<button
								onClick={() => navigate("/notifications")}
								className="text-xs text-blue-400 hover:text-blue-300 font-medium"
							>
								View all notifications
							</button>
						</div>
					)}
					</div>
				</>
			)}
		</div>
	);
};

export default NotificationBell;
