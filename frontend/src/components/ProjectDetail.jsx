import React from "react";
import { ArrowLeft, Check, ExternalLink, GitBranch, Trash2 } from "lucide-react";
import { STATUS_CONFIG } from "../data/projectData";

const ProjectDetail = ({ project, tasks, onBack, onToggleTask, onDelete }) => {
  const { badge, label, bar } = STATUS_CONFIG[project.status];
  const doneTasks = tasks.filter((t) => t.done).length;

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition text-sm"
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Header card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-semibold"
              style={{ backgroundColor: project.members[0].color, color: project.members[0].textColor }}
            >
              {project.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{project.hackathon}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${badge}`}>{label}</span>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/40 border border-blue-800 text-blue-400 text-xs rounded-lg hover:bg-blue-900/60 transition">
                <ExternalLink size={12} /> Demo
              </a>
            )}
            <a href={project.github} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg hover:text-white transition">
             <GitBranch size={12} /> GitHub
            </a>
            <button onClick={() => onDelete(project.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/20 border border-red-900/40 text-red-400 text-xs rounded-lg hover:bg-red-900/30 transition">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-5">{project.desc}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500">Overall Progress</span>
            <span className="text-blue-400 font-medium">{project.progress}%</span>
          </div>
          <div className="bg-gray-800 rounded-full h-2">
            <div className={`h-2 rounded-full ${bar}`} style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">{tag}</span>
          ))}
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Tasks */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-xs text-gray-500 tracking-widest mb-4">
            TASKS ({doneTasks}/{tasks.length} done)
          </h3>
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="flex items-center gap-3 py-2.5 border-b border-gray-800 last:border-0 cursor-pointer group"
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition ${task.done ? "bg-blue-600 border-blue-600" : "border-gray-600 group-hover:border-blue-500"
                }`}>
                {task.done && <Check size={10} className="text-white" />}
              </div>
              <span className={`text-sm transition ${task.done ? "text-gray-600 line-through" : "text-gray-300"}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Team */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-xs text-gray-500 tracking-widest mb-4">TEAM MEMBERS</h3>
            {project.members.map((m, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ backgroundColor: m.color, color: m.textColor }}
                >
                  {m.initials}
                </div>
                <div>
                  <p className="text-sm text-white">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-xs text-gray-500 tracking-widest mb-4">LINKS & RESOURCES</h3>
            {[
              { label: "GitHub Repository", href: project.github },
              ...(project.demo ? [{ label: "Live Demo", href: project.demo }] : []),
              { label: "Project Docs", href: "#" },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="flex justify-between items-center py-2.5 border-b border-gray-800 last:border-0 text-sm text-gray-300 hover:text-blue-400 transition">
                <span>{label}</span>
                <ExternalLink size={12} className="text-gray-600" />
              </a>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;