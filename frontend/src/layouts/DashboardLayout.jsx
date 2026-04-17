import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ToastContainer from "../components/ToastContainer";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950">

      <ToastContainer />


      <Navbar />


      <Sidebar />


      <div className="flex-1 overflow-y-auto bg-gray-950 ml-64">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;