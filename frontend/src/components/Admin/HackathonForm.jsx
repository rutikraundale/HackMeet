import React, { useState } from "react";
import {
  Plus,
  Trophy,
  MapPin,
  Calendar,
  Users,
  Gift,
  CheckCircle,
} from "lucide-react";

/**
 * HackathonForm
 * Renders the "Create Hackathon" form with full validation and a simulated API submit.
 *
 * Props:
 *  - onCreated (function): called with the new hackathon payload after a successful submit
 */
const HackathonForm = ({ onCreated }) => {
  // ── Form field state ────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    teamsize: "",
    prizes: "",
  });

  // Tracks which fields have validation errors
  const [errors, setErrors] = useState({});

  // Controls the green success banner
  const [success, setSuccess] = useState(false);

  // Controls the loading spinner on the submit button
  const [loading, setLoading] = useState(false);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Hackathon name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = "End date must be after start date";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.teamsize || isNaN(form.teamsize) || Number(form.teamsize) < 1)
      e.teamsize = "Valid team size is required";
    return e;
  };

  // ── Handlers ────────────────────────────────────────────────────────────────

  // Updates a single form field and clears its error if present
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    // Run validation first
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setLoading(true);

    // Simulate a network request (replace with real API call when ready)
    setTimeout(() => {
      const payload = {
        ...form,
        teamsize: Number(form.teamsize),
        // Convert comma-separated prizes string → array of strings
        prizes: form.prizes
          ? form.prizes.split(",").map((p) => p.trim()).filter(Boolean)
          : [],
      };

      onCreated(payload); // notify parent

      // Reset form after success
      setForm({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        teamsize: "",
        prizes: "",
      });
      setErrors({});
      setSuccess(true);
      setLoading(false);

      // Hide the success banner after 3.5 seconds
      setTimeout(() => setSuccess(false), 3500);
    }, 800);
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────

  // Returns the correct border color class based on whether the field has an error
  const inputClass = (field) =>
    `w-full bg-slate-700 border rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none transition ${errors[field]
      ? "border-red-500 focus:border-red-400"
      : "border-slate-600 focus:border-blue-500"
    }`;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      {/* Form Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
          <Trophy size={18} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-lg">New Hackathon</h2>
          <p className="text-gray-400 text-xs">Fill in all details to publish</p>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="mb-5 flex items-center gap-3 bg-green-900/30 border border-green-500/40 rounded-lg px-4 py-3 text-green-300 text-sm">
          <CheckCircle size={16} />
          Hackathon created successfully!
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">Hackathon Name *</label>
          <input
            id="admin-hack-name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}

            className={inputClass("name")}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">Description *</label>
          <textarea
            id="admin-hack-description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="What's this hackathon about?"
            rows={3}
            className={`${inputClass("description")} resize-none`}
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Start Date & End Date side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> Start Date *
              </span>
            </label>
            <input
              id="admin-hack-start"
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className={`${inputClass("startDate")} [color-scheme:dark]`}
            />
            {errors.startDate && (
              <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> End Date *
              </span>
            </label>
            <input
              id="admin-hack-end"
              type="date"
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className={`${inputClass("endDate")} [color-scheme:dark]`}
            />
            {errors.endDate && (
              <p className="text-red-400 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> Location *
            </span>
          </label>
          <input
            id="admin-hack-location"
            type="text"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
           
            className={inputClass("location")}
          />
          {errors.location && (
            <p className="text-red-400 text-xs mt-1">{errors.location}</p>
          )}
        </div>

        {/* Team Size */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">
            <span className="flex items-center gap-1">
              <Users size={12} /> Max Team Size *
            </span>
          </label>
          <input
            id="admin-hack-teamsize"
            type="number"
            min="1"
            max="20"
            value={form.teamsize}
            onChange={(e) => handleChange("teamsize", e.target.value)}
            placeholder="e.g., 5"
            className={inputClass("teamsize")}
          />
          {errors.teamsize && (
            <p className="text-red-400 text-xs mt-1">{errors.teamsize}</p>
          )}
        </div>

        {/* Prizes */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">
            <span className="flex items-center gap-1">
              <Gift size={12} /> Prizes (comma-separated)
            </span>
          </label>
          <input
            id="admin-hack-prizes"
            type="text"
            value={form.prizes}
            onChange={(e) => handleChange("prizes", e.target.value)}

            className={inputClass("prizes")}
          />
          <p className="text-gray-500 text-xs mt-1">Separate multiple prizes with commas</p>
        </div>

        {/* Submit Button */}
        <button
          id="admin-hack-submit"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 mt-2"
        >
          {/* Show spinner when loading, otherwise show + icon */}
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus size={18} />
          )}
          {loading ? "Creating..." : "Create Hackathon"}
        </button>
      </div>
    </div>
  );
};

export default HackathonForm;
