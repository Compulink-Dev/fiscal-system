// components/app-sidebar.tsx
"use client";

import {
  Home,
  FileText,
  Settings,
  Users,
  CreditCard,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/signin" });
    setShowLogoutDialog(false);
  };

  const links = [
    {
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/invoices",
      icon: <FileText className="h-5 w-5" />,
      label: "Invoices",
    },
    {
      href: "/dashboard/clients",
      icon: <Users className="h-5 w-5" />,
      label: "Clients",
    },
    {
      href: "/dashboard/payments",
      icon: <CreditCard className="h-5 w-5" />,
      label: "Payments",
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ];

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <h1
            className={cn(
              "text-xl font-bold",
              isCollapsed ? "hidden" : "block"
            )}
          >
            Fiscal
          </h1>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className={isCollapsed ? "hidden" : "block"}>
              <SidebarGroupLabel>Fiscal Gem</SidebarGroupLabel>
            </div>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    className={pathname === link.href ? "bg-accent" : ""}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 p-2"
                    >
                      <div className="">{link.icon}</div>
                      <span className={isCollapsed ? "hidden" : "block"}>
                        {link.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="h-5 w-5" />
            <span className={isCollapsed ? "hidden" : "block"}>Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
        title="Are you sure you want to logout?"
        description="You'll need to sign in again to access your account."
        confirmText="Logout"
      />
    </>
  );
}
