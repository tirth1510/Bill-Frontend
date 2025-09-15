"use client";

import { NavLink } from "react-router-dom";
import { type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
       

        <SidebarMenu className="mt-5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 mb-1 p-2 rounded-xl px-6 py-3 font-semibold  ${
                    isActive ? "bg-blue-600 text-white" : "hover:bg-blue-100"
                  }`
                }
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
