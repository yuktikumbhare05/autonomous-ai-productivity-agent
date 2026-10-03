"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  Clock,
  Info,
  Lock,
  Save,
  Settings as SettingsIcon,
  Shield,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import PageHeader from "@/src/components/common/PageHeader";
import { useSettingsNavigation } from "@/src/layout/SettingsNavigation";

type SettingsState = {
  emailNotifications: boolean;
  taskReminders: boolean;
  calendarReminders: boolean;
  approvalNotifications: boolean;
  automationAlerts: boolean;
  dailyBriefing: boolean;
  quietHours: boolean;

  autonomousWorkflows: boolean;
  scheduledWorkflows: boolean;
  autoApproveLowRisk: boolean;
  requireApprovalExternal: boolean;
  workflowFailureAlerts: boolean;

  defaultPriority: string;
  defaultDuration: string;
  workingHours: string;
  timezone: string;
  startOfDay: string;
  endOfDay: string;

  responseStyle: string;
  planningStyle: string;
  proactiveSuggestions: boolean;
  detailedExplanations: boolean;
  confirmationBehavior: string;

  approvalRequired: boolean;
  activityLogging: boolean;
  dataProcessing: boolean;
};

type SettingsSectionProps = {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
};

export default function SettingsPage() {
  const { activeSection } = useSettingsNavigation();

  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    taskReminders: true,
    calendarReminders: true,
    approvalNotifications: true,
    automationAlerts: true,
    dailyBriefing: true,
    quietHours: false,

    autonomousWorkflows: true,
    scheduledWorkflows: true,
    autoApproveLowRisk: false,
    requireApprovalExternal: true,
    workflowFailureAlerts: true,

    defaultPriority: "Medium",
    defaultDuration: "30 minutes",
    workingHours: "9:00 AM - 6:00 PM",
    timezone: "Asia/Kolkata",
    startOfDay: "9:00 AM",
    endOfDay: "6:00 PM",

    responseStyle: "Concise",
    planningStyle: "Balanced",
    proactiveSuggestions: true,
    detailedExplanations: true,
    confirmationBehavior: "Ask when needed",

    approvalRequired: true,
    activityLogging: true,
    dataProcessing: true,
  });

  const [showSaved, setShowSaved] = useState(false);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    setShowSaved(true);

    setTimeout(() => {
      setShowSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <PageHeader
        title="Settings"
        description="Manage your preferences, automation and agent behavior"
        icon={SettingsIcon}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="mx-auto max-w-5xl px-8 py-7">
          {/* =================================================
              SETTINGS CONTENT
          ================================================= */}
          <main>
            {activeSection === "notifications" && (
              <NotificationsSection
                settings={settings}
                updateSetting={updateSetting}
              />
            )}

            {activeSection === "automation" && (
              <AutomationSection
                settings={settings}
                updateSetting={updateSetting}
              />
            )}

            {activeSection === "preferences" && (
              <PreferencesSection
                settings={settings}
                updateSetting={updateSetting}
              />
            )}

            {activeSection === "agent" && (
              <AgentSection
                settings={settings}
                updateSetting={updateSetting}
              />
            )}

            {activeSection === "security" && (
              <SecuritySection
                settings={settings}
                updateSetting={updateSetting}
              />
            )}

            {/* =================================================
                SAVE BAR
            ================================================= */}
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Changes are currently stored locally in demo mode.
              </p>

              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          </main>
      </div>

      {/* =====================================================
          SAVE TOAST
      ===================================================== */}
      {showSaved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
          <Check size={18} className="text-emerald-400" />
          Settings saved successfully
        </div>
      )}
    </div>
  );
}

/* ============================================================
   NOTIFICATIONS SECTION
============================================================ */

function NotificationsSection({
  settings,
  updateSetting,
}: SettingsSectionProps) {
  return (
    <SettingsCard
      title="Notifications"
      subtitle="Choose which notifications your productivity agent can send."
      icon={Bell}
    >
      <ToggleRow
        title="Email Notifications"
        description="Receive important productivity updates through email."
        value={settings.emailNotifications}
        onChange={(value) =>
          updateSetting("emailNotifications", value)
        }
      />

      <ToggleRow
        title="Task Reminders"
        description="Get reminders for upcoming and overdue tasks."
        value={settings.taskReminders}
        onChange={(value) =>
          updateSetting("taskReminders", value)
        }
      />

      <ToggleRow
        title="Calendar Reminders"
        description="Receive reminders before upcoming meetings and events."
        value={settings.calendarReminders}
        onChange={(value) =>
          updateSetting("calendarReminders", value)
        }
      />

      <ToggleRow
        title="Approval Requests"
        description="Notify me when an autonomous action requires approval."
        value={settings.approvalNotifications}
        onChange={(value) =>
          updateSetting("approvalNotifications", value)
        }
      />

      <ToggleRow
        title="Automation Alerts"
        description="Notify me when an automation succeeds or fails."
        value={settings.automationAlerts}
        onChange={(value) =>
          updateSetting("automationAlerts", value)
        }
      />

      <ToggleRow
        title="Daily Briefing"
        description="Receive your morning productivity briefing."
        value={settings.dailyBriefing}
        onChange={(value) =>
          updateSetting("dailyBriefing", value)
        }
      />

      <ToggleRow
        title="Quiet Hours"
        description="Temporarily suppress non-critical notifications."
        value={settings.quietHours}
        onChange={(value) =>
          updateSetting("quietHours", value)
        }
        last
      />

      <InfoBox>
        Critical approval requests and security alerts may still appear
        during quiet hours.
      </InfoBox>
    </SettingsCard>
  );
}

