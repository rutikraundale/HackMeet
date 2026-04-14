import React from "react";

const profile = {
  id: "u1",
  name: "Sarah Chen",
  role: "Senior Full Stack Dev",
  location: "San Francisco, CA",
  bio: "Architecting robust digital experiences with the MERN stack...",
  skills: ["Java", "JavaScript", "React", "Node.js", "MongoDB"],
  links: [
    { name: "GitHub", url: "#" },
    { name: "LinkedIn", url: "#" },
    { name: "LeetCode", url: "#" },
  ],
  stats: {
    wins: 24,
    rank: "Top 5%",
  },
};

const ProfileDashboard = () => {
  
  const handleAction = (type, data) => {
    switch (type) {
      case "CHAT":
        console.log("Chat with:", data.name);
        break;

      case "OPEN_LINK":
        window.open(data.url, "_blank");
        break;

      default:
        console.log("Unknown action");
    }
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      
      {/* GRID LAYOUT */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <img
            src=""
            alt="profile"
            className="w-24 h-24 border rounded-xl mb-4"
          />

          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-blue-400">{profile.role}</p>
          <p className="text-gray-400 text-sm mt-1">
            📍 {profile.location}
          </p>

          <button
            onClick={() => handleAction("CHAT", profile)}
            className="mt-4 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-500"
          >
            Chat with {profile.name}
          </button>
        </div>

        {/* BIO CARD */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 col-span-2">
          <h2 className="text-lg font-semibold mb-2">
            Professional Brief
          </h2>

          <p className="text-gray-400">{profile.bio}</p>

          <div className="flex gap-2 mt-4 flex-wrap">
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-gray-800 px-3 py-1 rounded text-sm"
              >
                #{skill}
              </span>
            ))}
          </div>
        </div>

        {/* SOCIAL LINKS */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-sm text-gray-400 mb-4">
            SOCIAL & LINKS
          </h3>

          {profile.links.map((link, i) => (
            <div
              key={i}
              className="flex justify-between items-center mb-3 cursor-pointer"
              onClick={() => handleAction("OPEN_LINK", link)}
            >
              <span>{link.name}</span>
              <span>↗</span>
            </div>
          ))}
        </div>

        {/* SKILLS GRID */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 col-span-2">
          <h3 className="text-sm text-gray-400 mb-4">
            CORE STACK & COMPETENCIES
          </h3>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {profile.skills.map((skill, i) => (
              <div
                key={i}
                className="bg-gray-800 p-4 rounded-lg text-center"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* STATS CARD */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold">
            {profile.stats.wins}
          </h1>
          <p className="text-gray-400 text-sm">
            Hackathons Won
          </p>

          <div className="w-full bg-gray-800 h-2 rounded mt-4">
            <div className="bg-blue-500 h-2 rounded w-3/4"></div>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Global {profile.stats.rank}
          </p>
        </div>

        {/* CODE CARD */}
        <div className="bg-black p-6 rounded-xl border border-gray-800 col-span-2 font-mono text-sm text-green-400">
{`const developer = {
  name: "${profile.name}",
  focus: "System Architecture",
  status: "Open to Collaboration",
  location: "SF_HUB_01"
};`}
        </div>

      </div>
    </div>
  );
};

export default ProfileDashboard;