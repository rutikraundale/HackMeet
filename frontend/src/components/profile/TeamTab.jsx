import React, { useState, useEffect } from "react";
import { Users, GitBranch, Lock, Settings, LogOut, Trash2, UserMinus, Check, X } from "lucide-react";
import { get, del, post, put } from "../../utils/api";
import LoadingSkeleton from "../LoadingSkeleton";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const TeamTab = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await get("/teams/my-team");
      setTeam(data.data);
      if (data.data) {
        setEditName(data.data.teamName);
      }
    } catch (err) {
      console.log("No team found or error:", err);
      setTeam(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleLeaveTeam = async () => {
    if (!window.confirm("Are you sure you want to leave this team?")) return;
    setProcessing(true);
    try {
      await post("/teams/leave");
      addToast("You left the team.", "success");
      fetchTeam();
    } catch (err) {
      addToast(err.message || "Failed to leave team", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm("Are you sure you want to delete this team? This action is permanent and removes all members.")) return;
    setProcessing(true);
    try {
      await del(`/teams/${team._id}`);
      addToast("Team deleted successfully.", "success");
      fetchTeam();
    } catch (err) {
      addToast(err.message || "Failed to delete team", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    setProcessing(true);
    try {
      await del(`/teams/${team._id}/members/${memberId}`);
      addToast("Member removed successfully.", "success");
      fetchTeam();
    } catch (err) {
      addToast(err.message || "Failed to remove member", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateTeam = async () => {
    if (!editName.trim()) return;
    setProcessing(true);
    try {
      await put(`/teams/${team._id}`, { teamName: editName });
      addToast("Team updated successfully.", "success");
      setIsEditing(false);
      fetchTeam();
    } catch (err) {
      addToast(err.message || "Failed to update team", "error");
    } finally {
      setProcessing(false);
    }
  };

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
  const isLeader = team.teamLeader?._id === user._id || team.teamLeader === user._id;

  return (
    <div className="space-y-6">
      {/* Team Header Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2 mb-1">
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-lg font-bold w-full max-w-xs focus:outline-none focus:border-blue-500"
                />
                <button onClick={handleUpdateTeam} disabled={processing} className="p-1.5 bg-green-900/30 text-green-400 hover:bg-green-900/50 rounded">
                  <Check size={16} />
                </button>
                <button onClick={() => setIsEditing(false)} disabled={processing} className="p-1.5 bg-slate-700 text-gray-300 hover:bg-slate-600 rounded">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{team.teamName}</h2>
                {isLeader && (
                  <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white transition">
                    <Settings size={14} />
                  </button>
                )}
              </div>
            )}
            <p className="text-gray-400 text-sm mt-1">🏆 {hackathonName}</p>
          </div>
          
          <div className="flex gap-2">
            {team.islocked && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-900/30 text-amber-400 border border-amber-500/30 rounded-full text-xs h-fit">
                <Lock size={12} />
                Locked
              </span>
            )}
            
            {/* Action Buttons based on role */}
            {isLeader ? (
              <button 
                onClick={handleDeleteTeam}
                disabled={processing}
                className="flex items-center gap-1.5 px-3 py-1 bg-red-900/30 text-red-400 border border-red-500/30 rounded-full text-xs hover:bg-red-900/50 transition h-fit disabled:opacity-50"
              >
                <Trash2 size={12} />
                Delete Team
              </button>
            ) : (
              <button 
                onClick={handleLeaveTeam}
                disabled={processing}
                className="flex items-center gap-1.5 px-3 py-1 bg-red-900/30 text-red-400 border border-red-500/30 rounded-full text-xs hover:bg-red-900/50 transition h-fit disabled:opacity-50"
              >
                <LogOut size={12} />
                Leave Team
              </button>
            )}
          </div>
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
             const memberIsLeader = team.teamLeader?._id === member._id || team.teamLeader === member._id;
             const isMe = member._id === user._id;
             const initials = (member.username || "??").slice(0,2).toUpperCase();
             const color = `hsl(${(member.username || "").length * 40}, 40%, 25%)`;
             return (
              <div
                key={member._id || i}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:border-slate-600 transition relative group"
              >
                {member.profilePicture ? (
                   <img loading="lazy" src={member.profilePicture} alt={member.username} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                   <div
                     className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                     style={{ backgroundColor: color }}
                   >
                     {initials}
                   </div>
                )}
                <div>
                  <p className="text-white font-medium text-sm">
                    {member.username} {isMe && <span className="text-gray-500 text-xs">(You)</span>}
                  </p>
                  <p className="text-gray-400 text-xs">{member.college || "Developer"}</p>
                </div>
                {memberIsLeader ? (
                  <span className="ml-auto text-yellow-400 text-sm" title="Team Leader">
                    👑
                  </span>
                ) : isLeader && !isMe ? (
                  <button 
                    onClick={() => handleRemoveMember(member._id)}
                    disabled={processing}
                    className="ml-auto p-2 bg-red-900/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900/40"
                    title="Remove Member"
                  >
                    <UserMinus size={14} />
                  </button>
                ) : null}
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

      {/* Join Requests (Leader Only) */}
      {isLeader && team.joinRequests && team.joinRequests.length > 0 && (
        <div className="mt-8 border-t border-slate-700 pt-6">
          <h3 className="text-gray-300 font-medium mb-3 flex items-center gap-2">
            Incoming Join Requests
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {team.joinRequests.length}
            </span>
          </h3>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {team.joinRequests.map((reqUser) => (
              <div
                key={reqUser._id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4"
              >
                {reqUser.profilePicture ? (
                  <img loading="lazy" src={reqUser.profilePicture} alt={reqUser.username} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 bg-blue-900/50">
                    {(reqUser.username || "??").slice(0,2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{reqUser.username}</p>
                  <p className="text-gray-400 text-xs truncate">{reqUser.college || "Developer"}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={async () => {
                      setProcessing(true);
                      try {
                        await post(`/teams/${team._id}/accept-request/${reqUser._id}`);
                        addToast(`Accepted ${reqUser.username}'s request!`, "success");
                        fetchTeam();
                      } catch (err) {
                        addToast(err.message || "Failed to accept request", "error");
                      } finally {
                        setProcessing(false);
                      }
                    }}
                    disabled={processing}
                    className="p-1.5 bg-green-900/30 text-green-400 hover:bg-green-900/50 rounded-lg transition"
                    title="Accept"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={async () => {
                      setProcessing(true);
                      try {
                        await post(`/teams/${team._id}/reject-request/${reqUser._id}`);
                        addToast(`Rejected ${reqUser.username}'s request`, "warning");
                        fetchTeam();
                      } catch (err) {
                        addToast(err.message || "Failed to reject request", "error");
                      } finally {
                        setProcessing(false);
                      }
                    }}
                    disabled={processing}
                    className="p-1.5 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition"
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTab;
