import React from "react";
import { Edit, Save, X } from "lucide-react";

const ProfileTab = ({
  user,
  isEditing,
  editData,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onFileChange,
}) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* ── Left: Profile Card ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          {isEditing ? (
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="text-sm text-gray-400"
              />
              {editData.profilePic && (
                <img
                  src={editData.profilePic}
                  alt="profile preview"
                  className="w-24 h-24 rounded-lg mt-2 mx-auto object-cover"
                />
              )}
            </div>
          ) : (
            <img
              src={user.profilePic || "https://via.placeholder.com/96"}
              alt="profile"
              className="w-24 h-24 rounded-lg mb-4 object-cover"
            />
          )}

          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-400 text-sm">{user.email}</p>

          {/* Bio */}
          {isEditing ? (
            <textarea
              value={editData.bio}
              onChange={(e) => onInputChange("bio", e.target.value)}
              className="w-full mt-4 p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm resize-none focus:outline-none focus:border-blue-500 transition"
              rows="3"
              placeholder="Enter your bio..."
            />
          ) : (
            <p className="text-gray-400 text-sm mt-4">{user.bio}</p>
          )}
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h4 className="text-xs text-gray-400 mb-3 tracking-widest">
            TECHNICAL ARSENAL
          </h4>
          {isEditing ? (
            <input
              type="text"
              value={editData.skills}
              onChange={(e) => onInputChange("skills", e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 transition"
              placeholder="Enter skills separated by commas..."
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <span key={i} className="bg-slate-700 px-3 py-1 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="mt-6">
          <h4 className="text-xs text-gray-400 mb-3 tracking-widest">LINKS</h4>
          {isEditing ? (
            <input
              type="text"
              value={editData.links}
              onChange={(e) => onInputChange("links", e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 transition"
              placeholder="Enter links separated by commas..."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {user.links.map((link, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm break-all transition"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Edit / Save / Cancel */}
        <div className="mt-6 flex justify-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm transition"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 text-sm transition"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 text-sm transition"
            >
              <Edit size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ── Right: Current Deployment ── */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <p className="text-xs text-gray-400 mb-2 tracking-widest">
            CURRENT DEPLOYMENT
          </p>
          <h3 className="text-lg font-semibold">Team Syntax</h3>
          <p className="text-gray-400 text-sm mb-4">Web3 Global Build Hackathon</p>

          <div className="bg-slate-900 rounded-full h-3">
            <div className="bg-blue-500 h-3 rounded-full w-0" />
          </div>
          <p className="text-right text-sm mt-1 text-gray-400">0%</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
