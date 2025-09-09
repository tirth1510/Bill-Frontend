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


export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Sidebar Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <h1 className="text-lg font-bold tracking-wide text-blue-600 flex items-center gap-2">
              <IconReceipt2 size={20} /> Billing System
            </h1>
          </SidebarMenuItem>
        </SidebarMenu>
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
