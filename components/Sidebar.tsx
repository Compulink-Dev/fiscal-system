// components/ui/sidebar.tsx
"use client";

import * as React from "react";
import { PanelLeftClose, PanelLeftOpen, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type SidebarContextType = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = React.createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        isMobileOpen,
        setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed h-full border-r bg-background z-50 transition-all duration-300",
          "md:relative",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {children}
      </aside>
    </>
  );
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  return (
    <div
      className={cn(
        "flex items-center p-4 border-b",
        isCollapsed ? "justify-center" : "justify-between"
      )}
    >
      {children}
    </div>
  );
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="p-2">{children}</div>
    </ScrollArea>
  );
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  return (
    <div
      className={cn("p-4 border-t", isCollapsed ? "flex justify-center" : "")}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsCollapsed(!isCollapsed)}
      className="h-8 w-8 hidden md:inline-flex"
    >
      {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

export function MobileSidebarTrigger() {
  const { setIsMobileOpen } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsMobileOpen(true)}
      className="h-8 w-8 md:hidden"
    >
      <Menu size={16} />
      <span className="sr-only">Open sidebar</span>
    </Button>
  );
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold uppercase">{children}</div>
  );
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SidebarMenuButton({
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
