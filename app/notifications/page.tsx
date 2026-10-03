"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronRight,
  Clock,
  Info,
  Mail,
  MoreHorizontal,
  Settings,
  ShieldAlert,
  Target,
  Trash2,
  Zap,
} from "lucide-react";

import PageHeader from "@/src/components/common/PageHeader";
import {
  useNotifications,
  type Notification,
  type NotificationType,
} from "@/src/layout/NotificationsContext";

type NotificationFilter = "All" | "Unread" | "Important" | "Approvals";

const notificationFilters: NotificationFilter[] = [
  "All",
  "Unread",
  "Important",
  "Approvals",
];

const priorityBadgeConfig = {
  urgent: {
    label: "Urgent",
    className: "bg-red-50 text-red-600",
  },
  important: {
    label: "Important",
    className: "bg-orange-50 text-orange-600",
  },
} as const;

const typeConfig: Record<
  NotificationType,
  {
    label: string;
    icon: typeof Bell;
    bg: string;
    text: string;
  }
> = {
  email: {
    label: "Email",
    icon: Mail,
    bg: "bg-red-50",
    text: "text-red-500",
  },
  calendar: {
    label: "Calendar",
    icon: CalendarDays,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  task: {
    label: "Task",
    icon: Target,
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  automation: {
    label: "Automation",
    icon: Zap,
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
  approval: {
    label: "Approval",
    icon: ShieldAlert,
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
  system: {
    label: "System",
    icon: Info,
    bg: "bg-slate-100",
    text: "text-slate-600",
  },
};

const isHighPriority = (priority: Notification["priority"]) =>
  priority === "important" || priority === "urgent";

const matchesFilter = (
  notification: Notification,
  filter: NotificationFilter,
) => {
  switch (filter) {
    case "Unread":
      return notification.unread;
    case "Important":
      return isHighPriority(notification.priority);
    case "Approvals":
      return notification.type === "approval";
    case "All":
    default:
      return true;
  }
};

const getPriorityBadge = (priority: Notification["priority"]) => {
  if (!priority || priority === "normal") {
    return null;
  }

  return priorityBadgeConfig[priority as keyof typeof priorityBadgeConfig];
};

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, setNotifications } = useNotifications();
  const [filter, setFilter] = useState<NotificationFilter>("All");
  const [showMenu, setShowMenu] = useState<number | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  );

  const importantCount = useMemo(
    () => notifications.filter(({ priority }) => isHighPriority(priority)).length,
    [notifications],
  );

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((notification) => matchesFilter(notification, filter)),
    [filter, notifications],
  );

  const markAsRead = (id: number) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((previous) => previous.filter((notification) => notification.id !== id));
    setShowMenu(null);
  };

  const clearReadNotifications = () => {
    setNotifications((previous) => previous.filter((notification) => notification.unread));
  };

  const toggleMenu = (id: number) => {
    setShowMenu((current) => (current === id ? null : id));
  };

  const openNotificationSettings = () => {
    router.push("/settings?section=notifications");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PageHeader
        title="Notifications"
        description="Stay updated with your tasks, calendar, emails and productivity agent."
        icon={Bell}
        badge={unreadCount > 0 ? unreadCount : undefined}
        actions={
          <>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <CheckCheck size={17} />
                Mark all as read
              </button>
            )}

            <button
              onClick={clearReadNotifications}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <Trash2 size={16} />
              Clear read
            </button>
          </>
        }
      />

      <div className="mx-auto max-w-5xl px-8 py-7">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total"
            value={notifications.length}
            description="Notifications"
            icon={Bell}
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <SummaryCard
            title="Unread"
            value={unreadCount}
            description="Need your attention"
            icon={Clock}
            iconClass="bg-orange-50 text-orange-600"
          />

          <SummaryCard
            title="Important"
            value={importantCount}
            description="Important updates"
            icon={ShieldAlert}
            iconClass="bg-red-50 text-red-500"
          />
        </div>

        <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {notificationFilters.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  filter === item
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item}

                {item === "Unread" && unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={openNotificationSettings}
            className="flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <Settings size={16} />
            Notification Settings
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {filteredNotifications.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            filteredNotifications.map((notification, index) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                first={index === 0}
                onRead={() => markAsRead(notification.id)}
                onDelete={() => deleteNotification(notification.id)}
                showMenu={showMenu === notification.id}
                onMenu={() => toggleMenu(notification.id)}
                onCloseMenu={() => setShowMenu(null)}
              />
            ))
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-5">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Bell size={19} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-indigo-900">
                Your Productivity Agent keeps you informed
              </h3>

              <p className="mt-1 text-xs leading-5 text-indigo-700">
                Notifications can be generated from emails, calendar events, tasks,
                automations and approval requests. You can control notification
                behavior from Settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  first,
  onRead,
  onDelete,
  showMenu,
  onMenu,
  onCloseMenu,
}: {
  notification: Notification;
  first: boolean;
  onRead: () => void;
  onDelete: () => void;
  showMenu: boolean;
  onMenu: () => void;
  onCloseMenu: () => void;
}) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;
  const isUnread = notification.unread;
  const priorityBadge = getPriorityBadge(notification.priority);

  return (
    <div
      className={`group relative flex gap-4 p-5 transition hover:bg-slate-50 ${
        !first ? "border-t border-slate-100" : ""
      } ${isUnread ? "border-l-4 border-l-indigo-500" : ""}`}
    >
      <div
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text}`}
      >
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`text-sm ${
                  isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-700"
                }`}
              >
                {notification.title}
              </h3>

              {isUnread && <span className="h-2 w-2 rounded-full bg-indigo-500" />}

              {priorityBadge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${priorityBadge.className}`}
                >
                  {priorityBadge.label}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-slate-400">
              {config.label} • {notification.time}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={onMenu}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-0 transition hover:bg-slate-100 group-hover:opacity-100"
            >
              <MoreHorizontal size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                {isUnread && (
                  <button
                    onClick={() => {
                      onRead();
                      onCloseMenu();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
                  >
                    <Check size={14} />
                    Mark as read
                  </button>
                )}

                <button
                  onClick={onDelete}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          {notification.description}
        </p>

        <div className="mt-4 flex items-center gap-3">
          {notification.action && (
            <button
              onClick={onRead}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
            >
              {notification.action}
              <ChevronRight size={14} />
            </button>
          )}

          {isUnread && (
            <button
              onClick={onRead}
              className="text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof Bell;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
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

function EmptyState({ filter }: { filter: NotificationFilter }) {
  return (
    <div className="p-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Bell size={25} />
      </div>

      <h3 className="mt-4 text-sm font-bold">No notifications</h3>

      <p className="mt-1 text-xs text-slate-500">
        {filter === "Unread"
          ? "You're all caught up."
          : "There are no notifications matching this filter."}
      </p>
    </div>
  );
}