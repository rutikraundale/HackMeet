import React, { useState, useMemo, useEffect } from "react";
import ChatWindow from "../components/ChatWindow";
import { MessageCircle } from "lucide-react";
import { useParams } from "react-router";
import { get } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Message = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const { id } = useParams();

  // Fetch conversations and all users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convsData, usersData] = await Promise.all([
          get("/messages/conversations"),
          get("/users"),
        ]);
        setConversations(convsData.data || []);
        setAllUsers(usersData.data || []);
      } catch (err) {
        console.error("Failed to fetch messages data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // If navigated with a user ID, select that user
  useEffect(() => {
    if (id && allUsers.length > 0) {
      const target = allUsers.find((u) => u._id === id);
      if (target) {
        setSelectedUser({
          _id: target._id,
          username: target.username,
          profilePicture: target.profilePicture,
        });
      }
    }
  }, [id, allUsers]);

  const filteredUsers = useMemo(() =>
    allUsers.filter((u) =>
      (u.username || "").toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm, allUsers]
  );

  const handleSelectConversation = (conv) => {
    setSelectedUser({
      _id: conv.user._id,
      username: conv.user.username,
      profilePicture: conv.user.profilePicture,
    });
  };

  const refreshConversations = async () => {
    try {
      const data = await get("/messages/conversations");
      setConversations(data.data || []);
    } catch (err) {
      console.error("Failed to refresh conversations:", err);
    }
  };

  return (
    /* Master-detail layout: full height, flex row on md+, stacked on mobile */
    <div className="flex h-[calc(100vh-64px)] text-white relative overflow-hidden">

      {/* ── Contact list (master) ─────────────────────────────────────────── */}
      {/* On mobile: visible when no user selected; hidden when chat is open   */}
      {/* On md+:    always visible (w-1/3)                                   */}
      <div
        className={`
          bg-gray-900 p-4 md:p-6 relative overflow-y-auto
          w-full md:w-1/3
          ${selectedUser ? "hidden md:block" : "block"}
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Messages</h2>
          <button
            onClick={() => setShowNewChat(true)}
            className="bg-blue-600 px-3 py-2 min-h-[44px] rounded text-sm hover:bg-blue-500 transition"
          >
            + New Chat
          </button>
        </div>

        {/* New Chat Modal */}
        {showNewChat && (
          <div className="absolute top-16 left-4 right-4 sm:left-6 sm:right-auto bg-gray-800 p-4 rounded-lg shadow-lg sm:w-72 z-50">
            <h3 className="mb-3 font-semibold">Start New Chat</h3>
            <input
              type="text"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-gray-900 border border-gray-600 focus:outline-none text-sm"
            />
            <div className="max-h-40 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => {
                      setSelectedUser({
                        _id: u._id,
                        username: u.username,
                        profilePicture: u.profilePicture,
                      });
                      setShowNewChat(false);
                      setSearchTerm("");
                    }}
                    className="p-2 hover:bg-gray-700 cursor-pointer rounded flex items-center gap-3 min-h-[44px]"
                  >
                    {u.profilePicture ? (
                      <img loading="lazy" src={u.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                        {(u.username || "?").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    {u.username}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center">No users found</p>
              )}
            </div>
            <button
              onClick={() => {
                setShowNewChat(false);
                setSearchTerm("");
              }}
              className="mt-3 text-sm text-red-400 min-h-[44px] w-full text-left"
            >
              Close
            </button>
          </div>
        )}

        {/* Conversation List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => handleSelectConversation(conv)}
              className={`cursor-pointer p-3 rounded-lg mb-2 flex items-center gap-3 transition min-h-[56px] ${
                selectedUser?._id === conv.user?._id
                  ? "bg-blue-900/30 border border-blue-500/30"
                  : "hover:bg-gray-800"
              }`}
            >
              {conv.user?.profilePicture ? (
                <img loading="lazy" src={conv.user.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                  {(conv.user?.username || "?").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{conv.user?.username}</p>
                <p className="text-gray-400 text-xs truncate">
                  {conv.lastMessage?.text || "No messages yet"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-8">No conversations yet</p>
        )}
      </div>

      {/* ── Chat area (detail) ───────────────────────────────────────────── */}
      {/* On mobile: visible when user selected; hidden otherwise            */}
      {/* On md+:    always visible (w-2/3)                                 */}
      <div
        className={`
          bg-gray-800 flex flex-col
          w-full md:w-2/3
          ${!selectedUser ? "hidden md:flex" : "flex"}
        `}
      >
        {/* Back button — mobile only, shown when chat is open */}
        {selectedUser && (
          <div className="md:hidden p-3 border-b border-gray-700 flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSelectedUser(null)}
              className="text-blue-400 min-h-[44px] px-2 flex items-center gap-1"
            >
              ← Back
            </button>
            <span className="font-bold truncate">{selectedUser.username}</span>
          </div>
        )}

        {selectedUser ? (
          <ChatWindow
            user={selectedUser}
            currentUserId={user?._id}
            onMessageSent={refreshConversations}
          />
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-gray-700/50 rounded-full p-6 mb-6">
              <MessageCircle size={48} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Select a Conversation</h3>
            <p className="text-gray-500 text-sm">Choose a conversation or start a new chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;