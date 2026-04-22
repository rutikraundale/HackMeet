import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "../components/LoadingSkeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const data = await get("/hackathons");
        setHackathons(data.data || []);
      } catch (err) {
        console.error("Failed to fetch hackathons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const handleAction = (type, hackathon) => {
    switch (type) {
      case "CREATE_TEAM":
        if (user?.teamId) return;
        navigate("/team-builder", { state: { hackathonId: hackathon._id, hackathonName: hackathon.name } });
        break;
      case "VIEW_DETAILS":
        navigate(`/hackathon/${hackathon._id}`);
        break;
      default:
        break;
    }
  };

  // Categorize hackathons
  const now = new Date();
  const liveHackathons = hackathons.filter(h => new Date(h.startDate) <= now && new Date(h.endDate) >= now);
  const upcomingHackathons = hackathons.filter(h => new Date(h.startDate) > now);

  const displayHackathons = [...liveHackathons, ...upcomingHackathons];

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Active Hackathons</h1>
          <p className="text-gray-400 mt-1">
            Join elite global builds and connect with engineers.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
            <span className="text-blue-400 font-bold">{liveHackathons.length}</span>
            <span className="text-gray-400 ml-2">Live</span>
          </div>
          <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
            <span className="text-green-400 font-bold">{upcomingHackathons.length}</span>
            <span className="text-gray-400 ml-2">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Hackathon Cards */}
      {loading ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      ) : displayHackathons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/30 rounded-xl border border-slate-700">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Hackathons Available</h3>
          <p className="text-gray-400">Check back soon for upcoming hackathons!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayHackathons.map((hack) => {
            const isLive = new Date(hack.startDate) <= now && new Date(hack.endDate) >= now;
            const isParticipating = !!user?.teamId;
            return (
              <div
                key={hack._id}
                className={`rounded-xl p-5 border ${
                  isLive
                    ? "bg-blue-900/20 border-blue-500"
                    : "bg-gray-900 border-gray-800"
                }`}
              >
                {isLive && (
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                    🔴 LIVE
                  </span>
                )}
                {!isLive && (
                  <span className="text-xs bg-green-600/30 text-green-400 px-2 py-1 rounded">
                    UPCOMING
                  </span>
                )}

                <h3 className="text-xl font-semibold mt-2">{hack.name}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  📅 {new Date(hack.startDate).toLocaleDateString()} – {new Date(hack.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm">📍 {hack.location}</p>
                <p className="text-blue-400 text-xs mt-2">TEAM: up to {hack.teamsize} members</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAction("CREATE_TEAM", hack)}
                    disabled={isParticipating}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      isParticipating 
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600" 
                        : "bg-green-600 hover:bg-green-500 text-white"
                    }`}
                  >
                    {isParticipating ? "Participated" : "Create Team"}
                  </button>
                  <button
                    onClick={() => handleAction("VIEW_DETAILS", hack)}
                    className="bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Matchmaking Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl font-semibold">Looking for a team or developers?</h2>
          <p className="text-gray-400 mt-1 max-w-xl">
            Whether you want to recruit talent for your startup idea or join an existing squad, our matchmaking tools have you covered.
          </p>
          <div className="flex flex-wrap gap-4 mt-5">
            <button
              onClick={() => navigate("/discover")}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
            >
              🔍 Find Developers
            </button>
            <button
              onClick={() => navigate("/find-teams")}
              className="bg-slate-800 text-white border border-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-700 transition font-medium flex items-center gap-2"
            >
              👥 Find Teams
            </button>
          </div>
        </div>

        <div className="flex -space-x-4 shrink-0 mt-4 md:mt-0">
          <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-blue-900 flex items-center justify-center text-xs font-bold text-white z-30">AJ</div>
          <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-green-900 flex items-center justify-center text-xs font-bold text-white z-20">MK</div>
          <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-purple-900 flex items-center justify-center text-xs font-bold text-white z-10">JS</div>
          <div className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-full border-2 border-slate-900 text-xs text-gray-400 z-0">
            +99
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;