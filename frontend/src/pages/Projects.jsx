import React, { useState, useEffect } from "react";
import { Plus, GitBranch, Check, RefreshCw } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { get, put } from "../utils/api";
import { useToast } from "../context/ToastContext";
import LoadingSkeleton from "../components/LoadingSkeleton";

const Projects = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [repoLink, setRepoLink] = useState("");
  const [latestCommits, setLatestCommits] = useState([]);
  const [fetchingCommit, setFetchingCommit] = useState(false);
  
  const [newTodo, setNewTodo] = useState("");
  
  const { addToast } = useToast();

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const data = await get("/teams/my-team");
      if (data.data) {
        setTeam(data.data);
        setRepoLink(data.data.gitRepoLink || "");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRepo = async () => {
    try {
      const data = await put(`/teams/${team._id}`, { gitRepoLink: repoLink });
      setTeam(data.data);
      addToast("Repository linked successfully!", "success");
    } catch (err) {
      addToast(err.message || "Failed to update repository", "error");
    }
  };

  const fetchLatestCommit = async () => {
    if (!team.gitRepoLink) {
        addToast("Please link a GitHub repository first.", "error");
        return;
    }
    setFetchingCommit(true);
    try {
      const data = await get(`/teams/${team._id}/commits/latest`);
      if (data.data && Array.isArray(data.data)) {
          setLatestCommits(data.data);
          addToast("Fetched latest commits!", "success");
      } else if (data.data) {
          setLatestCommits([data.data]);
          addToast("Fetched latest activity!", "success");
      } else {
          setLatestCommits([]);
          addToast("No commits found.", "info");
      }
    } catch (err) {
      addToast(err.message || "Failed to fetch commit", "error");
    } finally {
      setFetchingCommit(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    const todoItem = { id: Date.now().toString(), text: newTodo, completed: false };
    const updatedTodos = [...(team.todos || []), todoItem];
    try {
      const data = await put(`/teams/${team._id}`, { todos: updatedTodos });
      setTeam(data.data);
      setNewTodo("");
    } catch (err) {
      addToast(err.message || "Failed to add task", "error");
    }
  };

  const handleToggleTodo = async (todoId) => {
    const updatedTodos = team.todos.map(t => 
      t.id === todoId ? { ...t, completed: !t.completed } : t
    );
    try {
      const data = await put(`/teams/${team._id}`, { todos: updatedTodos });
      setTeam(data.data);
    } catch (err) {
      addToast(err.message || "Failed to update task", "error");
    }
  };
  
  const handleDeleteTodo = async (todoId) => {
    const updatedTodos = team.todos.filter(t => t.id !== todoId);
    try {
      const data = await put(`/teams/${team._id}`, { todos: updatedTodos });
      setTeam(data.data);
    } catch (err) {
      addToast(err.message || "Failed to delete task", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-gray-950 min-h-screen text-white">
         <div className="grid md:grid-cols-2 gap-4">
             <LoadingSkeleton variant="card" />
             <LoadingSkeleton variant="card" />
         </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-4 md:p-6 bg-gray-950 min-h-screen text-white flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold mb-2">No Active Project</h2>
        <p className="text-gray-400 mb-6 text-center max-w-md px-4">
          You are not currently part of any team. Join a hackathon or discover teammates to start building!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
          <Link to="/discover" className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium transition text-center">
            Find Teammates
          </Link>
          <Link to="/team-builder" className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition text-white border border-gray-700 text-center">
            Create a Team
          </Link>
        </div>
      </div>
    );
  }

  const doneCount = (team.todos || []).filter(t => t.completed).length;
  const totalCount = (team.todos || []).length;
  const progress = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  return (
    <div className="p-4 md:p-6 bg-gray-950 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{team.teamName}</h1>
        <p className="text-gray-400 mt-1">Hackathon: <span className="text-blue-400">{team.hackathonId?.name || "Unknown"}</span></p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          
          {/* GitHub Integration */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <FaGithub size={18} /> GitHub Integration
            </h3>
            
            {/* Repo input row: stacked on mobile, side-by-side on sm+ */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input 
                type="text" 
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-[44px]"
              />
              <button 
                onClick={handleUpdateRepo}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap min-h-[44px]"
              >
                Save Link
              </button>
            </div>

            {team.gitRepoLink && (
              <div className="mt-6 border-t border-gray-800 pt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <span className="text-sm text-gray-400">Latest Activity</span>
                  <button 
                    onClick={fetchLatestCommit}
                    disabled={fetchingCommit}
                    className="flex items-center gap-2 text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition disabled:opacity-50 min-h-[44px] self-start sm:self-auto"
                  >
                    <RefreshCw size={14} className={fetchingCommit ? "animate-spin" : ""} /> 
                    Fetch Commits
                  </button>
                </div>
                
                {latestCommits && latestCommits.length > 0 ? (
                  <div className="space-y-3">
                    {latestCommits.map((commit, idx) => (
                      <div key={idx} className="bg-gray-800 border border-gray-700 rounded-lg p-4 transition hover:border-gray-600">
                        <div className="flex items-start gap-3">
                          <GitBranch size={16} className="text-blue-400 mt-1 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{commit.commit.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              by <span className="text-gray-300">{commit.commit.author.name}</span> • {new Date(commit.commit.author.date).toLocaleString()}
                            </p>
                            <a href={commit.html_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline mt-2 inline-block">
                              View on GitHub →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">Click "Fetch Commits" to see the latest repository activity.</p>
                )}
              </div>
            )}
          </div>

          {/* Tasks/Todos */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold tracking-wide flex items-center">
                TEAM TASKS <span className="text-xs text-gray-500 font-normal ml-2">({doneCount}/{totalCount} done)</span>
              </h3>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">Project Progress</span>
                <span className="text-blue-400 font-medium">{progress}%</span>
              </div>
              <div className="bg-gray-800 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                placeholder="Add a new task..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-[44px]"
              />
              <button 
                onClick={handleAddTodo}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-2 rounded-lg transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {(!team.todos || team.todos.length === 0) ? (
                <p className="text-xs text-gray-500 text-center py-4">No tasks added yet. Start planning!</p>
              ) : (
                team.todos.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between py-2.5 px-3 bg-gray-800/50 rounded-lg group"
                  >
                    <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => handleToggleTodo(task.id)}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition ${task.completed ? "bg-blue-600 border-blue-600" : "border-gray-500"}`}>
                        {task.completed && <Check size={10} className="text-white" />}
                      </div>
                      <span className={`text-sm transition ${task.completed ? "text-gray-500 line-through" : "text-gray-200"}`}>
                        {task.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteTodo(task.id)}
                      className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1"
                    >
                      <Plus size={14} className="rotate-45" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-5">
            <h3 className="text-xs text-gray-500 tracking-widest mb-4">TEAM MEMBERS</h3>
            <div className="space-y-3">
              {team.members.map((m) => {
                const isLeader = team.teamLeader?._id === m._id || team.teamLeader === m._id;
                const initials = (m.username || "??").slice(0,2).toUpperCase();
                const color = `hsl(${(m.username || "").length * 40}, 40%, 25%)`;
                return (
                  <div key={m._id} className="flex items-center gap-3 min-h-[44px]">
                    {m.profilePicture ? (
                      <img loading="lazy" src={m.profilePicture} alt={m.username} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0" style={{ backgroundColor: color, color: "#fff" }}>
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-white flex items-center gap-1">
                        <span className="truncate">{m.username}</span>
                        {isLeader && <span className="text-yellow-400 text-xs shrink-0" title="Team Leader">👑</span>}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{m.college || "Developer"} <span className="text-green-500 text-[10px] ml-1">Accepted</span></p>
                    </div>
                  </div>
                );
              })}

              {/* Pending Invites */}
              {team.pendingInvites && team.pendingInvites.map((m) => {
                const initials = (m.username || "??").slice(0,2).toUpperCase();
                const color = `hsl(${(m.username || "").length * 40}, 40%, 25%)`;
                return (
                  <div key={`pending-${m._id}`} className="flex items-center gap-3 opacity-60 min-h-[44px]">
                    {m.profilePicture ? (
                      <img loading="lazy" src={m.profilePicture} alt={m.username} className="w-8 h-8 rounded-lg object-cover grayscale shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold grayscale shrink-0" style={{ backgroundColor: color, color: "#fff" }}>
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-white flex items-center gap-1 truncate">
                        {m.username} 
                      </p>
                      <p className="text-xs text-gray-500 truncate">{m.college || "Developer"} <span className="text-yellow-500 text-[10px] ml-1">Pending...</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;