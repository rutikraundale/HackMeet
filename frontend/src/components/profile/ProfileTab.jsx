import React from "react";
import { Edit, Save, X, Mail, GraduationCap, FileText, Link as LinkIcon, Code, Camera, Trash2, Send, CheckCircle2 } from "lucide-react";

const ProfileTab = ({
  user,
  isEditing,
  editData,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onFileChange,
  onRemovePicture,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center shrink-0 w-full md:w-auto">
            {isEditing ? (
              <div className="mb-6 flex flex-col items-center relative group">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-600 shadow-lg bg-slate-900 flex items-center justify-center">
                  {editData.profilePic ? (
                    <img loading="lazy"
                      src={editData.profilePic}
                      alt="profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img loading="lazy"
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`}
                      alt="current profile"
                      className="w-full h-full object-cover opacity-50"
                    />
                  )}
                  
                  {/* Hover Overlay for Upload */}
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera size={24} className="text-white mb-1" />
                    <span className="text-xs text-white font-medium">Change</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  onClick={onRemovePicture}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition"
                >
                  <Trash2 size={14} />
                  Remove Picture
                </button>
              </div>
            ) : (
              <img loading="lazy"
                src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`}
                alt="profile"
                className="w-32 h-32 rounded-2xl mb-4 object-cover shadow-lg border border-slate-700"
              />
            )}

            {/* Edit / Save Buttons */}
            <div className="mt-4 flex flex-col gap-2 w-full">
              {isEditing ? (
                <>
                  <button
                    onClick={onSave}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-sm font-medium transition shadow-lg shadow-blue-900/20"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={onCancel}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 text-sm font-medium transition"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={onEdit}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 text-sm font-medium transition"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 w-full space-y-6">
            <div>
            <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
            <div className="flex flex-col gap-2 mt-3">
              <div className="flex items-center gap-3 text-gray-400">
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === 'open'
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-yellow-900/30 text-yellow-300'
                }`}>
                  {user.status === 'open' ? '✓ Available for Teams' : '⏳ Currently Busy'}
                </span>
                {isEditing && (
                  <select
                    value={editData.status}
                    onChange={(e) => onInputChange("status", e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="open">Available</option>
                    <option value="busy">Busy</option>
                  </select>
                )}
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={16} className="text-gray-500" />
                <span className="text-sm">{user.email}</span>
              </div>
                
                <div className="flex items-center gap-3 text-gray-400">
                  <GraduationCap size={16} className="text-gray-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.college}
                      onChange={(e) => onInputChange("college", e.target.value)}
                      className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-blue-500 transition"
                      placeholder="Enter your college..."
                    />
                  ) : (
                    <span className="text-sm">{user.college || "College not specified"}</span>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-slate-700" />

            {/* Bio */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} className="text-blue-400" />
                <h4 className="text-sm font-semibold text-gray-200 tracking-wide">ABOUT ME</h4>
              </div>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => onInputChange("bio", e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-blue-500 transition"
                  rows="4"
                  placeholder="Enter your bio..."
                />
              ) : (
                <p className="text-gray-400 text-sm leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Code size={18} className="text-blue-400" />
                <h4 className="text-sm font-semibold text-gray-200 tracking-wide">TECHNICAL ARSENAL</h4>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.skills}
                  onChange={(e) => onInputChange("skills", e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="Enter skills separated by commas (e.g. React, Node.js, Python)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.skills.length > 0 ? user.skills.map((skill, i) => (
                    <span key={i} className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-gray-300 font-medium hover:border-slate-500 hover:text-white transition cursor-default shadow-sm">
                      {skill}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-500 italic">No skills added yet</span>
                  )}
                </div>
              )}
            </div>

            {/* Links */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon size={18} className="text-blue-400" />
                <h4 className="text-sm font-semibold text-gray-200 tracking-wide">LINKS</h4>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.links}
                  onChange={(e) => onInputChange("links", e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="Enter links separated by commas..."
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {user.links.length > 0 ? user.links.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm break-all transition hover:underline bg-slate-900/50 p-2 rounded-lg border border-slate-700/50"
                    >
                      {link}
                    </a>
                  )) : (
                    <span className="text-sm text-gray-500 italic">No links added yet</span>
                  )}
                </div>
              )}
              </div>

            {/* Telegram Connect */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Send size={18} className="text-blue-400" />
                <h4 className="text-sm font-semibold text-gray-200 tracking-wide">TELEGRAM NOTIFICATIONS</h4>
              </div>
              {user.telegramChatId ? (
                <div className="flex items-center gap-3 bg-green-900/20 border border-green-500/30 rounded-xl px-4 py-3">
                  <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-400">Connected</p>
                    <p className="text-xs text-gray-400">You'll receive team invites & hackathon alerts on Telegram.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-4 space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Connect Telegram to get real-time notifications for team invitations and hackathon updates.
                  </p>
                  <a
                    href={`https://t.me/${import.meta.env.VITE_TELEGRAM_BOT_USERNAME}?start=${user._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#229ED9] hover:bg-[#1a8bbf] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-sky-900/30 active:scale-95"
                  >
                    <Send size={15} />
                    Connect Telegram for Notifications
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