/* ============================================================
   AUTOMATION SECTION
============================================================ */

function AutomationSection({
  settings,
  updateSetting,
}: SettingsSectionProps) {
  return (
    <SettingsCard
      title="Automation"
      subtitle="Control how your AI agent performs autonomous workflows."
      icon={Zap}
    >
      <ToggleRow
        title="Autonomous Workflows"
        description="Allow the agent to execute scheduled productivity workflows."
        value={settings.autonomousWorkflows}
        onChange={(value) =>
          updateSetting("autonomousWorkflows", value)
        }
      />

      <ToggleRow
        title="Scheduled Workflows"
        description="Allow workflows such as Morning Briefing and Daily Planning to run automatically."
        value={settings.scheduledWorkflows}
        onChange={(value) =>
          updateSetting("scheduledWorkflows", value)
        }
      />

      <ToggleRow
        title="Auto-Approve Low-Risk Actions"
        description="Allow predefined low-risk actions to execute without asking."
        value={settings.autoApproveLowRisk}
        onChange={(value) =>
          updateSetting("autoApproveLowRisk", value)
        }
      />

      <ToggleRow
        title="Require Approval for External Actions"
        description="Require approval before sending emails or performing external actions."
        value={settings.requireApprovalExternal}
        onChange={(value) =>
          updateSetting("requireApprovalExternal", value)
        }
      />

      <ToggleRow
        title="Workflow Failure Alerts"
        description="Notify me when an autonomous workflow fails."
        value={settings.workflowFailureAlerts}
        onChange={(value) =>
          updateSetting("workflowFailureAlerts", value)
        }
        last
      />

      <InfoBox>
        Approval controls help keep sensitive autonomous actions under
        your control.
      </InfoBox>
    </SettingsCard>
  );
}

/* ============================================================
   PREFERENCES SECTION
============================================================ */

function PreferencesSection({
  settings,
  updateSetting,
}: SettingsSectionProps) {
  return (
    <SettingsCard
      title="Preferences"
      subtitle="Customize your default productivity settings."
      icon={SlidersHorizontal}
    >
      <SelectRow
        title="Default Task Priority"
        description="Priority automatically assigned to new tasks."
        value={settings.defaultPriority}
        options={["Low", "Medium", "High", "Urgent"]}
        onChange={(value) =>
          updateSetting("defaultPriority", value)
        }
      />

      <SelectRow
        title="Default Task Duration"
        description="Default estimated duration for new tasks."
        value={settings.defaultDuration}
        options={[
          "15 minutes",
          "30 minutes",
          "45 minutes",
          "1 hour",
          "2 hours",
        ]}
        onChange={(value) =>
          updateSetting("defaultDuration", value)
        }
      />

      <SelectRow
        title="Working Hours"
        description="Your standard productivity window."
        value={settings.workingHours}
        options={[
          "8:00 AM - 5:00 PM",
          "9:00 AM - 6:00 PM",
          "10:00 AM - 7:00 PM",
        ]}
        onChange={(value) =>
          updateSetting("workingHours", value)
        }
      />

      <SelectRow
        title="Timezone"
        description="Used for schedules, reminders and automations."
        value={settings.timezone}
        options={[
          "Asia/Kolkata",
          "Asia/Dubai",
          "Europe/London",
          "America/New_York",
        ]}
        onChange={(value) =>
          updateSetting("timezone", value)
        }
      />

      <SelectRow
        title="Start of Day"
        description="Preferred time for starting your productivity day."
        value={settings.startOfDay}
        options={[
          "7:00 AM",
          "8:00 AM",
          "9:00 AM",
          "10:00 AM",
        ]}
        onChange={(value) =>
          updateSetting("startOfDay", value)
        }
      />

      <SelectRow
        title="End of Day"
        description="Preferred end time for your productivity day."
        value={settings.endOfDay}
        options={[
          "5:00 PM",
          "6:00 PM",
          "7:00 PM",
          "8:00 PM",
        ]}
        onChange={(value) =>
          updateSetting("endOfDay", value)
        }
        last
      />
    </SettingsCard>
  );
}

