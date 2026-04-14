import React from "react";

const hackathons = [
  {
    id: "h1",
    title: "Web3 Global Build",
    date: "Dec 1–15, 2024",
    org: "Global Foundation",
    team: "2–5 members",
    featured: true,
  },
  {
    id: "h2",
    title: "AI Agent Workshop",
    date: "Nov 22–24, 2024",
    org: "LLM Infrastructure",
    team: "2–5 members",
  },
  {
    id: "h2",
    title: "AI Agent Workshop",
    date: "Nov 22–24, 2024",
    org: "LLM Infrastructure",
    team: "2–5 members",
  },
];

  const handleAction = (type, hackathon) => {
    const { id, title } = hackathon;

    switch (type) {
      case "CREATE_TEAM":
        console.log("Create Team:", id, title);
        break;

      case "VIEW_DETAILS":
        console.log("View Details:", id);
        break;

      default:
        console.log("Unknown action");
    }
  };

const Dashboard = () => {
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
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            Filter
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            Sort by Date
          </button>
        </div>
      </div>

      {/* Featured Card */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {hackathons.map((hack) => (
          <div
            key={hack.id}
            className={`rounded-xl p-5 border ${
              hack.featured
                ? "bg-blue-900/20 border-blue-500"
                : "bg-gray-900 border-gray-800"
            }`}
          >
            {/* Featured Badge */}
            {hack.featured && (
              <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                FEATURED
              </span>
            )}

            <h3 className="text-xl font-semibold mt-2">
              {hack.title}
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              📅 {hack.date}
            </p>

            <p className="text-gray-500 text-sm">
              🌐 {hack.org}
            </p>

            <p className="text-blue-400 text-xs mt-2">
              TEAM: {hack.team}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleAction("CREATE_TEAM", hack)}
                className="bg-green-600 px-3 py-2 rounded-lg hover:bg-green-500"
              >
                Create Team
              </button>

              <button
                onClick={() => handleAction("VIEW_DETAILS", hack)}
                className="bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700"
              >
                Details
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* Matchmaking Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            Can't find a partner?
          </h2>
          <p className="text-gray-400 mt-1">
            Join matchmaking pool and get paired with builders.
          </p>

          <button className="mt-4 bg-white text-black px-4 py-2 rounded-lg">
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