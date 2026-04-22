import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { get } from '../utils/api';

const Discover = () => {
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [developers, setDevelopers] = useState([]);
  const { user } = useAuth();

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

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const calcMatch = (skills) => {
    if (!mySkills.length || !skills?.length) return 0;
    const common = skills.filter((s) => mySkills.includes(s));
    return Math.round((common.length / Math.max(mySkills.length, 1)) * 100);
  };

  const filtered = useMemo(() => {
    return developers.filter((d) => {
      // Don't show the current user in discover
      if (user && d._id === user._id) return false;
      const q = search.toLowerCase();
      const matchSearch = !q || (d.username || "").toLowerCase().includes(q) || (d.bio || "").toLowerCase().includes(q);
      const matchSkills = selectedSkills.length === 0 || selectedSkills.some((s) => (d.skills || []).includes(s));
      return matchSearch && matchSkills;
    });
  }, [search, selectedSkills, developers, user]);

  // Map backend user to UserCard format
  const mapUser = (dev) => ({
    id: dev._id,
    name: dev.username,
    role: dev.college || "Developer",
    location: dev.college || "",
    skills: dev.skills || [],
    status: dev.teamId ? "busy" : "open",
    initials: (dev.username || "??").slice(0, 2).toUpperCase(),
    color: `hsl(${(dev.username || "").length * 40}, 40%, 25%)`,
    profilePicture: dev.profilePicture,
  });

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Discover Developers</h1>
        <p className="text-gray-400 mt-2">Find and connect with talented developers</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus-within:border-blue-500 transition">
          <Search className="w-4 h-4 text-gray-400 mr-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-500"
          />
        </div>

        {/* Skill Filter */}
        {ALL_SKILLS.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Filter by Skills</p>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded text-xs transition ${
                    selectedSkills.includes(skill)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Developers", value: developers.length },
          { label: "Open to Team Up", value: developers.filter((d) => !d.teamId).length },
          { label: "Matching Filters", value: filtered.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-400">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-800/30 rounded-xl border border-slate-700">
          <Search size={48} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No developers match your filters
          </h3>
          <p className="text-gray-400 mb-6">Try adjusting your search criteria or skill selection</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedSkills([]);
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dev) => {
            const mapped = mapUser(dev);
            return (
              <UserCard
                key={dev._id}
                user={mapped}
                compatibility={calcMatch(dev.skills)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Discover;
