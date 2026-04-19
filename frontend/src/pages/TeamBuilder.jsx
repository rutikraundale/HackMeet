import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import TeamCard from '../components/TeamCard';
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

const TeamBuilder = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [teams, setTeams] = useState([
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
      name: "AI Innovators",
      hackathon: "AI Agent Workshop",
      description: "Creating intelligent agents using cutting-edge ML techniques",
      maxMembers: 4,
      members: ["2"],
      memberNames: ["Marcus Kim"],
      skillsNeeded: ["Python", "TensorFlow", "LLMs"]
    }
  ]);

  const [invitesSent, setInvitesSent] = useState([]);
  const [skillFilter, setSkillFilter] = useState(null);
  
  // Form state
  const [teamForm, setTeamForm] = useState({
    name: '',
    hackathon: '',
    description: '',
    skillsNeeded: []
  });

  const handleCreateTeam = () => {
    if (!teamForm.name.trim()) {
      showToast('Please enter a team name', 'error');
      return;
    }

    const newTeam = {
      id: `t${teams.length + 1}`,
      ...teamForm,
      maxMembers: 5,
      members: ["me"],
      memberNames: ["You"],
      skillsNeeded: teamForm.skillsNeeded.length > 0 ? teamForm.skillsNeeded : ["Frontend", "Backend"]
    };

    setTeams([...teams, newTeam]);
    setTeamForm({ name: '', hackathon: '', description: '', skillsNeeded: [] });
    showToast('Team created successfully! 🎉', 'success');
  };

  const handleInvite = (userId) => {
    if (!invitesSent.includes(userId)) {
      setInvitesSent([...invitesSent, userId]);
      showToast('Invite sent! ✨', 'success');
    }
  };

  const handleSkillSelect = (skill) => {
    setTeamForm(prev => ({
      ...prev,
      skillsNeeded: prev.skillsNeeded.includes(skill)
        ? prev.skillsNeeded.filter(s => s !== skill)
        : [...prev.skillsNeeded, skill]
    }));
  };

  const filteredDevelopers = skillFilter
    ? developers.filter(dev => dev.skills.includes(skillFilter))
    : developers;

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
          onClick={() => setActiveTab('teams')}
          className={`pb-3 font-medium transition ${
            activeTab === 'teams'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          👥 My Teams ({teams.filter(t => t.members.includes("me")).length})
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
                  <input
                    type="text"
                    value={teamForm.hackathon}
                    onChange={(e) => setTeamForm({...teamForm, hackathon: e.target.value})}
                    placeholder="e.g., Web3 Global Build"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Description</label>
                  <textarea
                    value={teamForm.description}
                    onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                    placeholder="What's your team about?"
                    rows="4"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Skills Needed</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SKILLS.slice(0, 8).map(skill => (
                      <button
                        key={skill}
                        onClick={() => handleSkillSelect(skill)}
                        className={`text-xs px-3 py-1 rounded transition ${
                          teamForm.skillsNeeded.includes(skill)
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreateTeam}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Create Team
                </button>
              </div>
            </div>
          </div>

          {/* User List with Skill Filter */}
          <div className="md:col-span-2">
            {/* Skill Filter */}
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

            {/* Users Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredDevelopers.map(dev => (
                <UserCard
                  key={dev.id}
                  user={dev}
                  compatibility={calcMatch(dev.skills)}
                  onInvite={handleInvite}
                  isInvited={invitesSent.includes(dev.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MY TEAMS TAB */}
      {activeTab === 'teams' && (
        <div>
          {teams.filter(t => t.members.includes("me")).length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.filter(t => t.members.includes("me")).map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  currentUserId="me"
                  onViewMembers={() => {
                    showToast(`Viewing ${team.name} members...`, 'info');
                  }}
                  onDelete={(id) => {
                    setTeams(teams.filter(t => t.id !== id));
                    showToast('Left team', 'info');
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-800/30 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Teams Yet</h3>
              <p className="text-gray-400 mb-6">Create your first team to get started!</p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Create a Team
              </button>
            </div>
          )}
        </div>
      )}

      {/* SENT INVITES TAB */}
      {activeTab === 'invites' && (
        <div>
          {invitesSent.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {developers.filter(dev => invitesSent.includes(dev.id)).map(dev => (
                <div key={dev.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: dev.color }}
                    >
                      {dev.initials}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{dev.name}</h3>
                      <p className="text-gray-400 text-sm">{dev.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">Invite sent ✓</p>
                  <button
                    onClick={() => {
                      setInvitesSent(invitesSent.filter(id => id !== dev.id));
                      showToast('Invite cancelled', 'info');
                    }}
                    className="w-full px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg transition text-sm"
                  >
                    Cancel Invite
                  </button>
                </div>
              ))}
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
