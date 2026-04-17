import React, { useState, useRef, useEffect } from "react";
import { useToast } from "../context/ToastContext";

const ChatWindow = ({ user, messages, setMessages }) => {
  const [input, setInput] = useState("");
  const { addToast } = useToast();


  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender === "me" && msg.receiver === user.id) ||
      (msg.sender === user.id && msg.receiver === "me")
  );


  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      text: input,
      sender: "me",
      receiver: user.id,
      time: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMsg]); // add message globally
    addToast("Message sent!", "success");
    setInput("");
  };

    const inputRef = useRef(null);
    useEffect(() => {
     inputRef.current?.focus();
    }, [user]); 

  return (
    <div className="flex flex-col h-full">


      <div className="border-b border-gray-700 p-3 text-lg font-semibold">
        {user.name}
      </div>


      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredMessages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet</p>
        ) : (
          filteredMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.sender === "me" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-xs p-2 rounded-lg ${
                  msg.sender === "me"
                    ? "bg-gray-900 text-right"
                    : "bg-blue-500 text-left"
                }`}
              >
                <p>{msg.text}</p>
              </div>

              <span className="text-xs text-gray-400 mt-1">
                {msg.time}
              </span>
            </div>
          ))
        )}
      </div>

    
      <div className=" p-3  flex  border border-gray-600 ">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1   rounded bg-gray-800  focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-2 rounded hover:bg-blue-700"
        >
          ➤
        </button>
      </div>

    </div>
  );
};

export default ChatWindow;