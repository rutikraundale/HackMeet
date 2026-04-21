import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Trophy, Users, ArrowLeft, MapPin } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { get } from '../utils/api';

const HackathonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const data = await get(`/hackathons/${id}`);
        setHackathon(data.data);
      } catch (err) {
        console.error("Failed to fetch hackathon:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHackathon();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-950 min-h-screen text-white">
        <div className="mb-6">
          <div className="w-32 h-8 bg-slate-700 animate-pulse rounded mb-4"></div>
        </div>
        <div className="max-w-4xl">
          <LoadingSkeleton variant="profile" className="mb-6" />
          <LoadingSkeleton variant="card" className="mb-6" />
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="p-6 bg-gray-950 min-h-screen text-white">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Hackathon not found</h2>
          <p className="text-gray-400">The hackathon you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const isLive = new Date(hackathon.startDate) <= now && new Date(hackathon.endDate) >= now;
  const isUpcoming = new Date(hackathon.startDate) > now;
  const startDate = new Date(hackathon.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const endDate = new Date(hackathon.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const durationDays = Math.ceil((new Date(hackathon.endDate) - new Date(hackathon.startDate)) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition"
      >
        <ArrowLeft size={18} />
        Back to Hackathons
      </button>

      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${
                isLive ? "text-red-400" : isUpcoming ? "text-green-400" : "text-gray-400"
              }`}>
                {isLive ? "🔴 LIVE NOW" : isUpcoming ? "🟢 UPCOMING" : "PAST"}
              </span>
              <h1 className="text-4xl font-bold mb-3">{hackathon.name}</h1>
              <p className="text-gray-400 max-w-2xl">{hackathon.description}</p>
            </div>
            <button
              onClick={() => navigate('/team-builder', { state: { hackathonId: hackathon._id, hackathonName: hackathon.name } })}
              className="px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ml-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Team
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Team Size", value: `Up to ${hackathon.teamsize}`, icon: "👨‍💼" },
            { label: "Location", value: hackathon.location, icon: "📍" },
            { label: "Duration", value: `${durationDays} days`, icon: "⏱️" },
            { label: "Prizes", value: hackathon.prizes?.length > 0 ? `${hackathon.prizes.length} prizes` : "TBA", icon: "🏆" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-blue-400">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" />
                  {startDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">End Date</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" />
                  {endDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Location</p>
                <p className="text-white flex items-center gap-2">
                  <MapPin size={16} className="text-green-400" />
                  {hackathon.location}
                </p>
              </div>
            </div>
          </div>

          {/* Prizes */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Prizes</h3>
            {hackathon.prizes?.length > 0 ? (
              <div className="space-y-3">
                {hackathon.prizes.map((prize, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Trophy size={16} className={i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : "text-amber-600"} />
                    <span className="text-gray-300">{prize}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Prize details will be announced soon.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetail;
