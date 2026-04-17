import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Trophy, Users, ArrowLeft, MapPin, Clock } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import TeamCard from '../components/TeamCard';
import { showToast } from '../utils/toastUtils';

const hackathonData = {
  h1: {
    id: "h1",
    title: "Web3 Global Build",
    description: "Join the most ambitious hackathon for Web3 builders. Create decentralized applications, smart contracts, and innovative blockchain solutions.",
    startDate: "Dec 1, 2024",
    endDate: "Dec 15, 2024",
    location: "Virtual + San Francisco, CA",
    org: "Global Foundation",
    teamSize: "2–5 members",
    prizePool: "$500,000",
    participants: 2847,
    registeredTeams: [
      {
        id: "t1",
        name: "Web3 Warriors",
        hackathon: "Web3 Global Build",
        description: "Building the next generation of blockchain applications with React and Node.js",
        maxMembers: 5,
        members: ["me", "1", "4"],
        memberNames: ["You", "Sarah Chen", "Jordan Lee"],
        skillsNeeded: ["Solidity", "Web3.js", "React"]
      },
      {
        id: "t2",
        name: "Crypto Innovators",
        hackathon: "Web3 Global Build",
        description: "Exploring DeFi and NFT opportunities",
        maxMembers: 5,
        members: ["2", "5"],
        memberNames: ["Marcus Kim", "Aisha Patel"],
        skillsNeeded: ["Smart Contracts", "DeFi"]
      },
      {
        id: "t3",
        name: "Blockchain Builders",
        hackathon: "Web3 Global Build",
        description: "Creating scalable blockchain infrastructure",
        maxMembers: 5,
        members: ["3"],
        memberNames: ["Priya Nair"],
        skillsNeeded: ["Rust", "Go"]
      }
    ],
    rules: [
      "All work must be original and created during the hackathon",
      "Team members must be registered participants",
      "Projects must be open-sourced if using open-source dependencies",
      "Intellectual property remains with the creators",
      "Code must be hosted on GitHub"
    ],
    track: "Blockchain",
  },
  h2: {
    id: "h2",
    title: "AI Agent Workshop",
    description: "Hands-on workshop to build intelligent agents using the latest LLM technologies and frameworks.",
    startDate: "Nov 22, 2024",
    endDate: "Nov 24, 2024",
    location: "Virtual",
    org: "LLM Infrastructure",
    teamSize: "1–3 members",
    prizePool: "$100,000",
    participants: 1523,
    registeredTeams: [
      {
        id: "ta1",
        name: "AI Innovators",
        hackathon: "AI Agent Workshop",
        description: "Creating intelligent agents using cutting-edge ML techniques",
        maxMembers: 3,
        members: ["2"],
        memberNames: ["Marcus Kim"],
        skillsNeeded: ["Python", "TensorFlow", "LLMs"]
      }
    ],
    rules: [
      "Projects must use LLM APIs or open-source models",
      "Maximum 3 team members",
      "48-hour development window",
      "Demos required for submission"
    ],
    track: "AI/ML",
  }
};

const HackathonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hackathonData[id]) {
        setHackathon(hackathonData[id]);
        setIsRegistered(id === "h1"); // Mock: registered to first hackathon
      }
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
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
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 block">
                {hackathon.track}
              </span>
              <h1 className="text-4xl font-bold mb-3">{hackathon.title}</h1>
              <p className="text-gray-400 max-w-2xl">{hackathon.description}</p>
            </div>
            <button
              onClick={() => {
                setIsRegistered(!isRegistered);
                showToast(
                  isRegistered ? 'Unregistered from hackathon' : 'Registered for hackathon! 🎉',
                  isRegistered ? 'info' : 'success'
                );
              }}
              className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ml-4 ${
                isRegistered
                  ? 'bg-green-600/20 text-green-400 border border-green-600/50'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRegistered ? '✓ Registered' : 'Register Now'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Participants", value: hackathon.participants, icon: "👥" },
            { label: "Prize Pool", value: hackathon.prizePool, icon: "🏆" },
            { label: "Teams", value: hackathon.registeredTeams.length, icon: "⚡" },
            { label: "Team Size", value: hackathon.teamSize, icon: "👨‍💼" },
            { label: "Duration", value: "15 days", icon: "⏱️" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-blue-400">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Timeline and Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Timeline Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" />
                  {hackathon.startDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">End Date</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" />
                  {hackathon.endDate}
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

          {/* Rules Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Rules & Guidelines</h3>
            <ul className="space-y-2">
              {hackathon.rules.map((rule, i) => (
                <li key={i} className="flex gap-3 text-gray-300 text-sm">
                  <span className="text-blue-400 font-bold flex-shrink-0">✓</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Registered Teams Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Users size={24} className="text-blue-400" />
            <h2 className="text-2xl font-bold">Registered Teams ({hackathon.registeredTeams.length})</h2>
          </div>

          {hackathon.registeredTeams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathon.registeredTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  currentUserId="me"
                  onViewMembers={() => {
                    showToast(`Viewing ${team.name} members...`, 'info');
                  }}
                  onDelete={() => {
                    showToast('Left team', 'info');
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-800/30 rounded-xl border border-slate-700">
              <Trophy size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No teams registered yet</h3>
              <p className="text-gray-400 mb-6">Be the first team to join this hackathon!</p>
              {isRegistered && (
                <button
                  onClick={() => navigate('/team-builder')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-medium"
                >
                  Create a Team
                </button>
              )}
            </div>
          )}
        </div>

        {/* Organizer Info */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-1">Organized by</p>
          <p className="text-xl font-semibold text-white">{hackathon.org}</p>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetail;
