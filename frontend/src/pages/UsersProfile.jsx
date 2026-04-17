import React from "react";
import { Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const MY_SKILLS = ["React", "Node.js", "MongoDB", "JavaScript"];

const developers = {
  "1": { id: "1", name: "Sarah Chen", role: "Senior Full Stack Dev", location: "San Francisco, CA", bio: "Architecting robust digital experiences with the MERN stack. Passionate about clean code, scalable systems, and collaborative hackathon environments.", skills: ["Java", "JavaScript", "React", "Node.js", "MongoDB"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }, { name: "LeetCode", url: "https://leetcode.com" }], stats: { wins: 24, rank: "Top 5%" }, status: "open" },
  "2": { id: "2", name: "Marcus Kim", role: "ML Engineer", location: "Seoul, South Korea", bio: "Building AI-powered solutions using the latest LLM frameworks. Specializing in NLP and computer vision pipelines.", skills: ["Python", "TensorFlow", "Docker", "AWS"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 12, rank: "Top 15%" }, status: "open" },
  "3": { id: "3", name: "Priya Nair", role: "Frontend Developer", location: "Bangalore, India", bio: "Crafting pixel-perfect UIs with React and Vue. Strong focus on accessibility, performance, and design systems.", skills: ["React", "Vue", "CSS", "Figma"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 8, rank: "Top 20%" }, status: "open" },
  "4": { id: "4", name: "Jordan Lee", role: "Backend Engineer", location: "London, UK", bio: "Designing high-performance APIs and distributed systems. Expert in PostgreSQL, Redis, and microservices.", skills: ["Node.js", "PostgreSQL", "Redis", "Docker"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 16, rank: "Top 10%" }, status: "busy" },
  "5": { id: "5", name: "Aisha Patel", role: "DevOps Engineer", location: "Dubai, UAE", bio: "Cloud infrastructure expert with deep experience in AWS, Kubernetes, and CI/CD pipelines at scale.", skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 6, rank: "Top 25%" }, status: "open" },
  "6": { id: "6", name: "Lucas Berg", role: "Blockchain Dev", location: "Berlin, Germany", bio: "Smart contract developer building the decentralized future. Experienced in DeFi, NFTs, and Web3 tooling.", skills: ["Solidity", "Web3.js", "React", "Node.js"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 19, rank: "Top 8%" }, status: "busy" },
  "7": { id: "7", name: "Mei Zhang", role: "Mobile Developer", location: "Shanghai, China", bio: "Cross-platform mobile specialist building with React Native and Flutter. Shipped 10+ apps to production.", skills: ["React Native", "Flutter", "Firebase", "iOS"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 11, rank: "Top 18%" }, status: "open" },
  "8": { id: "8", name: "Omar Hassan", role: "Data Engineer", location: "Cairo, Egypt", bio: "Building robust data pipelines and analytics platforms. Expert in distributed computing and real-time data processing.", skills: ["Python", "Spark", "MongoDB", "Airflow"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 9, rank: "Top 22%" }, status: "busy" },
};

const calcCompatibility = (userSkills) => {
  const common = userSkills.filter((s) => MY_SKILLS.includes(s));
  return Math.round((common.length / Math.max(MY_SKILLS.length, 1)) * 100);
};

const UsersProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const profile = developers[id];

  if (!profile) {
    return (
      <div className="p-6 bg-gray-950 min-h-screen text-white flex flex-col items-center justify-center">
        <p className="text-gray-400 text-lg mb-4">Developer not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft size={18} /> Go back
        </button>
      </div>
    );
  }

  const compatibility = calcCompatibility(profile.skills);

  const handleAction = (type, data) => {
    if (type === "CHAT") navigate(`/messages/${data.id}`);
    if (type === "OPEN_LINK") window.open(data.url, "_blank");
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="w-24 h-24 rounded-xl mb-4 bg-blue-900 flex items-center justify-center text-3xl font-bold text-blue-300">
            {profile.name.split(" ").map((n) => n[0]).join("")}
          </div>

          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-blue-400">{profile.role}</p>
          <p className="text-gray-400 text-sm mt-1"> {profile.location}</p>

          {/* Status */}
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              profile.status === "open"
                ? "bg-green-900/40 text-green-400"
                : "bg-amber-900/40 text-amber-400"
            }`}>
              {profile.status === "open" ? "✓ Open to team up" : " Busy"}
            </span>
          </div>

          {/* Compatibility Score */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Skill match with you</span>
              <span className="text-blue-400 font-semibold">{compatibility}%</span>
            </div>
            <div className="bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${compatibility}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => handleAction("CHAT", profile)}
            className="mt-5 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-500 flex items-center justify-center gap-2 transition"
          >
            <MessageCircle size={16} />
            Chat with {profile.name.split(" ")[0]}
          </button>
        </div>

        {/* BIO CARD */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Professional Brief</h2>
          <p className="text-gray-400">{profile.bio}</p>

          <div className="flex gap-2 mt-4 flex-wrap">
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded text-sm ${
                  MY_SKILLS.includes(skill)
                    ? "bg-blue-900/40 text-blue-400"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                #{skill}
              </span>
            ))}
          </div>
        </div>

        {/* SOCIAL LINKS */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-4 tracking-widest">SOCIAL & LINKS</h3>
          {profile.links.map((link, i) => (
            <div
              key={i}
              className="flex justify-between items-center mb-3 cursor-pointer hover:text-blue-400 transition"
              onClick={() => handleAction("OPEN_LINK", link)}
            >
              <span>{link.name}</span>
              <span>↗</span>
            </div>
          ))}
        </div>

        {/* SKILLS GRID */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 lg:col-span-2">
          <h3 className="text-sm text-gray-400 mb-4 tracking-widest">CORE STACK & COMPETENCIES</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {profile.skills.map((skill, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg text-center text-sm ${
                  MY_SKILLS.includes(skill)
                    ? "bg-blue-900/30 border border-blue-800 text-blue-300"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>


        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold">{profile.stats.wins}</h1>
          <p className="text-gray-400 text-sm">Hackathons Won</p>
          <div className="w-full bg-gray-800 h-2 rounded mt-4">
            <div className="bg-blue-500 h-2 rounded w-3/4" />
          </div>
          <p className="text-xs text-gray-400 mt-2">Global {profile.stats.rank}</p>
        </div>


        <div className="bg-black p-6 rounded-xl border border-gray-800 lg:col-span-2 font-mono text-sm text-green-400">
{`const developer = {
  name: "${profile.name}",
  focus: "${profile.role}",
  status: "${profile.status === "open" ? "Open to Collaboration" : "Currently Busy"}",
  location: "${profile.location.replace(", ", "_").replace(" ", "_").toUpperCase()}"
};`}
        </div>

      </div>
    </div>
  );
};

export default UsersProfile;