import React, { useState, useEffect } from "react";
import { Users, ShieldCheck, Clock, Check, Calendar, Trophy, MapPin } from "lucide-react";
import { get, post } from "../utils/api";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const FindTeams = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);
  // hackathonId the user is already participating in (null if none)
  const [activeHackathonId, setActiveHackathonId] = useState(null);

  const fetchOpenTeams = async () => {
    setLoading(true);
    try {
      const [teamsData, myTeamData] = await Promise.all([
        get("/teams/open"),
        get("/teams/my-team").catch(() => ({ data: null }))
      ]);
      setTeams(teamsData.data || []);
      if (myTeamData?.data?.hackathonId) {
        setActiveHackathonId(myTeamData.data.hackathonId._id || myTeamData.data.hackathonId);
      }
    } catch (err) {
      console.error("Error fetching open teams:", err);
      addToast(err.message || "Failed to load open teams", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenTeams();
  }, []);

  const handleRequestJoin = async (team) => {
    if (user?.status === "busy") {
      addToast("Your status is 'Busy'. Update it to 'Open' in your profile first.", "warning");
      return;
    }
    const teamHackathonId = team.hackathonId?._id || team.hackathonId;
    const alreadyIn = activeHackathonId && activeHackathonId.toString() === teamHackathonId?.toString();
    if (alreadyIn) {
      addToast("You are already in a team for this hackathon.", "warning");
      return;
    }
    setRequesting(team._id);
    try {
      await post(`/teams/${team._id}/request`);
      addToast("Join request sent successfully to the team leader!", "success");
      setTeams(prev => prev.map(t => {
        if (t._id === team._id) {
          return { ...t, joinRequests: [...(t.joinRequests || []), user._id] };
        }
        return t;
      }));
    } catch (err) {
      addToast(err.message || "Failed to send request", "error");
    } finally {
      setRequesting(null);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-950 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Find Teams</h1>
        <p className="text-gray-400 text-sm">
          Browse active teams looking for new members and request to join them.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-xl border border-slate-800">
          <span className="text-5xl mb-4">🏜️</span>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Open Teams</h3>
          <p className="text-gray-500">All teams are currently full or locked. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const hackathon = team.hackathonId || {};
            const maxSize = hackathon.teamsize || 4;
            const currentSize = team.members.length;
            const spotsLeft = Math.max(0, maxSize - currentSize);
            const hasRequested = team.joinRequests?.includes(user?._id);
            const teamHackathonId = hackathon._id || hackathon;
            const alreadyInThisHackathon = activeHackathonId && activeHackathonId.toString() === teamHackathonId?.toString();
            const isBusy = user?.status === "busy";
            const canRequest = !hasRequested && !alreadyInThisHackathon && !isBusy;

            return (
              <div
                key={team._id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{team.teamName}</h3>
                    <p className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                      <ShieldCheck size={12} /> Leader: {team.teamLeader?.username}
                    </p>
                  </div>
                  <div className="bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs font-medium border border-green-500/30 whitespace-nowrap">
                    {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-5">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Target Hackathon</p>
                    <p className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                      <Trophy size={14} className="text-yellow-500" />
                      {hackathon.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                      <Calendar size={12} /> {new Date(hackathon.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRequestJoin(team)}
                  disabled={!canRequest || requesting === team._id}
                  title={alreadyInThisHackathon ? "Already in a team for this hackathon" : isBusy ? "Set status to Open first" : ""}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition flex justify-center items-center gap-2 ${
                    hasRequested
                      ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                      : alreadyInThisHackathon
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                      : isBusy
                      ? 'bg-yellow-900/40 text-yellow-500 cursor-not-allowed border border-yellow-700/40'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {requesting === team._id ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : hasRequested ? (
                    <><Check size={16} /> Request Sent</>
                  ) : alreadyInThisHackathon ? (
                    <><Users size={16} /> ✅ Participating</>
                  ) : isBusy ? (
                    <><Clock size={16} /> Busy</>
                  ) : (
                    <><Users size={16} /> Request to Join</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FindTeams;
