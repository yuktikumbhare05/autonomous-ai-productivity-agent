"use client";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Mail,
  FolderKanban,
  Target,
  Brain,
  Workflow,
  CircleCheck,
  Plug,
  Settings,
  Bot,
} from "lucide-react";

import type { ComponentType } from "react";
import {
  settingsSections,
  useSettingsNavigation,
} from "./SettingsNavigation";

type NavigationItem = {
  name: string;
  icon: ComponentType<{ size?: number }>;
  href: string;
};

const workspaceItems: NavigationItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/home" },
  { name: "Tasks", icon: CheckSquare, href: "/tasks" },
  { name: "Calendar", icon: CalendarDays, href: "/calendar" },
  { name: "Email", icon: Mail, href: "/email" },
  { name: "Projects", icon: FolderKanban, href: "/projects" },
  { name: "Goals", icon: Target, href: "/goals" },
];

const intelligenceItems: NavigationItem[] = [
  { name: "Memory", icon: Brain, href: "/memory" },
  { name: "Automations", icon: Workflow, href: "/automations" },
  { name: "Approvals", icon: CircleCheck, href: "/approvals" },
];

const systemItems: NavigationItem[] = [
  { name: "Integrations", icon: Plug, href: "/integrations" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function SideBar() {
  const pathname = usePathname();
  const { activeSection, setActiveSection } = useSettingsNavigation();

  return (
    <aside className="app-sidebar flex h-dvh w-64 shrink-0 flex-col bg-slate-950 text-white">
      {/* Logo / Product Header */}
      <div className="shrink-0 px-6 py-6">
        <h1 className="text-xl font-semibold">Productivity AI</h1>

        <p className="mt-1 text-xs text-slate-400">
          Personal productivity platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 scrollbar-hide">
        <NavigationSection
          title="Workspace"
          items={workspaceItems}
          pathname={pathname}
        />

        <div className="mt-8">
          <NavigationSection
            title="Intelligence"
            items={intelligenceItems}
            pathname={pathname}
          />
        </div>

        <div className="mt-8">
          <NavigationSection
            title="System"
            items={systemItems}
            pathname={pathname}
          />
        </div>

        {pathname === "/settings" && (
          <div className="settings-subnav mt-3">
            <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-slate-500">
              Settings
            </div>

            <div className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? "bg-slate-800 font-medium text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Agent */}
        <div className="mt-8">
          <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-slate-500">
            Assistant
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                <Bot size={18} className="text-slate-200" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  AI Agent
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  <span className="text-xs text-slate-400">
                    Ready to assist
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

function NavigationSection({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavigationItem[];
  pathname: string;
}) {
  return (
    <div>
      <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-slate-500">
        {title}
      </div>

      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.href;

          return (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-slate-800 font-medium text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={18} />

              <span>{item.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}