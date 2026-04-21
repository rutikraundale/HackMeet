import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import LoadingSkeleton from "../components/LoadingSkeleton";

const Dashboard = () => {
  const navigate = useNavigate();
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
                    className="bg-green-600 px-3 py-2 rounded-lg hover:bg-green-500 text-sm"
                  >
                    Create Team
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
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Can't find a partner?</h2>
          <p className="text-gray-400 mt-1">
            Join matchmaking pool and get paired with builders.
          </p>
          <button
            onClick={() => navigate("/discover")}
            className="mt-4 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Join Matchmaking
          </button>
        </div>

        <div className="flex -space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-sm">
            +42
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;