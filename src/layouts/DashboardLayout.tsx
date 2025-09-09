import type { ReactNode } from "react";
import { AppSidebar } from "@/layouts/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3rem",
         
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar className="flex-shrink-0 h-ful" />

        {/* Main content */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-0 bg-white dark:bg-black">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
