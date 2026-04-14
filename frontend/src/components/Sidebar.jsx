import React from "react";
import { Link, useLocation } from "react-router-dom";

import { AiOutlineProject } from "react-icons/ai";
import { FaRegClipboard } from "react-icons/fa";
import { MdMessage, MdPerson, MdPeopleOutline } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();

  const activeClass =
    "flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30";

  const normalClass =
    "flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition";

  return (
    <div className="bg-slate-900/90 backdrop-blur-md h-[calc(100vh-60px)] w-64 p-5 flex flex-col gap-8 fixed top-[60px] left-0 z-40 border-r border-slate-800">
      
      {/* User */}
      <div>
        <h1 className="text-white font-semibold text-lg">
          Ravi Sahane
        </h1>
        <p className="text-gray-400 text-xs">
          Developer
        </p>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-3">

        <Link
          to="/dashboard"
          className={
            location.pathname === "/dashboard"
              ? activeClass
              : normalClass
          }
        >
          <AiOutlineProject size={22} />
          Dashboard
        </Link>

        <Link
          to="/teammates"
          className={
            location.pathname === "/teammates"
              ? activeClass
              : normalClass
          }
        >
          <MdPeopleOutline size={22} />
          Teammates
        </Link>

        <Link
          to="/projects"
          className={
            location.pathname === "/projects"
              ? activeClass
              : normalClass
          }
        >
          <FaRegClipboard size={20} />
          Projects
        </Link>

        <Link
          to="/messages"
          className={
            location.pathname === "/messages"
              ? activeClass
              : normalClass
          }
        >
          <MdMessage size={22} />
          Message
        </Link>

        <Link
          to="/profile"
          className={
            location.pathname === "/profile"
              ? activeClass
              : normalClass
          }
        >
          <MdPerson size={22} />
          Profile
        </Link>

      </div>
    </div>
  );
};

export default Sidebar;