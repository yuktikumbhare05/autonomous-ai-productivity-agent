"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Search, SunMoon, User, X } from "lucide-react";
import { useNotifications } from "./NotificationsContext";
import { useTheme } from "./ThemeContext";

const searchItems = [
  { label: "Dashboard", href: "/home", detail: "Overview, priorities, and schedule" },
  { label: "Tasks", href: "/tasks", detail: "Manage your tasks" },
  { label: "Calendar", href: "/calendar", detail: "Meetings and schedule" },
  { label: "Email", href: "/email", detail: "Inbox and messages" },
  { label: "Projects", href: "/projects", detail: "Project work and progress" },
  { label: "Goals", href: "/goals", detail: "Goals and milestones" },
  { label: "Memory", href: "/memory", detail: "Saved context and preferences" },
  { label: "Automations", href: "/automations", detail: "Automated workflows" },
  { label: "Approvals", href: "/approvals", detail: "Items waiting for approval" },
  { label: "Integrations", href: "/integrations", detail: "Connected services" },
  { label: "Notifications", href: "/notifications", detail: "Recent updates" },
  { label: "Settings", href: "/settings", detail: "Workspace preferences" },
  { label: "Profile", href: "/profile", detail: "Your account details" },
];

export default function Topbar() {
  const pathname = usePathname();
  const { notifications } = useNotifications();
  const { toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;
  const filteredItems = searchItems.filter((item) =>
    `${item.label} ${item.detail}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchQuery("");
        setIsSearchOpen(true);
      }

      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-white px-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {pathname === "/profile" ? "Profile" : "Dashboard"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
            type="button"
            aria-label="Search workspace"
            aria-haspopup="dialog"
            onClick={() => {
              setSearchQuery("");
              setIsSearchOpen(true);
            }}
          >
            <Search size={16} />
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Toggle light and dark mode"
            title="Toggle light and dark mode"
          >
            <SunMoon size={18} />
          </button>

          <Link
            href="/notifications"
            className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell size={19} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition hover:bg-slate-300"
            aria-label="User profile"
          >
            <User size={17} />
          </Link>
        </div>
      </header>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 px-4 pt-[12vh]"
          onClick={() => setIsSearchOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="workspace-search-title"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4">
              <Search size={18} className="shrink-0 text-slate-400" />
              <h2 id="workspace-search-title" className="sr-only">
                Search workspace
              </h2>
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search pages and tools..."
                aria-label="Search pages and tools"
                className="workspace-search-input h-14 min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close search"
              >
                <X size={17} />
              </button>
            </div>

            <ul className="max-h-[55vh] overflow-y-auto p-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between gap-4 rounded-lg px-3 py-3 transition hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none"
                    >
                      <span className="text-sm font-medium text-slate-900">
                        {item.label}
                      </span>
                      <span className="text-right text-xs text-slate-500">
                        {item.detail}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-3 py-8 text-center text-sm text-slate-500">
                  No matching pages or tools.
                </li>
              )}
            </ul>
          </section>
        </div>
      )}
    </>
  );
}