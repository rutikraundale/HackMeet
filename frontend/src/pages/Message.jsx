import React, { useState } from "react";
import ChatWindow from "../components/ChatWindow";

const Message = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const users = [
    { id: "1", name: "Sarah Chen" },
    { id: "2", name: "Marcus Kim" },
    { id: "3", name: "Jordan Lee" },
  ];

  return (
    <div className="flex h-[calc(100vh-60px)] text-white">

      {/* LEFT SIDEBAR */}
      <div className="w-1/3 bg-gray-900 p-6 ">
        <h2 className="mb-4 text-lg font-bold">Users</h2>

        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className="cursor-pointer p-3 rounded hover:bg-gray-700"
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="w-2/3 bg-gray-800 p-4">
        {selectedUser ? (
         <ChatWindow 
            user={selectedUser} 
              messages={messages}
              setMessages={setMessages}
/>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400">
            Select a user to start chatting
          </div>
        )}
      </div>

    </div>
  );
};

export default Message;