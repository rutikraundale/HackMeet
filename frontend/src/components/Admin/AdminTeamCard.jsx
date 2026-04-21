import React, { useState } from "react";
import {
  Users,
  Shield,
  ChevronDown,
  ChevronUp,
  GitBranch,
  Lock,
  Calendar,
} from "lucide-react";
import { getColor, getInitials } from "./adminUtils";

/**
 * AdminTeamCard
 * Displays a single team row with a collapsible detail panel.
 *
 * Props:
 *  - team (object): a team document from MOCK_TEAMS / API
 *    {
 *      _id, teamName, hackathonId, teamLeader, members, gitRepoLink, islocked
 *    }
 */
const AdminTeamCard = ({ team }) => {
  // Controls whether the detail panel is visible
  const [expanded, setExpanded] = useState(false);

  // Safely read nested fields with fallback values
  const hackName = team.hackathonId?.name ?? "—";
  const leaderName = team.teamLeader?.name ?? "Unknown";
  const memberCount = team.members?.length ?? 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition">

      {/* ── Collapsed Header Row (always visible) ── */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Team Avatar (colored initials box) */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: getColor(team.teamName) }}
        >
          {getInitials(team.teamName)}
        </div>

        {/* Team Name + Hackathon Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold truncate">{team.teamName}</h3>
            {/* Show "Locked" badge if team is locked */}
            {team.islocked && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-900/30 text-amber-400 text-xs rounded-full shrink-0">
                <Lock size={10} /> Locked
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm truncate">🏆 {hackName}</p>
        </div>

        {/* Member count + leader name (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-blue-400" />
            {memberCount} member{memberCount !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Shield size={14} className="text-purple-400" />
            {leaderName}
          </span>
        </div>

        {/* Expand / Collapse icon */}
        <div className="text-gray-500 shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* ── Expanded Detail Panel ── */}
      {expanded && (
        <div className="border-t border-slate-700 bg-slate-900/50 px-5 pb-5 pt-4 space-y-4">

          {/* Member Chips */}
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">
              Team Members
            </p>
            <div className="flex flex-wrap gap-2">
              {(team.members ?? []).map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 rounded-lg"
                >
                  {/* Member avatar */}
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: getColor(m.name) }}
                  >
                    {getInitials(m.name)}
                  </div>
                  <span className="text-gray-300 text-sm">{m.name}</span>
                  {/* Crown emoji for the team leader */}
                  {m.name === leaderName && (
                    <span className="text-xs text-yellow-400">👑</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Git Repository Link */}
          {team.gitRepoLink && (
            <div>
              <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">
                Repository
              </p>
              <a
                href={team.gitRepoLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition"
              >
                <GitBranch size={14} />
                {team.gitRepoLink}
              </a>
            </div>
          )}

          {/* Hackathon Date Range */}
          {team.hackathonId?.startDate && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar size={14} />
              {new Date(team.hackathonId.startDate).toLocaleDateString()} –{" "}
              {new Date(team.hackathonId.endDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTeamCard;