/* ============================================================
   AGENT PREFERENCES SECTION
============================================================ */

function AgentSection({
  settings,
  updateSetting,
}: SettingsSectionProps) {
  return (
    <SettingsCard
      title="Agent Preferences"
      subtitle="Customize how your Productivity Agent communicates and plans."
      icon={SettingsIcon}
    >
      <SelectRow
        title="Response Style"
        description="Choose how detailed the agent's responses should be."
        value={settings.responseStyle}
        options={[
          "Concise",
          "Balanced",
          "Detailed",
        ]}
        onChange={(value) =>
          updateSetting("responseStyle", value)
        }
      />

      <SelectRow
        title="Planning Style"
        description="How the agent should organize your work."
        value={settings.planningStyle}
        options={[
          "Focused",
          "Balanced",
          "Flexible",
        ]}
        onChange={(value) =>
          updateSetting("planningStyle", value)
        }
      />

      <ToggleRow
        title="Proactive Suggestions"
        description="Allow the agent to suggest actions based on your tasks and schedule."
        value={settings.proactiveSuggestions}
        onChange={(value) =>
          updateSetting("proactiveSuggestions", value)
        }
      />

      <ToggleRow
        title="Detailed Explanations"
        description="Show why the agent recommends a task, schedule or action."
        value={settings.detailedExplanations}
        onChange={(value) =>
          updateSetting("detailedExplanations", value)
        }
      />

      <SelectRow
        title="Confirmation Behavior"
        description="Choose when the agent should ask for confirmation."
        value={settings.confirmationBehavior}
        options={[
          "Always ask",
          "Ask when needed",
          "Only sensitive actions",
        ]}
        onChange={(value) =>
          updateSetting("confirmationBehavior", value)
        }
        last
      />

      <div className="mt-5 rounded-xl bg-indigo-50 p-4">
        <div className="flex gap-3">
          <div className="mt-0.5 text-indigo-600">
            <Info size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-indigo-900">
              Productivity Agent
            </p>

            <p className="mt-1 text-xs leading-5 text-indigo-700">
              These preferences affect how the agent plans, explains
              recommendations and interacts with you through the central
              Productivity Agent chat.
            </p>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

/* ============================================================
   SECURITY & PRIVACY SECTION
============================================================ */

function SecuritySection({
  settings,
  updateSetting,
}: SettingsSectionProps) {
  return (
    <SettingsCard
      title="Security & Privacy"
      subtitle="Manage approvals, activity tracking and privacy controls."
      icon={Shield}
    >
      <ToggleRow
        title="Approval Required"
        description="Require confirmation before sensitive autonomous actions."
        value={settings.approvalRequired}
        onChange={(value) =>
          updateSetting("approvalRequired", value)
        }
      />

      <ToggleRow
        title="Activity Logging"
        description="Keep an audit trail of agent actions and workflow executions."
        value={settings.activityLogging}
        onChange={(value) =>
          updateSetting("activityLogging", value)
        }
      />

      <ToggleRow
        title="Data Processing"
        description="Allow the agent to process connected productivity data."
        value={settings.dataProcessing}
        onChange={(value) =>
          updateSetting("dataProcessing", value)
        }
        last
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SecurityCard
          icon={Lock}
          title="Approval Control"
          text="Sensitive actions can require your approval."
        />

        <SecurityCard
          icon={Clock}
          title="Audit Trail"
          text="Agent activities can be tracked for review."
        />
      </div>

      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
        <div className="flex gap-3">
          <Shield
            className="mt-0.5 text-red-500"
            size={19}
          />

          <div>
            <p className="text-sm font-semibold text-red-800">
              Emergency Stop
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700">
              The emergency stop can be used from the Approvals page
              to immediately stop autonomous execution.
            </p>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

/* ============================================================
   SETTINGS CARD
============================================================ */

function SettingsCard({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Icon size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              {title}
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

/* ============================================================
   TOGGLE ROW
============================================================ */

function ToggleRow({
  title,
  description,
  value,
  onChange,
  last = false,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-6 py-5 ${
        !last ? "border-b border-slate-100" : ""
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!value)}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
          value ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            value ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ============================================================
   SELECT ROW
============================================================ */

function SelectRow({
  title,
  description,
  value,
  options,
  onChange,
  last = false,
}: {
  title: string;
  description: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-6 py-5 ${
        !last ? "border-b border-slate-100" : ""
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ============================================================
   INFO BOX
============================================================ */

function InfoBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
      <div className="flex gap-3">
        <Info
          size={18}
          className="mt-0.5 flex-shrink-0 text-indigo-600"
        />

        <p className="text-xs leading-5 text-indigo-700">
          {children}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   SECURITY CARD
============================================================ */

function SecurityCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Icon size={19} className="text-indigo-600" />

      <p className="mt-3 text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}