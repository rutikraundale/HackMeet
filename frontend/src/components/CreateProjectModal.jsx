import React from "react";

const Field = ({ label, children }) => (
  <div>
    <label className="text-xs text-gray-400 block mb-1.5">{label}</label>
    {children}
  </div>
);

const inputClass =
  "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition";

const CreateProjectModal = ({ form, onChange, onSave, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4">
      <h3 className="text-lg font-semibold mb-5">New Project</h3>

      <div className="space-y-4">
        <Field label="Project Name">
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. ChainVault"
          />
        </Field>

        <Field label="Hackathon">
          <input
            className={inputClass}
            value={form.hackathon}
            onChange={(e) => onChange("hackathon", e.target.value)}
            placeholder="e.g. Web3 Global Build"
          />
        </Field>

        <Field label="Description">
          <textarea
            className={`${inputClass} resize-none`}
            rows={3}
            value={form.desc}
            onChange={(e) => onChange("desc", e.target.value)}
            placeholder="What are you building?"
          />
        </Field>

        <Field label="Tech Stack (comma separated)">
          <input
            className={inputClass}
            value={form.tags}
            onChange={(e) => onChange("tags", e.target.value)}
            placeholder="React, Node.js, MongoDB"
          />
        </Field>

        <Field label="Status">
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => onChange("status", e.target.value)}
          >
            <option value="dev">In Progress</option>
            <option value="live">Live</option>
            <option value="paused">Paused</option>
          </select>
        </Field>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 text-sm hover:text-white transition"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition"
        >
          Create Project
        </button>
      </div>
    </div>
  </div>
);

export default CreateProjectModal;