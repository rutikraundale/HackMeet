import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ToastContainer from "../components/ToastContainer";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950">

      <ToastContainer />

      {/* Backdrop — mobile only, shown when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Navbar onMenuOpen={() => setSidebarOpen(true)} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — no left margin on mobile; offset by sidebar on md+ */}
      <div className="flex-1 overflow-y-auto bg-gray-950 md:ml-64">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;