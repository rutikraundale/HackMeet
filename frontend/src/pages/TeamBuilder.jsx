import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { get, post } from '../utils/api';
import { useLocation } from 'react-router-dom';

const TeamBuilder = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [invitesSent, setInvitesSent] = useState([]);
  const [skillFilter, setSkillFilter] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { user, checkAuth } = useAuth();
  const location = useLocation();

  // Form state
  const [teamForm, setTeamForm] = useState({
    name: '',
    hackathonId: location.state?.hackathonId || '',
    description: '',
  });

  const mySkills = user?.skills || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, hacksData] = await Promise.all([
          get("/users"),
          get("/hackathons"),
        ]);
        setDevelopers(usersData.data || []);
        setHackathons(hacksData.data || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const ALL_SKILLS = [...new Set(developers.flatMap((d) => d.skills || []))];

  const calcMatch = (skills) => {
    if (!mySkills.length || !skills?.length) return 0;
    const common = skills.filter((s) => mySkills.includes(s));
    return Math.round((common.length / Math.max(mySkills.length, 1)) * 100);
  };

  const handleCreateTeam = async () => {
    if (!teamForm.name.trim()) {
      addToast('Please enter a team name', 'error');
      return;
    }
    if (!teamForm.hackathonId) {
      addToast('Please select a hackathon', 'error');
      return;
    }

    try {
      await post("/teams", {
        teamName: teamForm.name,
        hackathonId: teamForm.hackathonId,
      });
      setTeamForm({ name: '', hackathonId: '', description: '' });
      addToast('Team created successfully! 🎉', 'success');
      await checkAuth(); // refresh user data (now has teamId)
    } catch (err) {
      addToast(err.message || 'Failed to create team', 'error');
    }
  };

  const handleInvite = async (userId) => {
    if (invitesSent.includes(userId)) return;
    try {
      await post("/teams/invite", { targetUserId: userId });
      setInvitesSent([...invitesSent, userId]);
      addToast('Invite sent! ✨', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to send invite', 'error');
    }
  };

  const filteredDevelopers = skillFilter
    ? developers.filter(dev => (dev.skills || []).includes(skillFilter))
    : developers;

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
        <h1 className="text-3xl font-bold mb-2">Team Builder</h1>
        <p className="text-gray-400">Create teams and invite talented developers</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-700 mb-8">
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-3 font-medium transition ${
            activeTab === 'create'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          📝 Create Team
        </button>
        <button
          onClick={() => setActiveTab('invites')}
          className={`pb-3 font-medium transition ${
            activeTab === 'invites'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          📤 Sent Invites ({invitesSent.length})
        </button>
      </div>

      {/* CREATE TEAM TAB */}
      {activeTab === 'create' && (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">New Team</h3>

              {user?.teamId && (
                <div className="mb-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
                  ⚠️ You're already in a team. Leave your current team before creating a new one.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Team Name</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                    placeholder="e.g., Web3 Warriors"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Hackathon</label>
                  <select
                    value={teamForm.hackathonId}
                    onChange={(e) => setTeamForm({...teamForm, hackathonId: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="">Select hackathon...</option>
                    {hackathons.map((h) => (
                      <option key={h._id} value={h._id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleCreateTeam}
                  disabled={!!user?.teamId}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Create Team
                </button>
              </div>
            </div>
          </div>

          {/* User List with Skill Filter */}
          <div className="md:col-span-2">
            {ALL_SKILLS.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Filter by Skill</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSkillFilter(null)}
                    className={`px-3 py-1 rounded text-sm transition ${
                      skillFilter === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    All
                  </button>
                  {ALL_SKILLS.map(skill => (
                    <button
                      key={skill}
                      onClick={() => setSkillFilter(skill)}
                      className={`px-3 py-1 rounded text-sm transition ${
                        skillFilter === skill
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <LoadingSkeleton key={i} variant="card" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredDevelopers.map(dev => (
                  <UserCard
                    key={dev._id}
                    user={mapUser(dev)}
                    compatibility={calcMatch(dev.skills)}
                    onInvite={handleInvite}
                    isInvited={invitesSent.includes(dev._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SENT INVITES TAB */}
      {activeTab === 'invites' && (
        <div>
          {invitesSent.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {developers.filter(dev => invitesSent.includes(dev._id)).map(dev => {
                const initials = (dev.username || "??").slice(0, 2).toUpperCase();
                const color = `hsl(${(dev.username || "").length * 40}, 40%, 25%)`;
                return (
                  <div key={dev._id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {dev.profilePicture ? (
                        <img src={dev.profilePicture} alt={dev.username} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: color }}
                        >
                          {initials}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{dev.username}</h3>
                        <p className="text-gray-400 text-sm">{dev.college || "Developer"}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Invite sent ✓</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">📤</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Invites Sent</h3>
              <p className="text-gray-400">Start inviting developers to your team!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamBuilder;
