import React from 'react';
import { Check, X } from 'lucide-react';
import { showToast } from '../utils/toastUtils';

const NotificationItem = ({ notification, onAccept, onReject }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'invite':
        return '👥';
      case 'message':
        return '💬';
      case 'team':
        return '🏆';
      default:
        return '🔔';
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'invite':
        return 'border-blue-600/40 bg-blue-900/20';
      case 'message':
        return 'border-purple-600/40 bg-purple-900/20';
      case 'team':
        return 'border-green-600/40 bg-green-900/20';
      default:
        return 'border-gray-600/40 bg-gray-900/20';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getTypeColor()} text-white space-y-2`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{getIcon()}</span>
          <div>
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">{notification.time}</span>
      </div>
      
      {notification.type === 'invite' && (
        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={() => {
              onReject(notification.id);
              showToast('Invitation rejected', 'info');
            }}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition flex items-center gap-1"
          >
            <X size={12} />
            Reject
          </button>
          <button
            onClick={() => {
              onAccept(notification.id);
              showToast('Invitation accepted! ✨', 'success');
            }}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition flex items-center gap-1"
          >
            <Check size={12} />
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
