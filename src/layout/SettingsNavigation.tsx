"use client";

import { createContext, useContext, useState } from "react";
import {
  Bell,
  Settings as SettingsIcon,
  Shield,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

import type { ReactNode } from "react";

export type SettingsSection =
  | "notifications"
  | "automation"
  | "preferences"
  | "agent"
  | "security";

export const settingsSections = [
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage alerts and reminders",
    icon: Bell,
  },
  {
    id: "automation",
    label: "Automation",
    description: "Control autonomous workflows",
    icon: Zap,
  },
  {
    id: "preferences",
    label: "Preferences",
    description: "Customize productivity defaults",
    icon: SlidersHorizontal,
  },
  {
    id: "agent",
    label: "Agent Preferences",
    description: "Customize your AI assistant",
    icon: SettingsIcon,
  },
  {
    id: "security",
    label: "Security & Privacy",
    description: "Control permissions and privacy",
    icon: Shield,
  },
] satisfies {
  id: SettingsSection;
  label: string;
  description: string;
  icon: typeof Bell;
}[];

const SettingsNavigationContext = createContext<{
  activeSection: SettingsSection;
  setActiveSection: (section: SettingsSection) => void;
} | null>(null);

export function SettingsNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("notifications");

  return (
    <SettingsNavigationContext.Provider
      value={{ activeSection, setActiveSection }}
    >
      {children}
    </SettingsNavigationContext.Provider>
  );
}

export function useSettingsNavigation() {
  const context = useContext(SettingsNavigationContext);

  if (!context) {
    throw new Error(
      "useSettingsNavigation must be used within SettingsNavigationProvider",
    );
  }

  return context;
}