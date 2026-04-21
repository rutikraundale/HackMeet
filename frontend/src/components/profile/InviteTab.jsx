import React, { useState } from "react";
import { Check, X, Mail } from "lucide-react";

// Mock data — replace with real API data when backend is ready
const MOCK_INVITATIONS = [
  {
    id: "inv1",
    teamName: "Cloud Mavericks",
    hackathon: "Data Mesh Summit",
    sender: "Alex Johnson",
  },
  {
    id: "inv2",
    teamName: "Neural Ninjas",
    hackathon: "AI Agent Workshop",
    sender: "Priya Nair",
  },
];

const InviteTab = ({ onAccept, onReject }) => {
  const [invitations, setInvitations] = useState(MOCK_INVITATIONS);

  const handleAccept = (inv) => {
    onAccept(inv.teamName);
    setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
  };

  const handleReject = (inv) => {
    onReject(inv.teamName);
    setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-300 font-medium">Pending Invitations</h3>
        <span className="px-2 py-0.5 bg-blue-900/40 text-blue-400 border border-blue-500/30 rounded-full text-xs">
          {invitations.length} pending
        </span>
      </div>

      {invitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-800/30 rounded-xl border border-slate-700">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
            <Mail size={20} className="text-gray-500" />
          </div>
          <h4 className="text-gray-300 font-medium mb-1">No Pending Invitations</h4>
          <p className="text-gray-500 text-sm">
            You're all caught up! Team invitations will appear here.
          </p>
        </div>
      ) : (
        invitations.map((inv) => (
          <div
            key={inv.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 transition"
          >
            <div>
              <h4 className="font-semibold text-white">{inv.teamName}</h4>
              <p className="text-gray-400 text-sm">{inv.hackathon}</p>
              <p className="text-gray-500 text-xs mt-0.5">Invited by {inv.sender}</p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleReject(inv)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition"
              >
                <X size={14} />
                Reject
              </button>
              <button
                onClick={() => handleAccept(inv)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
              >
                <Check size={14} />
                Accept
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default InviteTab;
