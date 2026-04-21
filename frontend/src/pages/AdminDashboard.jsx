import React, { useState } from "react";
import { Shield, Trophy, MapPin, Calendar, Users, Gift } from "lucide-react";

// ── Child components ───────────────────────────────────────────────────────────
import HackathonForm from "../components/Admin/HackathonForm";
import AdminTeamCard from "../components/Admin/AdminTeamCard";



/**
 * AdminDashboard
 * Main container for the Admin Panel.
 *
 * Responsibilities:
 *  - Manages top-level state: active tab, hackathons list, teams list
 *  - Handles tab switching
 *  - Passes callbacks down to child components
 */
const AdminDashboard = () => {




  // Which tab is currently visible: "create" | "hackathons" | "teams"
  const [activeTab, setActiveTab] = useState("create");

  // List of hackathons created by the admin during this session
  const [hackathons, setHackathons] = useState([]);

  // Teams list (static mock data for now)
  
  
  const MOCK_TEAMS = [
  {
    _id: "t1",
    teamName: "Web3 Warriors",
    hackathonId: {
      name: "Web3 Global Build",
      startDate: "2024-12-01",
      endDate: "2024-12-15",
    },
    teamLeader: { name: "Sarah Chen", email: "sarah@example.com" },
    members: [
      { name: "Sarah Chen" },
      { name: "Jordan Lee" },
      { name: "Priya Nair" },
    ],
    gitRepoLink: "https://github.com/web3warriors/repo",
    islocked: false,
  },
  {
    _id: "t2",
    teamName: "AI Innovators",
    hackathonId: {
      name: "AI Agent Workshop",
      startDate: "2024-11-22",
      endDate: "2024-11-24",
    },
    teamLeader: { name: "Marcus Kim", email: "marcus@example.com" },
    members: [{ name: "Marcus Kim" }, { name: "Aisha Patel" }],
    gitRepoLink: "https://github.com/aiinnovators/repo",
    islocked: true,
  },
  {
    _id: "t3",
    teamName: "ClimaTech Squad",
    hackathonId: {
      name: "Climate Tech Hackathon",
      startDate: "2025-01-10",
      endDate: "2025-01-12",
    },
    teamLeader: { name: "Lucas Berg", email: "lucas@example.com" },
    members: [
      { name: "Lucas Berg" },
      { name: "Ravi Sahane" },
      { name: "Jordan Lee" },
      { name: "Priya Nair" },
    ],
    gitRepoLink: "https://github.com/climatech/repo",
    islocked: false,
  },
];
  const [teams] = useState(MOCK_TEAMS);
  


  // ── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Called by HackathonForm after a successful submit.
   * Adds the new hackathon to the top of the list.
   */
  const handleCreated = (hackathon) => {
    setHackathons((prev) => [
      { ...hackathon, _id: `h${Date.now()}`, createdAt: new Date() },
      ...prev,
    ]);
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────

  // Returns Tailwind classes for each tab button (active vs inactive styles)
  const tabClass = (tab) =>
    `pb-3 font-medium transition text-sm ${activeTab === tab
      ? "border-b-2 border-blue-500 text-blue-400"
      : "text-gray-400 hover:text-gray-300"
    }`;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">

            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-gray-400 text-sm ">
            Manage hackathons and review all registered teams
          </p>
        </div>

        {/* Quick-stats chips (hidden on mobile) */}
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

      {/* ── Tab Navigation ───────────────────────────────────────────────────── */}
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

      {/* ── CREATE TAB ──────────────────────────────────────────────────────── */}
      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto">
          {/*
            After a hackathon is created:
            1. Add it to state via handleCreated
            2. Switch to the "hackathons" tab automatically
          */}
          <HackathonForm
            onCreated={(h) => {
              handleCreated(h);
              setActiveTab("hackathons");
            }}
          />
        </div>
      )}

      {/* ── HACKATHONS TAB ──────────────────────────────────────────────────── */}
      {activeTab === "hackathons" && (
        <div>
          {hackathons.length === 0 ? (
            /* Empty state */
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
            /* Hackathon cards grid */
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {hackathons.map((h) => (
                <div
                  key={h._id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition"
                >
                  {/* Card header: trophy icon + Active badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <Trophy size={16} className="text-blue-400" />
                    </div>
                    <span className="text-xs bg-green-900/40 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Name & description */}
                  <h3 className="text-white font-semibold text-base mb-1">{h.name}</h3>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">{h.description}</p>

                  {/* Location, dates, team size */}
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

                  {/* Prizes (only shown if prizes exist) */}
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

      {/* ── TEAMS TAB ───────────────────────────────────────────────────────── */}
      {activeTab === "teams" && (
        <div>
          {/* Summary line */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-400 text-sm">
              Showing <span className="text-white font-medium">{teams.length}</span> teams across all hackathons
            </p>
          </div>

          {teams.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Teams Registered</h3>
              <p className="text-gray-400">Teams will appear here once participants register.</p>
            </div>
          ) : (
            /* One AdminTeamCard per team */
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
