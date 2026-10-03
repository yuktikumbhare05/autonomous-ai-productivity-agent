"use client";

import { createContext, useContext, useState } from "react";

import type { ReactNode } from "react";

export type NotificationType =
  | "email"
  | "calendar"
  | "task"
  | "automation"
  | "approval"
  | "system";

export type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  priority: "normal" | "important" | "urgent";
  action?: string;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "email",
    title: "Important email needs your attention",
    description:
      "Your project mentor sent an email regarding the upcoming project review.",
    time: "10 minutes ago",
    unread: true,
    priority: "important",
    action: "View Email",
  },
  {
    id: 2,
    type: "calendar",
    title: "Team meeting starts in 30 minutes",
    description:
      "Your Product Development meeting is scheduled for 11:00 AM.",
    time: "25 minutes ago",
    unread: true,
    priority: "normal",
    action: "View Calendar",
  },
  {
    id: 3,
    type: "task",
    title: "2 high-priority tasks are due today",
    description:
      "Complete EventMatch database updates and review your project documentation.",
    time: "1 hour ago",
    unread: true,
    priority: "important",
    action: "View Tasks",
  },
  {
    id: 4,
    type: "approval",
    title: "Approval required",
    description:
      "The Productivity Agent wants to send an email reply on your behalf.",
    time: "2 hours ago",
    unread: true,
    priority: "urgent",
    action: "Review Approval",
  },
  {
    id: 5,
    type: "automation",
    title: "Morning Briefing completed",
    description:
      "Your daily briefing has been prepared with today's tasks, calendar and important emails.",
    time: "3 hours ago",
    unread: false,
    priority: "normal",
    action: "View Briefing",
  },
  {
    id: 6,
    type: "calendar",
    title: "No calendar conflicts detected",
    description:
      "Your schedule was analyzed and no overlapping events were found.",
    time: "4 hours ago",
    unread: false,
    priority: "normal",
  },
  {
    id: 7,
    type: "automation",
    title: "Daily Planning completed",
    description:
      "The agent organized your tasks around today's available time blocks.",
    time: "Yesterday",
    unread: false,
    priority: "normal",
    action: "View Plan",
  },
  {
    id: 8,
    type: "system",
    title: "Google Calendar synchronized",
    description:
      "Your calendar was successfully synchronized with Productivity AI.",
    time: "Yesterday",
    unread: false,
    priority: "normal",
  },
];

const NotificationsContext = createContext<{
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
} | null>(null);

export function NotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider",
    );
  }

  return context;
}