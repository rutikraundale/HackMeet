import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import ProfileTab from "../components/profile/ProfileTab";
import TeamTab from "../components/profile/TeamTab";
import InviteTab from "../components/profile/InviteTab";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { addToast } = useToast();
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    bio: "",
    skills: "",
    links: "",
    college: "",
    profilePic: null, // File object
    profilePicPreview: "",
  });

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const handleEdit = () => {
    setEditData({
      bio: user?.bio || "",
      skills: (user?.skills || []).join(", "),
      links: (user?.socialLinks || []).join(", "),
      college: user?.college || "",
      profilePic: null,
      profilePicPreview: user?.profilePicture || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("bio", editData.bio);
      formData.append("college", editData.college);
      formData.append("skills", JSON.stringify(
        editData.skills.split(",").map((s) => s.trim()).filter(Boolean)
      ));
      formData.append("socialLinks", JSON.stringify(
        editData.links.split(",").map((l) => l.trim()).filter(Boolean)
      ));
      if (editData.profilePic) {
        formData.append("profilePicture", editData.profilePic);
      }

      await updateProfile(formData);
      setIsEditing(false);
      addToast("Profile updated! ✅", "success");
    } catch (err) {
      addToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setIsEditing(false);

  const handleInputChange = (field, value) =>
    setEditData((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditData((prev) => ({ ...prev, profilePic: file }));
    const reader = new FileReader();
    reader.onload = (ev) =>
      setEditData((prev) => ({ ...prev, profilePicPreview: ev.target.result }));
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

  // Map user data into the format ProfileTab expects
  const profileUser = {
    name: user?.username || "User",
    email: user?.email || "",
    bio: user?.bio || "No bio yet. Click Edit to add one!",
    skills: user?.skills || [],
    links: user?.socialLinks || [],
    profilePic: user?.profilePicture || "",
    college: user?.college || "",
  };

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
          user={profileUser}
          isEditing={isEditing}
          editData={{
            ...editData,
            profilePic: editData.profilePicPreview,
          }}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          saving={saving}
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