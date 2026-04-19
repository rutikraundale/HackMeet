import React, { useState } from "react";
import { Users, Mail, Check, X, Edit, Save } from "lucide-react";
import { useToast } from "../context/ToastContext";

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
    profilePic: ""
  });

  const [editData, setEditData] = useState({
    bio: "Full-stack developer with a passion for building scalable architecture and AI-driven tools.",
    skills: "React, Node.js, MongoDB, Express, Java, Python",
    links: "https://github.com/ravisahane, https://linkedin.com/in/ravisahane",
    profilePic: ""
  });

  const handleEdit = () => {
    setEditData({
      bio: user.bio,
      skills: user.skills.join(", "),
      links: user.links.join(", "),
      profilePic: user.profilePic
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      bio: editData.bio,
      skills: editData.skills.split(",").map(s => s.trim()).filter(s => s),
      links: editData.links.split(",").map(l => l.trim()).filter(l => l),
      profilePic: editData.profilePic
    };
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({ ...prev, profilePic: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleReject = (data) => {
    addToast(`Invitation from ${data} rejected`, "warning");
  };

  const handleAccept = (data) => {
    addToast(`Invitation from ${data} accepted!`, "success");
  };
  return (
    <div className=" p-6 bg-gray-950 min-h-screen text-white">
      
      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400"
          }`}
        >
          👤 User Profile
        </button>

        <button
          onClick={() => setActiveTab("team")}
             className={`pb-3 ${
            activeTab === "team"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400"
          }`}
        >
          👥 Your Team
        </button>

        <button
          onClick={() => setActiveTab("invite")}
          className={`pb-3 ${
            activeTab === "invite"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400"
          }`}
        >
          ✉️ Invitations
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* LEFT PROFILE CARD */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex flex-col items-center text-center">
            
            {isEditing ? (
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-gray-400"
                />
                {editData.profilePic && (
                  <img
                    src={editData.profilePic}
                    alt="profile preview"
                    className="w-24 h-24 rounded-lg mt-2 mx-auto"
                  />
                )}
              </div>
            ) : (
              <img
                src={user.profilePic || "https://via.placeholder.com/96"}
                alt="profile"
                className="w-24 h-24 rounded-lg mb-4"
              />
            )}

            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>

            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="w-full mt-4 p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm resize-none"
                rows="3"
                placeholder="Enter your bio..."
              />
            ) : (
              <p className="text-gray-400 text-sm mt-4">
                {user.bio}
              </p>
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
                onChange={(e) => handleInputChange("skills", e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                placeholder="Enter skills separated by commas..."
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-slate-700 px-3 py-1 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="mt-6">
            <h4 className="text-xs text-gray-400 mb-3 tracking-widest">
              LINKS
            </h4>

            {isEditing ? (
              <input
                type="text"
                value={editData.links}
                onChange={(e) => handleInputChange("links", e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
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
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Edit/Save Buttons */}
          <div className="mt-6 flex justify-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 text-sm"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 text-sm"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:col-span-2 space-y-6">

          {/* CURRENT PROJECT */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-xs text-gray-400 mb-2">
              CURRENT DEPLOYMENT
            </p>

            <h3 className="text-lg font-semibold">
              Team Syntax
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Web3 Global Build Hackathon
            </p>

            {/* Progress Bar */}
            <div className="bg-slate-900 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full w-[0]"></div>
            </div>
            <p className="text-right text-sm mt-1 text-gray-400">
              0%
            </p>
          </div>

          {/* INVITATIONS */}
          <div>
            <h3 className="text-gray-300 mb-3">
              Pending Invitations
            </h3>

            {/* Card 1 */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center mb-3">
              <div>
                <h4 className="font-semibold">Cloud Mavericks</h4>
                <p className="text-gray-400 text-sm">
                  Data Mesh Summit
                </p>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-1 bg-slate-700 rounded hover:bg-slate-600"
                      onClick={handleReject}>
                  Reject
                </button>
                <button className="px-4 py-1 bg-blue-500 rounded hover:bg-blue-600"
                    onClick={handleAccept}>
                  Accept
                </button>
              </div>
            </div>

          
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;