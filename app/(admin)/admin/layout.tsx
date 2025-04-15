// app/_components/DashboardLayout.tsx
import React from "react";
import Sidebar from "../_components/Sidebar";
import Navbar from "../_components/Navbar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - fixed width and full height */}
      <div className="hidden md:flex md:w-64 lg:w-72 h-full fixed">
        <Sidebar />
      </div>

      {/* Main content area - offset by sidebar width */}
      <div className="flex-1 flex flex-col md:ml-64 lg:ml-72 h-full">
        {/* Navbar - fixed height */}
        <div className="h-16 sticky top-0 z-10 bg-white border-b">
          <Navbar />
        </div>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
