import React from "react";
import { useNotifications } from "../context/NotificationContext";
import { Bell, Check, Trash2, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
	const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();
	const navigate = useNavigate();

	const handleNotificationClick = (notification) => {
		markAsRead(notification._id);
		if (notification.link) {
			navigate(notification.link);
		}
	};

	return (
		<div className="p-4 md:p-8 bg-gray-950 min-h-screen text-white">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold mb-2">Notifications</h1>
						<p className="text-gray-400">Stay updated with your latest activities</p>
					</div>
					{unreadCount > 0 && (
						<div className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-sm font-medium">
							{unreadCount} New
						</div>
					)}
				</div>

				{notifications.length === 0 ? (
					<div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
						<div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
							<Bell className="w-10 h-10 text-gray-500 opacity-50" />
						</div>
						<h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
						<p className="text-gray-500 max-w-sm mx-auto">
							When you get invitations, messages, or hackathon updates, they will appear here.
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{notifications.map((n) => (
							<div
								key={n._id}
								onClick={() => handleNotificationClick(n)}
								className={`group relative bg-slate-900 border transition-all duration-300 rounded-2xl p-5 flex gap-5 items-start cursor-pointer ${
									!n.isRead 
										? "border-blue-500/50 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
										: "border-slate-800 hover:border-slate-700"
								}`}
							>
								{/* Avatar */}
								<div className="relative shrink-0">
									<img
										src={n.sender?.profilePicture || "/default-avatar.png"}
										alt=""
										className="w-12 h-12 rounded-full object-cover border-2 border-slate-800"
									/>
									{!n.isRead && (
										<div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
									)}
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-start mb-1">
										<p className="text-gray-100 leading-relaxed">
											{n.type === "hackathon" ? (
												<span className="font-bold text-blue-400 text-lg">New Hackathon</span>
											) : (
												<span className="font-bold text-white text-lg">{n.sender?.username}</span>
											)}{" "}
											<span className="text-gray-300">{n.content}</span>
										</p>
									</div>
									
									<div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
										<span className="flex items-center gap-1">
											<Clock size={12} />
											{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
										</span>
										{n.link && (
											<button 
												onClick={() => handleNotificationClick(n)}
												className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
											>
												<ExternalLink size={12} />
												View Details
											</button>
										)}
									</div>
								</div>

								{/* Actions */}
								<div className="flex flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									{!n.isRead && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												markAsRead(n._id);
											}}
											className="p-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all border border-blue-500/20"
											title="Mark as read"
										>
											<Check size={18} />
										</button>
									)}
									<button
										onClick={(e) => {
											e.stopPropagation();
											deleteNotification(n._id);
										}}
										className="p-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-500/20"
										title="Delete"
									>
										<Trash2 size={18} />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Notifications;
