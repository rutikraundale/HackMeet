import React, { useState, useEffect } from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "../components/LoadingSkeleton";

const UsersProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const mySkills = currentUser?.skills || [];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await get(`/users/${id}`);
        setProfile(data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const calcCompatibility = (userSkills) => {
    if (!mySkills.length || !userSkills?.length) return 0;
    const common = userSkills.filter((s) => mySkills.includes(s));
    return Math.round((common.length / Math.max(mySkills.length, 1)) * 100);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-950 min-h-screen text-white">
        <div className="mb-6">
          <div className="w-24 h-8 bg-slate-700 animate-pulse rounded mb-4"></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <LoadingSkeleton variant="profile" />
          <div className="lg:col-span-2"><LoadingSkeleton variant="card" /></div>
        </div>
      </div>
    );
  }

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
  const initials = (profile.username || "??").slice(0, 2).toUpperCase();
  const isOpen = !profile.teamId;

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
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt={profile.username}
              className="w-24 h-24 rounded-xl mb-4 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl mb-4 bg-blue-900 flex items-center justify-center text-3xl font-bold text-blue-300">
              {initials}
            </div>
          )}

          <h2 className="text-xl font-bold">{profile.username}</h2>
          <p className="text-blue-400">{profile.college || "Developer"}</p>

          {/* Status */}
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              isOpen
                ? "bg-green-900/40 text-green-400"
                : "bg-amber-900/40 text-amber-400"
            }`}>
              {isOpen ? "✓ Open to team up" : "In a team"}
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
            onClick={() => navigate(`/messages/${profile._id}`)}
            className="mt-5 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-500 flex items-center justify-center gap-2 transition"
          >
            <MessageCircle size={16} />
            Chat with {(profile.username || "").split(" ")[0]}
          </button>
        </div>

        {/* TEAM ACTION CARD */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Team Collaboration</h2>
          
          {currentUser?.isTeamLeader && !profile.teamId ? (
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="text-blue-400 font-medium text-sm">Recruit Developer</h3>
                <p className="text-gray-400 text-xs mt-1">This user is available. Invite them to your team!</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const { post } = await import("../utils/api");
                    await post("/teams/invite", { targetUserId: profile._id });
                    alert("Invitation sent successfully!");
                  } catch (err) {
                    alert(err.message || "Failed to send invite");
                  }
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm transition"
              >
                Send Invite
              </button>
            </div>
          ) : !currentUser?.teamId && profile.isTeamLeader && profile.teamId ? (
             <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="text-green-400 font-medium text-sm">Join Team</h3>
                <p className="text-gray-400 text-xs mt-1">This user leads a team. Send a request to join!</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const { post } = await import("../utils/api");
                    await post(`/teams/${profile.teamId}/request`);
                    alert("Join request sent successfully!");
                  } catch (err) {
                    alert(err.message || "Failed to send request");
                  }
                }}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm transition"
              >
                Request to Join
              </button>
            </div>
          ) : currentUser?.teamId === profile.teamId && profile.teamId ? (
             <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg flex items-center">
               <span className="text-gray-300 text-sm">You and {(profile.username || "").split(" ")[0]} are in the same team.</span>
             </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg flex items-center">
              <span className="text-gray-400 text-sm">No team actions available at this time.</span>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-400">{profile.bio || "No bio provided."}</p>

            <div className="flex gap-2 mt-4 flex-wrap">
              {(profile.skills || []).map((skill, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded text-sm ${
                    mySkills.includes(skill)
                      ? "bg-blue-900/40 text-blue-400"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  #{skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SOCIAL LINKS */}
        {(profile.socialLinks?.length > 0) && (
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-4 tracking-widest">SOCIAL & LINKS</h3>
            {profile.socialLinks.map((link, i) => (
              <div
                key={i}
                className="flex justify-between items-center mb-3 cursor-pointer hover:text-blue-400 transition"
                onClick={() => window.open(link, "_blank")}
              >
                <span className="text-sm truncate">{link}</span>
                <span>↗</span>
              </div>
            ))}
          </div>
        )}

        {/* SKILLS GRID */}
        <div className={`bg-gray-900 p-6 rounded-xl border border-gray-800 ${profile.socialLinks?.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <h3 className="text-sm text-gray-400 mb-4 tracking-widest">CORE STACK & COMPETENCIES</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {(profile.skills || []).map((skill, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg text-center text-sm ${
                  mySkills.includes(skill)
                    ? "bg-blue-900/30 border border-blue-800 text-blue-300"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Code Block */}
        <div className="bg-black p-6 rounded-xl border border-gray-800 lg:col-span-3 font-mono text-sm text-green-400">
{`const developer = {
  name: "${profile.username}",
  focus: "${profile.college || "Developer"}",
  status: "${isOpen ? "Open to Collaboration" : "Currently in a Team"}",
  skills: [${(profile.skills || []).map(s => `"${s}"`).join(", ")}]
};`}
        </div>

      </div>
    </div>
  );
};

export default UsersProfile;