"use client";

import SideBar from "./SideBar";
import TopBar from "./TopBar";
import AgentPanel from "../components/agent/AgentPanel";
import { SettingsNavigationProvider } from "./SettingsNavigation";
import { NotificationsProvider } from "./NotificationsContext";
import { usePathname } from "next/navigation";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") {
    return children;
  }

  return (
    <NotificationsProvider>
      <SettingsNavigationProvider>
        <div className="app-shell flex h-dvh overflow-hidden bg-slate-100">
          {/* Left Sidebar */}
          <SideBar />

          {/* Main Application Area */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* Fixed Top Navigation */}
            <div className="shrink-0">
              <TopBar />
            </div>

            {/* Scrollable Dashboard Area */}
            <main className="app-content min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
          </div>

          {/* Right AI Agent Panel */}
          <AgentPanel />
        </div>
      </SettingsNavigationProvider>
    </NotificationsProvider>
  );
}