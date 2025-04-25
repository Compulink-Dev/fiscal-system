// app/_components/DashboardLayout.tsx
"use client";

import React from "react";
import { SidebarProvider } from "@/components/Sidebar";
import { AppSidebar } from "../_components/AppSidebar";
import Navbar from "../_components/Navbar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col overflow-hidden  md:data-[collapsed=false]:ml-64">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
