import React, { useState, useMemo } from "react";
import { Plus, Search, ArrowLeft, Check } from "lucide-react";
import { showToast } from "../utils/toastUtils";

const STATUS = {
  live: "text-green-400",
  dev: "text-blue-400",
  done: "text-purple-400",
  paused: "text-yellow-400",
};

const Projects = () => {
  const [projects, setProjects] = useState([
    { id: "1", name: "ChainVault", status: "live", progress: 60, tags: ["React"], desc: "Web3 app" },
  ]);
  const [tasks, setTasks] = useState({
    1: [{ id: 1, text: "Setup", done: true }],
  });

  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", desc: "", tags: "" });
  const [show, setShow] = useState(false);

  const selected = projects.find((p) => p.id === selectedId);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.tags.join("").toLowerCase().includes(search.toLowerCase())
      ),
    [projects, search]
  );

  const createProject = () => {
    if (!form.name) return showToast("Enter name", "error");
    const id = Date.now().toString();
    setProjects([{ id, ...form, status: "dev", progress: 0, tags: form.tags.split(",") }, ...projects]);
    setTasks({ ...tasks, [id]: [] });
    setForm({ name: "", desc: "", tags: "" });
    setShow(false);
  };

  const toggleTask = (tid) => {
    setTasks({
      ...tasks,
      [selectedId]: tasks[selectedId].map((t) =>
        t.id === tid ? { ...t, done: !t.done } : t
      ),
    });
  };

  // ── DETAIL VIEW ──
  if (selected) {
    return (
      <div className="p-6 text-white">
        <button onClick={() => setSelectedId(null)} className="text-blue-400 flex gap-2 mb-4">
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-xl font-bold">{selected.name}</h1>
        <p className="text-gray-400 mb-4">{selected.desc}</p>

        {tasks[selectedId]?.map((t) => (
          <div key={t.id} onClick={() => toggleTask(t.id)} className="flex gap-2 cursor-pointer">
            {t.done ? <Check size={14} /> : "⬜"} {t.text}
          </div>
        ))}
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="p-6 text-white">

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-gray-900 p-4 rounded">
            <input placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Desc" value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            <input placeholder="Tags" value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })} />

            <button onClick={createProject}>Create</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl">Projects</h1>
        <button onClick={() => setShow(true)} className="bg-blue-600 px-3 py-1 flex gap-1">
          <Plus size={16} /> New
        </button>
      </div>

      {/* Search */}
      <div className="flex bg-gray-800 p-2 mb-4">
        <Search size={16} />
        <input
          className="bg-transparent ml-2 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
      </div>

      {/* Projects */}
      <div className="grid gap-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className="bg-gray-900 p-3 rounded cursor-pointer"
          >
            <p className="font-bold">{p.name}</p>
            <p className={`text-sm ${STATUS[p.status]}`}>{p.status}</p>
            <p className="text-xs text-gray-400">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;