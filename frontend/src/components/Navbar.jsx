import React, { useState } from "react";
import { Search, LogOut, Menu } from "lucide-react";
import { UserIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = ({ onMenuOpen }) => {
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
    <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex justify-between items-center">

      {/* Left Section */}
      <div className="flex items-center gap-3 sm:gap-8">

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuOpen}
          className="md:hidden p-2 min-w-[44px] min-h-[44px] text-white hover:bg-slate-800 rounded-lg transition flex items-center justify-center"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

       {/* Logo Container */}
  <div 
    className="flex items-center gap-2 text-white cursor-pointer" 
    onClick={() => navigate("/")}
  >
    {/* Replace the border box with this img tag */}
    <img 
      src="/hackmeetlogo.png" 
      alt="HackMeet Logo" 
      className="w-8 h-8 object-contain" 
    />
  </div>

        {/* Search — hidden on mobile, visible sm+ */}
        <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 w-48 md:w-64 focus-within:border-blue-500 transition">
          <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
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
      <div className="flex items-center gap-2 sm:gap-4 relative">
        <NotificationBell />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 min-w-[44px] min-h-[44px] rounded hover:bg-slate-800 transition flex items-center justify-center gap-2 text-gray-300 hover:text-red-400"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className="w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition overflow-hidden"
        >
          {user?.profilePicture ? (
            <img loading="lazy" src={user.profilePicture} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
