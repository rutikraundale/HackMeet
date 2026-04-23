import React, { useState } from "react";
import { Search, LogOut } from "lucide-react";
import { UserIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex justify-between items-center">
      
      {/* Left Section */}
      <div className="flex items-center gap-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2 text-white">
          <div className="border border-white px-2 py-1 text-sm font-bold">▶</div>
          <span className="font-bold text-lg tracking-wider">
            HACKMEET
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 w-64 focus-within:border-blue-500 transition">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        <NotificationBell />
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded hover:bg-slate-800 transition flex items-center gap-2 text-gray-300 hover:text-red-400"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition overflow-hidden"
        >
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;