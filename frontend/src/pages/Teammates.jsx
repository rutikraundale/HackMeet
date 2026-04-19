import React, { useState, useMemo, useEffect } from "react";
import { Search, Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../components/LoadingSkeleton";

const MY_SKILLS = ["React", "Node.js", "MongoDB"]; 

const developers = [
  { id: "1", name: "Sarah Chen", role: "Senior Full Stack Dev", location: "San Francisco, CA", skills: ["React", "Node.js", "TypeScript", "MongoDB"], status: "open", initials: "SC", color: "#1a3a5c" },
  { id: "2", name: "Marcus Kim", role: "ML Engineer", location: "Seoul, South Korea", skills: ["Python", "TensorFlow", "Docker", "AWS"], status: "open", initials: "MK", color: "#2d1a5c" },
  { id: "3", name: "Priya Nair", role: "Frontend Developer", location: "Bangalore, India", skills: ["React", "Vue", "CSS", "Figma"], status: "open", initials: "PN", color: "#1a3d2b" },
  { id: "4", name: "Jordan Lee", role: "Backend Engineer", location: "London, UK", skills: ["Node.js", "PostgreSQL", "Redis", "Docker"], status: "busy", initials: "JL", color: "#3d2a1a" },
  { id: "5", name: "Aisha Patel", role: "DevOps Engineer", location: "Dubai, UAE", skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"], status: "open", initials: "AP", color: "#1a3040" },
  { id: "6", name: "Lucas Berg", role: "Blockchain Dev", location: "Berlin, Germany", skills: ["Solidity", "Web3.js", "React", "Node.js"], status: "busy", initials: "LB", color: "#3d1a2a" },
  { id: "7", name: "Mei Zhang", role: "Mobile Developer", location: "Shanghai, China", skills: ["React Native", "Flutter", "Firebase", "iOS"], status: "open", initials: "MZ", color: "#2a3d1a" },
  { id: "8", name: "Omar Hassan", role: "Data Engineer", location: "Cairo, Egypt", skills: ["Python", "Spark", "MongoDB", "Airflow"], status: "busy", initials: "OH", color: "#3d3a1a" },
];

const ALL_SKILLS = [...new Set(developers.flatMap((d) => d.skills))];

const calcMatch = (skills) => {
  const common = skills.filter((s) => MY_SKILLS.includes(s));
  return Math.round((common.length / Math.max(MY_SKILLS.length, 1)) * 100);
};

const Teammates = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeSkills, setActiveSkills] = useState([]);
  const [invitedIds, setInvitedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSkill = (skill) => {
    setActiveSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleInvite = (id) => {
    if (!invitedIds.includes(id)) setInvitedIds((prev) => [...prev, id]);
  };

  const filtered = useMemo(() => {
    return developers.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch = !q || d.name.toLowerCase().includes(q) || d.role.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || d.status === statusFilter;
      const matchSkills = activeSkills.length === 0 || activeSkills.some((s) => d.skills.includes(s));
      return matchSearch && matchStatus && matchSkills;
    });
  }, [search, statusFilter, activeSkills]);

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
            placeholder="Search by name or role..."
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


      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Developers", value: developers.length },
          { label: "Open to team up", value: developers.filter((d) => d.status === "open").length },
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
        developers.length === 0 ? (
          /* No developers at all */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-900/50 rounded-full p-6 mb-6">
              <Users size={48} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Teammates Available Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              We're building a community of talented developers. Be the first to join and start connecting with potential teammates!
            </p>
            <button className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-500 font-medium flex items-center gap-2">
              <UserPlus size={18} />
              Complete Your Profile
            </button>
          </div>
        ) : (

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
        )
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((dev) => {
            const match = calcMatch(dev.skills);
            const invited = invitedIds.includes(dev.id);
            return (
              <div
                key={dev.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition relative"
              >
                {/* Status Dot */}
                <div
                  className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${
                    dev.status === "open" ? "bg-green-500" : "bg-amber-500"
                  }`}
                />


                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-semibold text-sm mb-3"
                  style={{ backgroundColor: dev.color, color: "#b8d4f8" }}
                >
                  {dev.initials}
                </div>

                <p className="font-semibold text-white">{dev.name}</p>
                <p className="text-sm text-gray-400 mt-0.5">{dev.role}</p>
                <p className="text-xs text-gray-600 mt-1">📍 {dev.location}</p>


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
                  {dev.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`text-xs px-2 py-0.5 rounded ${
                        MY_SKILLS.includes(skill)
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
                    onClick={() => navigate(`/users-profile/${dev.id}`)}
                    className="flex-1 py-2 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleInvite(dev.id)}
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