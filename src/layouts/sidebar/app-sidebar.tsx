"use client";

import * as React from "react";
import {
  IconDashboard,
  IconFileInvoiceFilled,
  IconListDetails,
  IconReceipt2, // ✅ Tabler Billing Icon
} from "@tabler/icons-react";

import { NavMain } from "@/layouts/sidebar/nav-main";
import { NavUser } from "@/layouts/sidebar/use-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Sidebar Data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/products",
      icon: IconListDetails,
    },
    {
      title: "Billing",
      url: "/bill",
      icon: IconReceipt2,
    },
    {
      title: "Invoice",
      url: "/invoice",
      icon: IconFileInvoiceFilled,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Sidebar Header */}
      {/* Sidebar Header */}
      <SidebarHeader className="flex items-center justify-center py-0">
        <img
          src="/image.png"
          alt="Shop Logo"
          className="w-70 h-50 object-contain " 
        />
      </SidebarHeader>

      {/* Sidebar Navigation */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* Sidebar Footer with User */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
