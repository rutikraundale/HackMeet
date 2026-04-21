import React, { useState, useEffect } from "react";
import { Users, GitBranch, Lock } from "lucide-react";
import { get } from "../../utils/api";
import LoadingSkeleton from "../LoadingSkeleton";

const TeamTab = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await get("/teams/my-team");
        setTeam(data.data);
      } catch (err) {
        console.log("No team found or error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-800/30 rounded-xl border border-slate-700">
        <div className="text-4xl mb-4">👥</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">You are not in a team</h3>
        <p className="text-gray-400">Join matchmaking or create your own team to get started.</p>
      </div>
    );
  }

  const hackathonName = team.hackathonId?.name || "Unknown Hackathon";
  const maxMembers = team.hackathonId?.teamsize || 4; // fallback to 4
  const spotsLeft = Math.max(0, maxMembers - team.members.length);

  return (
    <div className="space-y-6">
      {/* Team Header Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{team.teamName}</h2>
            <p className="text-gray-400 text-sm mt-1">🏆 {hackathonName}</p>
          </div>
          {team.islocked && (
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
            {team.members.length} / {maxMembers} members
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
            style={{ width: `${Math.min(100, (team.members.length / maxMembers) * 100)}%` }}
          />
        </div>

        {/* Repo Link */}
        {team.gitRepoLink && (
          <a
            href={team.gitRepoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mt-4 transition"
          >
            <GitBranch size={14} />
            {team.gitRepoLink}
          </a>
        )}
      </div>

      {/* Members */}
      <div>
        <h3 className="text-gray-300 font-medium mb-3">Team Members</h3>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {team.members.map((member, i) => {
             const isLeader = team.teamLeader?._id === member._id || team.teamLeader === member._id;
             const initials = (member.username || "??").slice(0,2).toUpperCase();
             const color = `hsl(${(member.username || "").length * 40}, 40%, 25%)`;
             return (
              <div
                key={member._id || i}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:border-slate-600 transition"
              >
                {member.profilePicture ? (
                   <img src={member.profilePicture} alt={member.username} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                   <div
                     className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                     style={{ backgroundColor: color }}
                   >
                     {initials}
                   </div>
                )}
                <div>
                  <p className="text-white font-medium text-sm">{member.username}</p>
                  <p className="text-gray-400 text-xs">{member.college || "Developer"}</p>
                </div>
                {isLeader && (
                  <span className="ml-auto text-yellow-400 text-sm" title="Team Leader">
                    👑
                  </span>
                )}
              </div>
            );
          })}

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
