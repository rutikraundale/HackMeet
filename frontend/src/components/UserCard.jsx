import React from 'react';
import { MessageCircle, User as UserIcon, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user, compatibility, onInvite, isInvited }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/users-profile/${user.id}`);
  };

  const handleChat = () => {
    navigate(`/messages/${user.id}`);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition">
      {/* Avatar with color */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="w-14 h-14 rounded-lg object-cover" />
          ) : (
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: user.color }}
            >
              {user.initials}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-white font-semibold">{user.name}</h3>
            <p className="text-gray-400 text-sm">{user.role}</p>
          </div>
        </div>

        {/* Compatibility Badge */}
        {compatibility !== null && (
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-400">{compatibility}%</span>
            <span className="text-xs text-gray-400">Match</span>
          </div>
        )}
      </div>

      {/* Location */}
      <p className="text-gray-400 text-xs mb-3">📍 {user.location}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {user.skills.slice(0, 3).map((skill, i) => (
          <span
            key={i}
            className="bg-slate-700 px-2 py-1 rounded text-xs text-gray-300 hover:bg-slate-600 transition"
          >
            {skill}
          </span>
        ))}
        {user.skills.length > 3 && (
          <span className="bg-slate-700 px-2 py-1 rounded text-xs text-gray-400">
            +{user.skills.length - 3}
          </span>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          user.status === 'open'
            ? 'bg-green-900/30 text-green-300'
            : 'bg-yellow-900/30 text-yellow-300'
        }`}>
          {user.status === 'open' ? '✓ Open to team up' : '⏳ Busy'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleViewProfile}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-2 py-2 rounded-lg text-sm transition flex items-center justify-center gap-1"
        >
          <UserIcon size={14} />
          Profile
        </button>
        <button
          onClick={handleChat}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-2 py-2 rounded-lg text-sm transition flex items-center justify-center gap-1"
        >
          <MessageCircle size={14} />
          Chat
        </button>
        {onInvite && (
          <button
            onClick={() => onInvite(user.id)}
            disabled={isInvited}
            className={`flex-1 px-2 py-2 rounded-lg text-sm transition flex items-center justify-center gap-1 ${
              isInvited
                ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <UserPlus size={14} />
            {isInvited ? 'Invited' : 'Invite'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
