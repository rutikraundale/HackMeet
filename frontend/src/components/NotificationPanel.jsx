import React, { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import NotificationItem from './NotificationItem';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'invite',
      title: 'Team Invite from Cloud Mavericks',
      message: 'You\'ve been invited to join our team for Web3 Global Build',
      time: '2 min ago'
    },
    {
      id: 2,
      type: 'message',
      title: 'New message from Sarah Chen',
      message: 'Hey! Are you interested in our hackathon team?',
      time: '15 min ago'
    },
    {
      id: 3,
      type: 'invite',
      title: 'Team Invite from AI Builders',
      message: 'Join us for an exciting AI project this weekend',
      time: '1 hour ago'
    },
    {
      id: 4,
      type: 'team',
      title: 'Your team was selected!',
      message: 'Congratulations! Your team made it to the finals.',
      time: '2 hours ago'
    }
  ]);

  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleAccept = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleReject = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={onClose} />
      )}
      
      <div
        ref={panelRef}
        className={`absolute top-16 right-6 w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 transform transition-all duration-200 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-blue-400" />
            <h3 className="text-white font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-bold">
                {notifications.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded transition"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell size={32} className="text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm">All caught up!</p>
              <p className="text-gray-500 text-xs">No new notifications</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-800">
            <button
              onClick={handleClearAll}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-300 py-2 transition"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
