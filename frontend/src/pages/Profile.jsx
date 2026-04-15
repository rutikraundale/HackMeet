import React, { useState } from "react";
import { Users, Mail, Check, X } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");


  const user = {
    name: "Ravi Sahane",
    email: "ravi.sahane@hackmeet.io",
    bio: "Full-stack developer with a passion for building scalable architecture and AI-driven tools.",
    skills: ["React", "Node.js", "MongoDB", "Express", "Java", "Python"],
  };
const handleReject = (data) => {
  console.log("Invitation rejected",data);
}
const handleAccept = (data) => {
  console.log("Invitation accepted",data);
}
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
            
            <img
              src=""
              alt="profile"
              className="w-24 h-24 rounded-lg mb-4"
            />

            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>

            <p className="text-gray-400 text-sm mt-4">
              {user.bio}
            </p>
          </div>

          {/* Skills */}
          <div className="mt-6">
            <h4 className="text-xs text-gray-400 mb-3 tracking-widest">
              TECHNICAL ARSENAL
            </h4>

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