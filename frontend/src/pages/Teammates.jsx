import React, { useState, useMemo, useEffect } from "react";
import { Search, Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import { get, post } from "../utils/api";
import { useToast } from "../context/ToastContext";

const Teammates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeSkills, setActiveSkills] = useState([]);
  const [invitedIds, setInvitedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [developers, setDevelopers] = useState([]);

  const mySkills = user?.skills || [];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await get("/users");
        setDevelopers(data.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const ALL_SKILLS = useMemo(() => 
    [...new Set(developers.flatMap((d) => d.skills || []))],
    [developers]
  );

  const calcMatch = (skills) => {
    if (!mySkills.length || !skills?.length) return 0;
    const common = skills.filter((s) => mySkills.includes(s));
    return Math.round((common.length / Math.max(mySkills.length, 1)) * 100);
  };

  const toggleSkill = (skill) => {
    setActiveSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleInvite = async (id) => {
    if (invitedIds.includes(id)) return;
    try {
      await post("/teams/invite", { targetUserId: id });
      setInvitedIds((prev) => [...prev, id]);
      addToast("Invite sent! ✨", "success");
    } catch (err) {
      addToast(err.message || "Failed to send invite", "error");
    }
  };

  const filtered = useMemo(() => {
    return developers.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch = !q || (d.username || "").toLowerCase().includes(q) || (d.bio || "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || (statusFilter === "open" ? !d.teamId : !!d.teamId);
      const matchSkills = activeSkills.length === 0 || activeSkills.some((s) => (d.skills || []).includes(s));
      return matchSearch && matchStatus && matchSkills;
    });
  }, [search, statusFilter, activeSkills, developers]);

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Discover Teammates</h1>
        <p className="text-gray-400 mt-1">
          Find developers that match your stack and invite them to your team.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-500"
          />
        </div>

        {["all", "open", "busy"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm border transition ${
              statusFilter === f
                ? "bg-blue-900/40 border-blue-500 text-blue-400"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            {f === "all" ? "All" : f === "open" ? "Open to team up" : "Available soon"}
          </button>
        ))}
      </div>

      {ALL_SKILLS.length > 0 && (
        <>
          <p className="text-xs text-gray-500 tracking-widest mb-3">FILTER BY SKILL</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {ALL_SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  activeSkills.includes(skill)
                    ? "bg-blue-900/40 border-blue-500 text-blue-400"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Developers", value: developers.length },
          { label: "Open to team up", value: developers.filter((d) => !d.teamId).length },
          { label: "Showing", value: filtered.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <div className="bg-gray-900/50 rounded-full p-4 mb-4 inline-block">
            <Search size={32} className="text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            No developers match your filters
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Try adjusting your search criteria or skill filters
          </p>
          <button 
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setActiveSkills([]);
            }}
            className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((dev) => {
            const match = calcMatch(dev.skills);
            const invited = invitedIds.includes(dev._id);
            const isOpen = !dev.teamId;
            const initials = (dev.username || "??").slice(0, 2).toUpperCase();
            const color = `hsl(${(dev.username || "").length * 40}, 40%, 25%)`;

            return (
              <div
                key={dev._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition relative"
              >
                {/* Status Dot */}
                <div
                  className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${
                    isOpen ? "bg-green-500" : "bg-amber-500"
                  }`}
                />

                {dev.profilePicture ? (
                  <img src={dev.profilePicture} alt={dev.username} className="w-11 h-11 rounded-xl mb-3 object-cover" />
                ) : (
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-semibold text-sm mb-3"
                    style={{ backgroundColor: color, color: "#b8d4f8" }}
                  >
                    {initials}
                  </div>
                )}

                <p className="font-semibold text-white">{dev.username}</p>
                <p className="text-sm text-gray-400 mt-0.5">{dev.college || "Developer"}</p>

                <div className="mt-3 mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Skill match</span>
                    <span className="text-blue-400 font-semibold">{match}%</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all"
                      style={{ width: `${match}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(dev.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className={`text-xs px-2 py-0.5 rounded ${
                        mySkills.includes(skill)
                          ? "bg-blue-900/40 text-blue-400"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/users-profile/${dev._id}`)}
                    className="flex-1 py-2 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleInvite(dev._id)}
                    disabled={invited}
                    className={`flex-1 py-2 text-xs rounded-lg font-medium transition ${
                      invited
                        ? "bg-green-900/50 text-green-400 cursor-default"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                  >
                    {invited ? "Invited ✓" : "Invite to Team"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Teammates;