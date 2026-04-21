import React, { useState, useEffect } from "react";
import { Trophy, MapPin, Calendar, Users, Gift } from "lucide-react";
import HackathonForm from "../components/Admin/HackathonForm";
import AdminTeamCard from "../components/Admin/AdminTeamCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { get } from "../utils/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [hackathons, setHackathons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingHacks, setLoadingHacks] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // Fetch hackathons
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const data = await get("/hackathons");
        setHackathons(data.data || []);
      } catch (err) {
        console.error("Failed to fetch hackathons:", err);
      } finally {
        setLoadingHacks(false);
      }
    };
    fetchHackathons();
  }, []);

  // Fetch all teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await get("/admin/teams");
        setTeams(data.data || []);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, []);

  // After creating a hackathon, add it to local state
  const handleCreated = (hackathon) => {
    setHackathons((prev) => [hackathon, ...prev]);
  };

  const tabClass = (tab) =>
    `pb-3 font-medium transition text-sm ${activeTab === tab
      ? "border-b-2 border-blue-500 text-blue-400"
      : "text-gray-400 hover:text-gray-300"
    }`;

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-gray-400 text-sm ">
            Manage hackathons and review all registered teams
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-center">
            <p className="text-2xl font-bold text-blue-400">{hackathons.length}</p>
            <p className="text-gray-400 text-xs">Hackathons</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-center">
            <p className="text-2xl font-bold text-purple-400">{teams.length}</p>
            <p className="text-gray-400 text-xs">Teams</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-8 border-b border-slate-700 mb-8">
        <button id="admin-tab-create" onClick={() => setActiveTab("create")} className={tabClass("create")}>
           Create Hackathon
        </button>
        <button id="admin-tab-hackathons" onClick={() => setActiveTab("hackathons")} className={tabClass("hackathons")}>
           All Hackathons ({hackathons.length})
        </button>
        <button id="admin-tab-teams" onClick={() => setActiveTab("teams")} className={tabClass("teams")}>
           All Teams ({teams.length})
        </button>
      </div>

      {/* CREATE TAB */}
      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto">
          <HackathonForm
            onCreated={(h) => {
              handleCreated(h);
              setActiveTab("hackathons");
            }}
          />
        </div>
      )}

      {/* HACKATHONS TAB */}
      {activeTab === "hackathons" && (
        <div>
          {loadingHacks ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} variant="card" />
              ))}
            </div>
          ) : hackathons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Hackathons Yet</h3>
              <p className="text-gray-400 mb-6">Create your first hackathon to get started!</p>
              <button
                onClick={() => setActiveTab("create")}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-medium"
              >
                Create Hackathon
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {hackathons.map((h) => (
                <div
                  key={h._id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <Trophy size={16} className="text-blue-400" />
                    </div>
                    <span className="text-xs bg-green-900/40 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  <h3 className="text-white font-semibold text-base mb-1">{h.name}</h3>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">{h.description}</p>

                  <div className="space-y-1.5 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-blue-400" />
                      {h.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-purple-400" />
                      {new Date(h.startDate).toLocaleDateString()} – {new Date(h.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={12} className="text-green-400" />
                      Max {h.teamsize} per team
                    </div>
                  </div>

                  {h.prizes?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                        <Gift size={10} /> Prizes
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {h.prizes.map((p, i) => (
                          <span
                            key={i}
                            className="text-xs bg-amber-900/30 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TEAMS TAB */}
      {activeTab === "teams" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-400 text-sm">
              Showing <span className="text-white font-medium">{teams.length}</span> teams across all hackathons
            </p>
          </div>

          {loadingTeams ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} variant="card" />
              ))}
            </div>
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Teams Registered</h3>
              <p className="text-gray-400">Teams will appear here once participants register.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <AdminTeamCard key={team._id} team={team} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
