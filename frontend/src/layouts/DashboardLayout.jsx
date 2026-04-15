import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950">
      {/* Navbar - Full Width Top */}
      <Navbar />
      
      {/* Sidebar (Fixed) */}
      <Sidebar />
      
      {/* Page Content with margin to account for fixed sidebar */}
      <div className="flex-1 overflow-y-auto bg-gray-950 ml-[17%]">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
