// src/layouts/DashboardLayout.jsx
import React from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const DashboardLayout = ({subtitle, title, children }) => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Always Visible */}
      <DashboardSidebar />

      {/* Right Side Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <DashboardHeader title={title}  subtitle={subtitle}/>

        {/* Page Content here */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;
