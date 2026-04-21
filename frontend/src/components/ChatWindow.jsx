import React, { useState, useRef, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { useSocket } from "../context/SocketContext";
import { get, post } from "../utils/api";

const ChatWindow = ({ user, currentUserId, onMessageSent }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch messages when user changes
  useEffect(() => {
    if (!user?._id) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await get(`/messages/${user._id}`);
        setMessages(data.data || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user?._id]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg) => {
      // Only add if it's from the currently selected user
      if (newMsg.sender === user?._id || newMsg.reciever === user?._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, user?._id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [user]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    try {
      const data = await post(`/messages/${user._id}`, { text });
      setMessages((prev) => [...prev, data.data]);
      if (onMessageSent) onMessageSent();
    } catch (err) {
      addToast("Failed to send message", "error");
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="border-b border-gray-700 p-3 flex items-center gap-3">
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
            {(user.username || "?").slice(0, 2).toUpperCase()}
          </div>
        )}
        <span className="text-lg font-semibold">{user.username}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">
            No messages yet. Say hello! 👋
          </p>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender === currentUserId;
            return (
              <div
                key={msg._id || i}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    isMe
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 flex gap-2 border-t border-gray-700">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 transition text-sm"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;