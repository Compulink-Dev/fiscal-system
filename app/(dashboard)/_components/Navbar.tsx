// app/_components/Navbar.tsx
"use client";

import { Search, Bell, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileSidebarTrigger } from "@/components/Sidebar";

function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="w-full bg-white border-b flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-4">
        <MobileSidebarTrigger />
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>

        {session?.user && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span className="font-medium hidden md:inline">
              {session.user.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
