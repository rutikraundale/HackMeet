import React, { useState } from "react";
import { Edit, Trash2, Save, X } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "Ravi Sahane",
    email: "ravi@example.com",
    phone: "+91 9876543210",
    skills: ["React", "Node.js", "MongoDB"],
  });

  const [formData, setFormData] = useState(user);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log("Delete profile");
    // 👉 connect Firebase delete here
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6 flex justify-center">
      
      <div className="w-full max-w-4xl space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <h1 className="text-2xl font-bold">My Profile</h1>

          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                >
                  <Edit size={16} /> Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                >
                  <Save size={16} /> Save
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                >
                  <X size={16} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 grid md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="text-xs text-gray-400">Full Name</label>
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded"
              />
            ) : (
              <p className="mt-1">{user.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs text-gray-400">Phone</label>
            {isEditing ? (
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded"
              />
            ) : (
              <p className="mt-1">{user.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="text-xs text-gray-400">Email</label>
            {isEditing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded"
              />
            ) : (
              <p className="mt-1">{user.email}</p>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm text-gray-400 mb-4">
            SKILLS
          </h3>

          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-slate-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;