import React, { useState, useEffect } from "react";
import { Trophy, MapPin, Calendar, Users, Gift, Trash2, StopCircle, Edit } from "lucide-react";
import HackathonForm from "../components/Admin/HackathonForm";
import AdminTeamCard from "../components/Admin/AdminTeamCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { get, put, patch, del } from "../utils/api";
import { useToast } from "../context/ToastContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [segmentedHacks, setSegmentedHacks] = useState({ live: [], upcoming: [], past: [] });
  const [teams, setTeams] = useState([]);
  const [loadingHacks, setLoadingHacks] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [editingHack, setEditingHack] = useState(null);
  const { addToast } = useToast();

  // Fetch hackathons
  const fetchHackathons = async () => {
    setLoadingHacks(true);
    try {
      const data = await get("/admin/hackathons");
      setSegmentedHacks(data.data || { live: [], upcoming: [], past: [] });
    } catch (err) {
      console.error("Failed to fetch hackathons:", err);
    } finally {
      setLoadingHacks(false);
    }
  };

  useEffect(() => {
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

  const handleCreated = () => {
    fetchHackathons();
    setActiveTab("hackathons");
  };

  const handleTerminate = async (id) => {
    if (!window.confirm("Are you sure you want to terminate this hackathon? This will move it to the previous hackathons section.")) return;
    try {
      await patch(`/admin/hackathons/${id}/terminate`);
      addToast("Hackathon terminated successfully", "success");
      fetchHackathons();
    } catch (err) {
      addToast(err.message || "Failed to terminate hackathon", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY DELETE this hackathon? This action cannot be undone.")) return;
    try {
      await del(`/admin/hackathons/${id}`);
      addToast("Hackathon deleted successfully", "success");
      fetchHackathons();
    } catch (err) {
      addToast(err.message || "Failed to delete hackathon", "error");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await put(`/admin/hackathons/${editingHack._id}`, formData);
      addToast("Hackathon updated successfully", "success");
      setEditingHack(null);
      fetchHackathons();
    } catch (err) {
      addToast(err.message || "Failed to update hackathon", "error");
    }
  };

  const tabClass = (tab) =>
    `pb-3 font-medium transition text-sm ${activeTab === tab
      ? "border-b-2 border-blue-500 text-blue-400"
      : "text-gray-400 hover:text-gray-300"
    }`;

  const HackathonCard = ({ h, isPast }) => (
    <div
      key={h._id}
      className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition relative group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
          <Trophy size={16} className="text-blue-400" />
        </div>
        <div className="flex gap-2">
          {!isPast && (
            <button 
              onClick={() => handleTerminate(h._id)}
              className="p-1.5 bg-yellow-900/20 text-yellow-500 border border-yellow-500/30 rounded hover:bg-yellow-900/40 transition"
              title="Terminate Hackathon"
            >
              <StopCircle size={14} />
            </button>
          )}
          <button 
            onClick={() => setEditingHack(h)}
            className="p-1.5 bg-blue-900/20 text-blue-500 border border-blue-500/30 rounded hover:bg-blue-900/40 transition"
            title="Edit Hackathon"
          >
            <Edit size={14} />
          </button>
          <button 
            onClick={() => handleDelete(h._id)}
            className="p-1.5 bg-red-900/20 text-red-500 border border-red-500/30 rounded hover:bg-red-900/40 transition"
            title="Delete Hackathon"
          >
            <Trash2 size={14} />
          </button>
        </div>
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

      {h.status === "terminated" && (
        <div className="mt-3">
          <span className="text-[10px] bg-red-900/40 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
            TERMINATED
          </span>
        </div>
      )}
    </div>
  );

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
            <p className="text-2xl font-bold text-blue-400">
              {segmentedHacks.live.length + segmentedHacks.upcoming.length}
            </p>
            <p className="text-gray-400 text-xs">Active</p>
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
           Active Hackathons ({segmentedHacks.live.length + segmentedHacks.upcoming.length})
        </button>
        <button id="admin-tab-past" onClick={() => setActiveTab("past")} className={tabClass("past")}>
           Previous Hackathons ({segmentedHacks.past.length})
        </button>
        <button id="admin-tab-teams" onClick={() => setActiveTab("teams")} className={tabClass("teams")}>
           All Teams ({teams.length})
        </button>
      </div>

      {/* Edit Modal Overlay */}
      {editingHack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Hackathon</h2>
              <button onClick={() => setEditingHack(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <HackathonForm 
              initialData={editingHack} 
              onCreated={handleUpdate} 
              isEditing={true} 
            />
          </div>
        </div>
      )}

      {/* CREATE TAB */}
      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto">
          <HackathonForm
            onCreated={handleCreated}
          />
        </div>
      )}

      {/* HACKATHONS TAB */}
      {activeTab === "hackathons" && (
        <div className="space-y-8">
          {/* Live Section */}
          {segmentedHacks.live.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Live Now</h4>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {segmentedHacks.live.map(h => <HackathonCard h={h} key={h._id} />)}
              </div>
            </div>
          )}

          {/* Upcoming Section */}
          {segmentedHacks.upcoming.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Upcoming</h4>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {segmentedHacks.upcoming.map(h => <HackathonCard h={h} key={h._id} />)}
              </div>
            </div>
          )}

          {!loadingHacks && segmentedHacks.live.length === 0 && segmentedHacks.upcoming.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Active Hackathons</h3>
              <p className="text-gray-400 mb-6">Create your first hackathon to get started!</p>
              <button
                onClick={() => setActiveTab("create")}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-medium"
              >
                Create Hackathon
              </button>
            </div>
          )}
        </div>
      )}

      {/* PAST TAB */}
      {activeTab === "past" && (
        <div>
          {loadingHacks ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => <LoadingSkeleton key={i} variant="card" />)}
            </div>
          ) : segmentedHacks.past.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-5xl mb-4">🕰️</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Previous Hackathons</h3>
              <p className="text-gray-400">Finished or terminated hackathons will appear here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {segmentedHacks.past.map(h => <HackathonCard h={h} key={h._id} isPast={true} />)}
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
