import React from "react";
import { Users, GitBranch, Lock } from "lucide-react";

// Mock data — replace with real API data when backend is ready
const mockTeam = {
  name: "Team Syntax",
  hackathon: "Web3 Global Build Hackathon",
  members: [
    { name: "Ravi Sahane", role: "Team Leader", initials: "RS", color: "#1a3a5c" },
    { name: "Sarah Chen", role: "Frontend Dev", initials: "SC", color: "#2d1a5c" },
    { name: "Jordan Lee", role: "Backend Dev", initials: "JL", color: "#1a3d2b" },
  ],
  gitRepo: "https://github.com/team-syntax/web3-build",
  isLocked: false,
  maxMembers: 5,
};

const TeamTab = () => {
  const team = mockTeam;
  const spotsLeft = team.maxMembers - team.members.length;

  return (
    <div className="space-y-6">
      {/* Team Header Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{team.name}</h2>
            <p className="text-gray-400 text-sm mt-1">🏆 {team.hackathon}</p>
          </div>
          {team.isLocked && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-900/30 text-amber-400 border border-amber-500/30 rounded-full text-xs">
              <Lock size={12} />
              Locked
            </span>
          )}
        </div>

        {/* Capacity Bar */}
        <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-blue-400" />
            {team.members.length} / {team.maxMembers} members
          </span>
          {spotsLeft > 0 ? (
            <span className="text-green-400 text-xs">{spotsLeft} spot{spotsLeft > 1 ? "s" : ""} open</span>
          ) : (
            <span className="text-amber-400 text-xs">Team full</span>
          )}
        </div>
        <div className="bg-slate-900 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${(team.members.length / team.maxMembers) * 100}%` }}
          />
        </div>

        {/* Repo Link */}
        {team.gitRepo && (
          <a
            href={team.gitRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mt-4 transition"
          >
            <GitBranch size={14} />
            {team.gitRepo}
          </a>
        )}
      </div>

      {/* Members */}
      <div>
        <h3 className="text-gray-300 font-medium mb-3">Team Members</h3>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {team.members.map((member, i) => (
            <div
              key={i}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:border-slate-600 transition"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{member.name}</p>
                <p className="text-gray-400 text-xs">{member.role}</p>
              </div>
              {i === 0 && (
                <span className="ml-auto text-yellow-400 text-sm" title="Team Leader">
                  👑
                </span>
              )}
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: spotsLeft }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="bg-slate-800/40 border border-slate-700 border-dashed rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-gray-600">
                <Users size={16} />
              </div>
              <p className="text-gray-600 text-sm">Open spot</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamTab;
