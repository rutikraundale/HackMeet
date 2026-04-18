import React from "react";
import { STATUS_CONFIG } from "../data/projectData";

const ProjectCard = ({ project, onClick }) => {
  const { badge, label, bar } = STATUS_CONFIG[project.status];

  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition cursor-pointer"
    >
      {/* Top row */}
      <div className="flex justify-between items-start mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-semibold"
          style={{ backgroundColor: project.members[0].color, color: project.members[0].textColor }}
        >
          {project.name[0]}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge}`}>{label}</span>
      </div>

      <p className="font-semibold text-white">{project.name}</p>
      <p className="text-xs text-gray-500 mt-0.5 mb-2">{project.hackathon}</p>
      <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{project.desc}</p>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="text-blue-400 font-medium">{project.progress}%</span>
        </div>
        <div className="bg-gray-800 rounded-full h-1">
          <div className={`h-1 rounded-full ${bar}`} style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tags.map((tag) => (
          <span key={tag} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded">{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-800">
        <div className="flex -space-x-1">
          {project.members.map((m, i) => (
            <div
              key={i}
              title={m.name}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold border-2 border-gray-900"
              style={{ backgroundColor: m.color, color: m.textColor }}
            >
              {m.initials}
            </div>
          ))}
        </div>
        <span className="text-xs text-gray-600">Updated {project.updated}</span>
      </div>
    </div>
  );
};

export default ProjectCard;