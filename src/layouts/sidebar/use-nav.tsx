"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuth } from "@/context/authcontext";

export function NavUser() {
  const { user, logout } = useAuth();
  const { isMobile } = useSidebar();

  if (!user) return null; // no user → no menu

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className=" data-[state=open]:text-blue-900 my-3  "
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.profilePicture ?? ""} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight gap-1">
                <span className="truncate font-medium mt-1">{user.name}</span>
                <span className="truncate text-xs mb-1">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg mb-9 "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-3.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.profilePicture ?? ""}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="border-blue-500" />

            <DropdownMenuGroup className="bg-blue-50 rounded-lg p-2 ">
              <DropdownMenuItem>
                <div
                  className={`flex items-center gap-2 py-1 ${
                    user.isVerified
                      ? "text-green-600 font-semibold"
                      : "text-red-500 font-semibold"
                  }`}
                >
                  <BadgeCheck
                    className={
                      user.isVerified ? "text-green-600" : "text-red-500"
                    }
                  />
                  <span>
                    {user.isVerified
                      ? "Verified Account"
                      : "Unverified Account"}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-blue-200! font-semibold rounded-md px-2 py-1 flex items-center gap-2  pb-2">
                <Settings2 />
                <span>Setting</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-blue-200! font-semibold rounded-md px-2 py-1 flex items-center gap-2 pb-2">
                <CreditCard />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-blue-200! font-semibold rounded-md px-2 py-1 flex items-center gap-2 pb-2">
                <Bell />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 hover:text-red-500! hover:bg-red-100! flex items-center gap-2 font-semibold"
            >
              <LogOut className="w-4 h-4 text-red-600 hover:text-red-500 font-semibold" />{" "}
              {/* optional: size of icon */}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
