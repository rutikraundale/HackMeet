import React from 'react';
import { Users, Users2, Trash2 } from 'lucide-react';

const TeamCard = ({ team, onViewMembers, onDelete, currentUserId }) => {
  const isMember = team.members.includes(currentUserId);
  const memberCount = team.members.length;
  const spotsAvailable = team.maxMembers - memberCount;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{team.name}</h3>
          <p className="text-gray-400 text-sm">{team.hackathon}</p>
        </div>
        {isMember && (
          <span className="px-3 py-1 bg-green-900/30 text-green-300 text-xs rounded-full">
            You're in
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{team.description}</p>

      {/* Team Info */}
      <div className="space-y-3 mb-4">
        {/* Members */}
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Users size={16} className="text-blue-400" />
          <span>{memberCount} / {team.maxMembers} members</span>
          {spotsAvailable > 0 && (
            <span className="text-gray-400">
              ({spotsAvailable} spot{spotsAvailable > 1 ? 's' : ''} available)
            </span>
          )}
        </div>

        {/* Skills needed */}
        <div className="flex flex-wrap gap-2">
          {team.skillsNeeded.map((skill, i) => (
            <span
              key={i}
              className="bg-slate-700 px-2 py-1 rounded text-xs text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Members Preview */}
      <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
        <p className="text-xs text-gray-400 mb-2">Team members:</p>
        <div className="flex flex-wrap gap-2">
          {team.memberNames.map((name, i) => (
            <span
              key={i}
              className="text-xs bg-slate-700 px-2 py-1 rounded text-gray-300"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewMembers(team.id)}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
        >
          <Users2 size={16} />
          View Team
        </button>
        {isMember && (
          <button
            onClick={() => onDelete(team.id)}
            className="px-3 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg text-sm transition"
            title="Leave team"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
