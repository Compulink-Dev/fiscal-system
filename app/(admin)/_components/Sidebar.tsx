// app/_components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  FileText,
  Settings,
  Users,
  CreditCard,
  Building,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function Sidebar() {
  const pathname = usePathname();
  const links = [
    {
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/admin/company",
      icon: <Building className="h-5 w-5" />,
      label: "Invoices",
    },
    {
      href: "/admin/user",
      icon: <User className="h-5 w-5" />,
      label: "Invoices",
    },
    {
      href: "/admin/invoices",
      icon: <FileText className="h-5 w-5" />,
      label: "Invoices",
    },
    {
      href: "/admin/clients",
      icon: <Users className="h-5 w-5" />,
      label: "Clients",
    },
    {
      href: "/admin/payments",
      icon: <CreditCard className="h-5 w-5" />,
      label: "Payments",
    },
    {
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ];

  return (
    <>
      {/* Mobile sidebar (sheet) */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SidebarContent links={links} pathname={pathname} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-full w-full border-r bg-white">
        <SidebarContent links={links} pathname={pathname} />
      </div>
    </>
  );
}

const SidebarContent = ({
  links,
  pathname,
}: {
  links: any[];
  pathname: string;
}) => (
  <>
    <div className="p-4 border-b">
      <h1 className="text-xl font-bold">Fiscal</h1>
    </div>
    <nav className="flex-1 p-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 mb-1 transition-all ${
            pathname === link.href
              ? "bg-gray-100 text-primary font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {link.icon}
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  </>
);

export default Sidebar;
