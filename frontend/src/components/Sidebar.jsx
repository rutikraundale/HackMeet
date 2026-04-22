import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineProject } from "react-icons/ai";
import { FaRegClipboard } from "react-icons/fa";
import { MdMessage, MdPerson, MdPeopleOutline } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RiCompassDiscoverLine } from "react-icons/ri";
import { Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const activeClass =
    "flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30";
  const normalClass =
    "flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition";

  const navItems = user?.isAdmin
    ? [
        { to: "/admin", icon: <Shield size={20} />, label: "Admin Panel" },
      ]
    : [
        { to: "/dashboard", icon: <AiOutlineProject size={22} />, label: "Dashboard" },
        { to: "/discover", icon: <RiCompassDiscoverLine size={22} />, label: "Discover" },
        { to: "/find-teams", icon: <HiOutlineUserGroup size={22} />, label: "Find Teams" },
        { to: "/team-builder", icon: <HiOutlineUserGroup size={22} />, label: "Team Builder" },
        { to: "/projects", icon: <FaRegClipboard size={20} />, label: "Projects" },
        { to: "/messages", icon: <MdMessage size={22} />, label: "Message" },
        { to: "/profile", icon: <MdPerson size={22} />, label: "Profile" },
      ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md h-[calc(100vh-60px)] w-64 p-5 flex flex-col gap-8 fixed top-[60px] left-0 z-40 border-r border-slate-800">

      {/* User */}
      <div>
        <h1 className="text-white font-semibold text-lg">{user?.username || "User"}</h1>
        <p className="text-gray-400 text-xs">
          {user?.isAdmin ? "Admin" : user?.isTeamLeader ? "Team Leader" : "Developer"}
        </p>
      </div>


      <div className="flex flex-col gap-2">
        {navItems.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={location.pathname === to ? activeClass : normalClass}
          >
            {icon}
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;