import React, { useState, useMemo, useEffect } from 'react';
import { Search, Users, UserPlus } from 'lucide-react';
import UserCard from '../components/UserCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { showToast } from '../utils/toastUtils';

const MY_SKILLS = ["React", "Node.js", "MongoDB"];

const developers = [
  { id: "1", name: "Sarah Chen", role: "Senior Full Stack Dev", location: "San Francisco, CA", skills: ["React", "Node.js", "TypeScript", "MongoDB"], status: "open", initials: "SC", color: "#1a3a5c" },
  { id: "2", name: "Marcus Kim", role: "ML Engineer", location: "Seoul, South Korea", skills: ["Python", "TensorFlow", "Docker", "AWS"], status: "open", initials: "MK", color: "#2d1a5c" },
  { id: "3", name: "Priya Nair", role: "Frontend Developer", location: "Bangalore, India", skills: ["React", "Vue", "CSS", "Figma"], status: "open", initials: "PN", color: "#1a3d2b" },
  { id: "4", name: "Jordan Lee", role: "Backend Engineer", location: "London, UK", skills: ["Node.js", "PostgreSQL", "Redis", "Docker"], status: "busy", initials: "JL", color: "#3d2a1a" },
  { id: "5", name: "Aisha Patel", role: "DevOps Engineer", location: "Dubai, UAE", skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"], status: "open", initials: "AP", color: "#1a3040" },
  { id: "6", name: "Lucas Berg", role: "Blockchain Dev", location: "Berlin, Germany", skills: ["Solidity", "Web3.js", "React", "Node.js"], status: "busy", initials: "LB", color: "#3d1a2a" },
];

const ALL_SKILLS = [...new Set(developers.flatMap((d) => d.skills))];

const calcMatch = (skills) => {
  const common = skills.filter((s) => MY_SKILLS.includes(s));
  return Math.round((common.length / Math.max(MY_SKILLS.length, 1)) * 100);
};

const Discover = () => {
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [invitedIds, setInvitedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleInvite = (id) => {
    if (!invitedIds.includes(id)) {
      setInvitedIds([...invitedIds, id]);
      showToast('Invite sent to developer! ✨', 'success');
    }
  };

  const filtered = useMemo(() => {
    return developers.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch = !q || d.name.toLowerCase().includes(q) || d.role.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || d.status === statusFilter;
      const matchSkills = selectedSkills.length === 0 || selectedSkills.some((s) => d.skills.includes(s));
      return matchSearch && matchStatus && matchSkills;
    });
  }, [search, statusFilter, selectedSkills]);

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Discover Developers</h1>
        <p className="text-gray-400 mt-2">Find and connect with talented developers in your region</p>
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
            placeholder="Search by name or role..."
            className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {["all", "open", "busy"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                statusFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-gray-400 hover:bg-slate-700"
              }`}
            >
              {filter === "all" ? "All" : filter === "open" ? "✓ Open to team up" : "⏳ Busy"}
            </button>
          ))}
        </div>

        {/* Skill Filter */}
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Developers", value: developers.length },
          { label: "Open to Team Up", value: developers.filter((d) => d.status === "open").length },
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
              setStatusFilter("all");
              setSelectedSkills([]);
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dev) => (
            <UserCard
              key={dev.id}
              user={dev}
              compatibility={calcMatch(dev.skills)}
              onInvite={handleInvite}
              isInvited={invitedIds.includes(dev.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;
