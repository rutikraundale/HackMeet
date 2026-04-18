import React, { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { showToast } from "../utils/toastUtils";
import { INITIAL_PROJECTS, INITIAL_TASKS, TABS, EMPTY_FORM } from "../data/projectData";
import ProjectCard from "../components/ProjectCard";
import ProjectDetail from "../components/ProjectDetail";
import CreateProjectModal from "../components/CreateProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks]       = useState(INITIAL_TASKS);
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab]           = useState("all");
  const [search, setSearch]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);

  const selectedProject = projects.find((p) => p.id === selectedId);

  const counts = useMemo(() => ({
    all:    projects.length,
    live:   projects.filter((p) => p.status === "live").length,
    dev:    projects.filter((p) => p.status === "dev").length,
    done:   projects.filter((p) => p.status === "done").length,
    paused: projects.filter((p) => p.status === "paused").length,
  }), [projects]);

  const filtered = useMemo(() => projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q)
      || p.hackathon.toLowerCase().includes(q)
      || p.tags.some((t) => t.toLowerCase().includes(q));
    return matchSearch && (tab === "all" || p.status === tab);
  }), [projects, search, tab]);

  const handleFormChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleCreate = () => {
    if (!form.name.trim()) { showToast("Please enter a project name", "error"); return; }
    const id = `p-${Date.now()}`;
    setProjects((prev) => [{
      id, name: form.name, hackathon: form.hackathon || "—",
      desc: form.desc || "No description yet.", status: form.status, progress: 0,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      members: [{ initials: "ME", name: "You", role: "Developer", color: "#1a3a5c", textColor: "#b8d4f8" }],
      updated: "just now", github: "#", demo: null,
    }, ...prev]);
    setTasks((prev) => ({ ...prev, [id]: [
      { id: 1, text: "Set up project repository", done: false },
      { id: 2, text: "Define MVP scope", done: false },
      { id: 3, text: "Start building", done: false },
    ]}));
    setForm(EMPTY_FORM);
    setShowModal(false);
    showToast("Project created! 🎉", "success");
  };

  const handleToggleTask = (taskId) => {
    setTasks((prev) => ({
      ...prev,
      [selectedId]: prev[selectedId].map((t) => t.id === taskId ? { ...t, done: !t.done } : t),
    }));
  };

  const handleDelete = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSelectedId(null);
    showToast("Project deleted", "info");
  };

  if (selectedProject) {
    return (
      <div className="p-6 bg-gray-950 min-h-screen text-white">
        <ProjectDetail
          project={selectedProject}
          tasks={tasks[selectedId] || []}
          onBack={() => setSelectedId(null)}
          onToggleTask={handleToggleTask}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {showModal && (
        <CreateProjectModal
          form={form}
          onChange={handleFormChange}
          onSave={handleCreate}
          onClose={() => { setShowModal(false); setForm(EMPTY_FORM); }}
        />
      )}

      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-400 mt-1">Track your hackathon builds from idea to deployment.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total",       value: counts.all,  color: "text-white"      },
          { label: "Live",        value: counts.live, color: "text-green-400"  },
          { label: "In Progress", value: counts.dev,  color: "text-blue-400"   },
          { label: "Completed",   value: counts.done, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex border-b border-gray-800 mb-5">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm border-b-2 transition -mb-px ${
              tab === key ? "border-blue-500 text-blue-400" : "border-transparent text-gray-500 hover:text-gray-300"
            }`}>
            {label} <span className="ml-1 text-xs text-gray-600">{counts[key]}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mb-5 focus-within:border-blue-500 transition">
        <Search className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects, hackathons, tech stack..."
          className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-600" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500 mb-3">No projects match your filters.</p>
          <button onClick={() => { setSearch(""); setTab("all"); }} className="text-sm text-blue-400 hover:text-blue-300">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelectedId(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;