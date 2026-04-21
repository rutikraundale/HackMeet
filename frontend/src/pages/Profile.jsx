import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import ProfileTab from "../components/profile/ProfileTab";
import TeamTab from "../components/profile/TeamTab";
import InviteTab from "../components/profile/InviteTab";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { addToast } = useToast();

  const [user, setUser] = useState({
    name: "Ravi Sahane",
    email: "ravi.sahane@hackmeet.io",
    bio: "Full-stack developer with a passion for building scalable architecture and AI-driven tools.",
    skills: ["React", "Node.js", "MongoDB", "Express", "Java", "Python"],
    links: ["https://github.com/ravisahane", "https://linkedin.com/in/ravisahane"],
    profilePic: "",
  });

  const [editData, setEditData] = useState({
    bio: user.bio,
    skills: user.skills.join(", "),
    links: user.links.join(", "),
    profilePic: "",
  });

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const handleEdit = () => {
    setEditData({
      bio: user.bio,
      skills: user.skills.join(", "),
      links: user.links.join(", "),
      profilePic: user.profilePic,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser((prev) => ({
      ...prev,
      bio: editData.bio,
      skills: editData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      links: editData.links.split(",").map((l) => l.trim()).filter(Boolean),
      profilePic: editData.profilePic,
    }));
    setIsEditing(false);
    addToast("Profile updated!", "success");
  };

  const handleCancel = () => setIsEditing(false);

  const handleInputChange = (field, value) =>
    setEditData((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setEditData((prev) => ({ ...prev, profilePic: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // ── Invite handlers ───────────────────────────────────────────────────────
  const handleAccept = (teamName) =>
    addToast(`Invitation from ${teamName} accepted!`, "success");

  const handleReject = (teamName) =>
    addToast(`Invitation from ${teamName} rejected`, "warning");

  // ── Tab config ────────────────────────────────────────────────────────────
  const tabs = [
    { key: "profile", label: "👤 User Profile" },
    { key: "team",    label: "👥 Your Team" },
    { key: "invite",  label: "✉️ Invitations" },
  ];

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">

      {/* ── Tabs ── */}
      <div className="flex gap-8 border-b border-slate-700 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`pb-3 font-medium transition text-sm ${
              activeTab === key
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab Panels ── */}
      {activeTab === "profile" && (
        <ProfileTab
          user={user}
          isEditing={isEditing}
          editData={editData}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
        />
      )}

      {activeTab === "team" && (
        <TeamTab />
      )}

      {activeTab === "invite" && (
        <InviteTab onAccept={handleAccept} onReject={handleReject} />
      )}
    </div>
  );
};

export default Profile;