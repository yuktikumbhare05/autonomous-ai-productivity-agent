"use client";

import { useState } from "react";
import {
  CalendarDays,
  Check,
  Cloud,
  ExternalLink,
  GitBranch,
  HardDrive,
  Info,
  Link2,
  Mail,
  MessageCircle,
  Plug,
  Search,
  Unplug,
  X,
} from "lucide-react";

type Integration = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "connected" | "available" | "coming";
  icon: any;
  color: string;
  permissions: string[];
  lastSync?: string;
};

const initialIntegrations: Integration[] = [
  {
    id: "gmail",
    name: "Gmail",
    description:
      "Read, classify, summarize and manage email intelligence.",
    category: "Communication",
    status: "connected",
    icon: Mail,
    color: "text-red-500 bg-red-50",
    permissions: [
      "Read emails",
      "Classify emails",
      "Create tasks from emails",
      "Draft replies",
    ],
    lastSync: "2 minutes ago",
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description:
      "Manage events, detect conflicts and support intelligent planning.",
    category: "Productivity",
    status: "connected",
    icon: CalendarDays,
    color: "text-blue-600 bg-blue-50",
    permissions: [
      "Read calendar events",
      "Create events",
      "Detect conflicts",
      "Support time blocking",
    ],
    lastSync: "5 minutes ago",
  },
  {
    id: "telegram",
    name: "Telegram",
    description:
      "Receive productivity briefings, alerts and approval notifications.",
    category: "Communication",
    status: "available",
    icon: MessageCircle,
    color: "text-sky-600 bg-sky-50",
    permissions: [
      "Send notifications",
      "Receive commands",
      "Send approval requests",
    ],
  },
  {
    id: "notion",
    name: "Notion",
    description:
      "Access workspace pages and productivity information.",
    category: "Productivity",
    status: "coming",
    icon: Cloud,
    color: "text-slate-700 bg-slate-100",
    permissions: [
      "Read pages",
      "Create pages",
      "Update workspace content",
    ],
  },
  {
    id: "drive",
    name: "Google Drive",
    description:
      "Access documents and files relevant to your productivity workflows.",
    category: "Storage",
    status: "coming",
    icon: HardDrive,
    color: "text-green-600 bg-green-50",
    permissions: [
      "Read files",
      "Search documents",
      "Access shared files",
    ],
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "Connect development activity with tasks and project workflows.",
    category: "Development",
    status: "coming",
    icon: GitBranch,
    color: "text-slate-700 bg-slate-100",
    permissions: [
      "Read repositories",
      "Read issues",
      "Track development activity",
    ],
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] =
    useState(initialIntegrations);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] =
    useState<Integration | null>(null);

  const [showConnectModal, setShowConnectModal] =
    useState<Integration | null>(null);

  const categories = [
    "All",
    "Communication",
    "Productivity",
    "Storage",
    "Development",
  ];

  const filteredIntegrations = integrations.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter(
    (item) => item.status === "connected"
  ).length;

  const availableCount = integrations.filter(
    (item) => item.status === "available"
  ).length;

  const comingCount = integrations.filter(
    (item) => item.status === "coming"
  ).length;

  const connectIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "connected",
              lastSync: "Just now",
            }
          : item
      )
    );

    setShowConnectModal(null);
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "available",
              lastSync: undefined,
            }
          : item
      )
    );

    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
              <Plug size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Integrations
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Connect the services your productivity agent uses.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrations..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-8 py-7">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Connected"
            value={connectedCount}
            description="Active integrations"
            icon={Check}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Available"
            value={availableCount}
            description="Ready to connect"
            icon={Link2}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Coming Soon"
            value={comingCount}
            description="Planned integrations"
            icon={Cloud}
            iconClass="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Security Banner */}
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-5">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Info size={20} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-indigo-900">
                Your integrations are protected
              </h3>

              <p className="mt-1 text-sm leading-6 text-indigo-700">
                Sensitive actions such as sending emails or creating
                external events can require approval before execution.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-7 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                category === item
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Integration Grid */}
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredIntegrations.map((integration) => {
            const Icon = integration.icon;

            return (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onDetails={() => setSelected(integration)}
                onConnect={() =>
                  setShowConnectModal(integration)
                }
                onDisconnect={() =>
                  disconnectIntegration(integration.id)
                }
              />
            );
          })}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Plug
              size={32}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold">
              No integrations found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or category filter.
            </p>
          </div>
        )}

        {/* Future Integrations */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">
            More integrations
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Additional productivity tools can be added as the platform
            grows.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {[
              "Todoist",
              "Slack",
              "Outlook",
              "Trello",
              "Asana",
            ].map((name) => (
              <div
                key={name}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${selected.color}`}
                >
                  <selected.icon size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    {selected.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {selected.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              {selected.description}
            </p>

            <div className="mt-6">
              <h3 className="text-sm font-bold">
                Permissions
              </h3>

              <div className="mt-3 space-y-2">
                {selected.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
                  >
                    <Check
                      size={16}
                      className="text-emerald-500"
                    />

                    <span className="text-sm text-slate-600">
                      {permission}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selected.status === "connected" && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Last synchronized
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {selected.lastSync}
                </p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {selected.status === "connected" ? (
                <button
                  onClick={() =>
                    disconnectIntegration(selected.id)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  <Unplug size={17} />
                  Disconnect
                </button>
              ) : selected.status === "available" ? (
                <button
                  onClick={() => {
                    setSelected(null);
                    setShowConnectModal(selected);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Link2 size={17} />
                  Connect
                </button>
              ) : (
                <button
                  disabled
                  className="flex flex-1 items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400"
                >
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Connect Modal */}
      {showConnectModal && (
        <Modal
          onClose={() => setShowConnectModal(null)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Connect {showConnectModal.name}
              </h2>

              <button
                onClick={() => setShowConnectModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${showConnectModal.color}`}
              >
                <showConnectModal.icon size={24} />
              </div>

              <div>
                <p className="font-semibold">
                  {showConnectModal.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {showConnectModal.description}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold">
                Requested permissions
              </p>

              <div className="mt-3 space-y-2">
                {showConnectModal.permissions.map(
                  (permission) => (
                    <div
                      key={permission}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <Check
                        size={16}
                        className="text-emerald-500"
                      />
                      {permission}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-xs leading-5 text-indigo-700">
                In the current demo version, connecting an integration
                only updates the local interface. OAuth and backend
                authentication will be added later.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConnectModal(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  connectIntegration(showConnectModal.id)
                }
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Connect
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   INTEGRATION CARD
============================================================ */

function IntegrationCard({
  integration,
  onDetails,
  onConnect,
  onDisconnect,
}: {
  integration: Integration;
  onDetails: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const Icon = integration.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${integration.color}`}
          >
            <Icon size={24} />
          </div>

          <div>
            <h3 className="font-bold">{integration.name}</h3>

            <p className="mt-0.5 text-xs text-slate-400">
              {integration.category}
            </p>
          </div>
        </div>

        <StatusBadge status={integration.status} />
      </div>

      {/* Description */}
      <p className="mt-5 min-h-[65px] text-sm leading-6 text-slate-500">
        {integration.description}
      </p>

      {/* Sync */}
      {integration.status === "connected" &&
        integration.lastSync && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
            <Check size={15} className="text-emerald-500" />
            Last synchronized {integration.lastSync}
          </div>
        )}

      {/* Buttons */}
      <div className="mt-5 flex gap-2">
        {integration.status === "connected" ? (
          <>
            <button
              onClick={onDisconnect}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Unplug size={16} />
              Disconnect
            </button>

            <button
              onClick={onDetails}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <Info size={17} />
            </button>
          </>
        ) : integration.status === "available" ? (
          <>
            <button
              onClick={onConnect}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Link2 size={16} />
              Connect
            </button>

            <button
              onClick={onDetails}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <Info size={17} />
            </button>
          </>
        ) : (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-400"
          >
            <ExternalLink size={16} />
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   STATUS
============================================================ */

function StatusBadge({
  status,
}: {
  status: Integration["status"];
}) {
  if (status === "connected") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Connected
      </span>
    );
  }

  if (status === "available") {
    return (
      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
        Available
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
      Coming Soon
    </span>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number;
  description: string;
  icon: any;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-1 text-2xl font-bold">{value}</p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MODAL
============================================================ */

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}