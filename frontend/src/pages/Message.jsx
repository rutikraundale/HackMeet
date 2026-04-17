import React, { useState,useMemo ,useEffect                            } from "react";
import ChatWindow from "../components/ChatWindow";
import { MessageCircle, Users } from "lucide-react";
import { useParams } from "react-router";   

const Message = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {id} = useParams()

  const users = {
  "1": { id: "1", name: "Sarah Chen", role: "Senior Full Stack Dev", location: "San Francisco, CA", bio: "Architecting robust digital experiences with the MERN stack. Passionate about clean code, scalable systems, and collaborative hackathon environments.", skills: ["Java", "JavaScript", "React", "Node.js", "MongoDB"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }, { name: "LeetCode", url: "https://leetcode.com" }], stats: { wins: 24, rank: "Top 5%" }, status: "open" },
  "2": { id: "2", name: "Marcus Kim", role: "ML Engineer", location: "Seoul, South Korea", bio: "Building AI-powered solutions using the latest LLM frameworks. Specializing in NLP and computer vision pipelines.", skills: ["Python", "TensorFlow", "Docker", "AWS"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 12, rank: "Top 15%" }, status: "open" },
  "3": { id: "3", name: "Priya Nair", role: "Frontend Developer", location: "Bangalore, India", bio: "Crafting pixel-perfect UIs with React and Vue. Strong focus on accessibility, performance, and design systems.", skills: ["React", "Vue", "CSS", "Figma"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 8, rank: "Top 20%" }, status: "open" },
  "4": { id: "4", name: "Jordan Lee", role: "Backend Engineer", location: "London, UK", bio: "Designing high-performance APIs and distributed systems. Expert in PostgreSQL, Redis, and microservices.", skills: ["Node.js", "PostgreSQL", "Redis", "Docker"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 16, rank: "Top 10%" }, status: "busy" },
  "5": { id: "5", name: "Aisha Patel", role: "DevOps Engineer", location: "Dubai, UAE", bio: "Cloud infrastructure expert with deep experience in AWS, Kubernetes, and CI/CD pipelines at scale.", skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 6, rank: "Top 25%" }, status: "open" },
  "6": { id: "6", name: "Lucas Berg", role: "Blockchain Dev", location: "Berlin, Germany", bio: "Smart contract developer building the decentralized future. Experienced in DeFi, NFTs, and Web3 tooling.", skills: ["Solidity", "Web3.js", "React", "Node.js"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 19, rank: "Top 8%" }, status: "busy" },
  "7": { id: "7", name: "Mei Zhang", role: "Mobile Developer", location: "Shanghai, China", bio: "Cross-platform mobile specialist building with React Native and Flutter. Shipped 10+ apps to production.", skills: ["React Native", "Flutter", "Firebase", "iOS"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 11, rank: "Top 18%" }, status: "open" },
  "8": { id: "8", name: "Omar Hassan", role: "Data Engineer", location: "Cairo, Egypt", bio: "Building robust data pipelines and analytics platforms. Expert in distributed computing and real-time data processing.", skills: ["Python", "Spark", "MongoDB", "Airflow"], links: [{ name: "GitHub", url: "https://github.com" }, { name: "LinkedIn", url: "https://linkedin.com" }], stats: { wins: 9, rank: "Top 22%" }, status: "busy" },
};

  const usersList = Object.values(users);

  

  const filteredUsers = useMemo(() => 
    usersList.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

useEffect(() => {
         if (id) {
           const user = usersList.find((u) => u.id === id);
           if (user) {
             setSelectedUser(user);
           }
         }
        }, [id]);


const chattedUserIds = [
        ...new Set(
          messages.map((msg) =>
           msg.sender === "me" ? msg.receiver : msg.sender
         )
        ),
    ];
const chatUsers = usersList.filter((user) =>
         chattedUserIds.includes(user.id)
        );

  return (
    <div className="flex h-[calc(100vh-60px)] text-white">


      <div className="w-1/3 bg-gray-900 p-6 relative">
     <div className="flex justify-between items-center mb-4">
         <h2 className="text-lg font-bold">Users</h2>

            <button
          onClick={() => setShowNewChat(true)}
      className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-500"
         >
          + New Chat
         </button>
        </div>
        {showNewChat && (
  <div className="absolute top-16 left-6 bg-gray-800 p-4 rounded-lg shadow-lg w-72 z-50">

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
        filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              setShowNewChat(false);
              setSearchTerm("");
            }}
            className="p-2 hover:bg-gray-700 cursor-pointer rounded"
          >
            {user.name}
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm text-center">
          No users found
        </p>
      )}
    </div>

   
    <button
      onClick={() => {
        setShowNewChat(false);
        setSearchTerm("");
      }}
      className="mt-3 text-sm text-red-400"
    >
      Close
    </button>
  </div>
        )}
            {chatUsers.length > 0 ? (
          chatUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="cursor-pointer p-3 rounded hover:bg-gray-700"
            >
              {user.name}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No chats yet</p>
        )}
      </div>
      


      <div className="w-2/3 bg-gray-800 p-4">
        {selectedUser ? (
         <ChatWindow 
            user={selectedUser} 
              messages={messages}
              setMessages={setMessages}
/>
        ) : (

          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-gray-700/50 rounded-full p-6 mb-6">
              <MessageCircle size={48} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Select a Conversation
            </h3>
          
          </div>
        )}
      </div>

    </div>
  );
};

export default Message;