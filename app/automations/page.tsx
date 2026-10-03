"use client";

import { useMemo, useState } from "react";
import {
  Zap,
  Plus,
  Search,
  Play,
  Pause,
  MoreHorizontal,
  X,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Mail,
  CalendarDays,
  ListTodo,
  Sun,
  Moon,
  CalendarRange,
  Sparkles,
  Activity,
  Trash2,
  Edit3,
  ChevronRight,
} from "lucide-react";

type AutomationStatus = "Active" | "Paused";

type Automation = {
  id: number;
  name: string;
  description: string;
  trigger: string;
  schedule: string;
  status: AutomationStatus;
  lastRun: string;
  nextRun: string;
  category: string;
  actions: string[];
};

const initialAutomations: Automation[] = [
  {
    id: 1,
    name: "Morning Briefing",
    description:
      "Prepare a daily overview of tasks, calendar events, priorities and important updates.",
    trigger: "Scheduled",
    schedule: "Every day at 8:00 AM",
    status: "Active",
    lastRun: "Today, 8:00 AM",
    nextRun: "Tomorrow, 8:00 AM",
    category: "Planning",
    actions: [
      "Review today's calendar",
      "Check important tasks",
      "Summarize priorities",
      "Prepare daily briefing",
    ],
  },
  {
    id: 2,
    name: "Email Triage",
    description:
      "Analyze incoming emails, identify important messages and extract actionable tasks.",
    trigger: "New Email",
    schedule: "When new email arrives",
    status: "Active",
    lastRun: "Today, 10:42 AM",
    nextRun: "When triggered",
    category: "Email",
    actions: [
      "Retrieve new emails",
      "Classify emails",
      "Identify important messages",
      "Extract actions",
    ],
  },
  {
    id: 3,
    name: "Assignment & Deadline Tracker",
    description:
      "Monitor assignments and deadlines and create or update tasks when new deadlines are detected.",
    trigger: "Schedule",
    schedule: "Every 6 hours",
    status: "Active",
    lastRun: "Today, 6:00 AM",
    nextRun: "Today, 12:00 PM",
    category: "Tasks",
    actions: [
      "Check upcoming deadlines",
      "Compare existing tasks",
      "Create missing tasks",
      "Update due dates",
    ],
  },
  {
    id: 4,
    name: "Daily Planning",
    description:
      "Build a realistic plan for the day using tasks, deadlines, calendar availability and priorities.",
    trigger: "Scheduled",
    schedule: "Every day at 8:30 AM",
    status: "Paused",
    lastRun: "Yesterday, 8:30 AM",
    nextRun: "Paused",
    category: "Planning",
    actions: [
      "Review active tasks",
      "Check available time",
      "Prioritize work",
      "Create time blocks",
    ],
  },
  {
    id: 5,
    name: "Meeting Preparation",
    description:
      "Prepare useful context before meetings by reviewing related tasks, emails and previous information.",
    trigger: "Calendar Event",
    schedule: "30 minutes before meetings",
    status: "Active",
    lastRun: "Yesterday, 2:30 PM",
    nextRun: "Today, 3:30 PM",
    category: "Calendar",
    actions: [
      "Find upcoming meeting",
      "Review related emails",
      "Find related tasks",
      "Prepare meeting context",
    ],
  },
  {
    id: 6,
    name: "Evening Review",
    description:
      "Review completed work, unfinished tasks and prepare useful context for the next day.",
    trigger: "Scheduled",
    schedule: "Every day at 8:00 PM",
    status: "Active",
    lastRun: "Yesterday, 8:00 PM",
    nextRun: "Today, 8:00 PM",
    category: "Planning",
    actions: [
      "Review completed tasks",
      "Find unfinished work",
      "Summarize progress",
      "Prepare tomorrow's context",
    ],
  },
  {
    id: 7,
    name: "Weekly Review",
    description:
      "Summarize the previous week and identify priorities, unfinished work and upcoming deadlines.",
    trigger: "Scheduled",
    schedule: "Every Sunday at 6:00 PM",
    status: "Paused",
    lastRun: "Sep 27, 6:00 PM",
    nextRun: "Paused",
    category: "Planning",
    actions: [
      "Review weekly activity",
      "Analyze completed tasks",
      "Review goals",
      "Identify next priorities",
    ],
  },
];

export default function AutomationPage() {
  const [automations, setAutomations] =
    useState<Automation[]>(initialAutomations);

  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<"All" | AutomationStatus>("All");

  const [selectedAutomation, setSelectedAutomation] =
    useState<Automation | null>(null);

  const [showDetails, setShowDetails] = useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    trigger: "Scheduled",
    schedule: "",
    category: "Planning",
  });

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const activeCount = automations.filter(
    (automation) => automation.status === "Active"
  ).length;

  const pausedCount = automations.filter(
    (automation) => automation.status === "Paused"
  ).length;

  /* ==========================================================
     FILTERED AUTOMATIONS
  ========================================================== */

  const filteredAutomations = useMemo(() => {
    let result = [...automations];

    if (activeFilter !== "All") {
      result = result.filter(
        (automation) =>
          automation.status === activeFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (automation) =>
          automation.name
            .toLowerCase()
            .includes(query) ||
          automation.description
            .toLowerCase()
            .includes(query) ||
          automation.category
            .toLowerCase()
            .includes(query)
      );
    }

    return result;
  }, [automations, activeFilter, searchQuery]);

  /* ==========================================================
     TOGGLE AUTOMATION
  ========================================================== */

  const toggleAutomation = (id: number) => {
    setAutomations((previous) =>
      previous.map((automation) =>
        automation.id === id
          ? {
              ...automation,
              status:
                automation.status === "Active"
                  ? "Paused"
                  : "Active",
              nextRun:
                automation.status === "Active"
                  ? "Paused"
                  : automation.schedule,
            }
          : automation
      )
    );

    if (selectedAutomation?.id === id) {
      setSelectedAutomation((previous) =>
        previous
          ? {
              ...previous,
              status:
                previous.status === "Active"
                  ? "Paused"
                  : "Active",
              nextRun:
                previous.status === "Active"
                  ? "Paused"
                  : previous.schedule,
            }
          : null
      );
    }
  };

  /* ==========================================================
     RUN NOW
  ========================================================== */

  const runAutomation = (automation: Automation) => {
    alert(
      `"${automation.name}" has been triggered manually.\n\nBackend execution will be connected later.`
    );
  };

  /* ==========================================================
     DELETE AUTOMATION
  ========================================================== */

  const deleteAutomation = () => {
    if (!selectedAutomation) return;

    const confirmed = window.confirm(
      `Delete "${selectedAutomation.name}"?`
    );

    if (!confirmed) return;

    setAutomations((previous) =>
      previous.filter(
        (automation) =>
          automation.id !== selectedAutomation.id
      )
    );

    setSelectedAutomation(null);
    setShowDetails(false);
  };

  /* ==========================================================
     CREATE AUTOMATION
  ========================================================== */

  const createAutomation = () => {
    if (
      !newAutomation.name.trim() ||
      !newAutomation.description.trim()
    ) {
      alert(
        "Please enter an automation name and description."
      );
      return;
    }

    const automation: Automation = {
      id: Date.now(),
      name: newAutomation.name,
      description: newAutomation.description,
      trigger: newAutomation.trigger,
      schedule:
        newAutomation.schedule ||
        "Not scheduled",
      status: "Paused",
      lastRun: "Never",
      nextRun: "Paused",
      category: newAutomation.category,
      actions: [
        "Trigger automation",
        "Process relevant information",
        "Execute configured actions",
      ],
    };

    setAutomations((previous) => [
      automation,
      ...previous,
    ]);

    setNewAutomation({
      name: "",
      description: "",
      trigger: "Scheduled",
      schedule: "",
      category: "Planning",
    });

    setShowCreateModal(false);
  };

  /* ==========================================================
     CATEGORY ICON
  ========================================================== */

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Email":
        return Mail;

      case "Calendar":
        return CalendarDays;

      case "Tasks":
        return ListTodo;

      case "Planning":
        return Sparkles;

      default:
        return Zap;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px]">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-purple-600 p-3 text-white shadow-sm">
              <Zap size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Automation
              </h1>

              <p className="text-sm text-slate-500">
                Manage autonomous workflows and scheduled actions.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search automations..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="w-64 rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            {/* CREATE */}

            <button
              onClick={() =>
                setShowCreateModal(true)
              }
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
            >
              <Plus size={17} />
              New Automation
            </button>

          </div>

        </div>

        {/* ====================================================
            INFO BANNER
        ==================================================== */}

        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50 p-4">

          <div className="rounded-lg bg-white p-2 text-purple-600 shadow-sm">
            <Sparkles size={18} />
          </div>

          <div>

            <p className="text-sm font-semibold text-purple-900">
              Autonomous Workflows
            </p>

            <p className="mt-1 text-xs leading-5 text-purple-700">
              Automations allow the productivity agent to perform
              recurring tasks and respond to events without requiring
              manual execution every time.
            </p>

          </div>

        </div>

        {/* ====================================================
            SUMMARY CARDS
        ==================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Total Automations
              </span>

              <Zap
                size={19}
                className="text-purple-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {automations.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Configured workflows
            </p>

          </div>

          {/* ACTIVE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Active
              </span>

              <CheckCircle2
                size={19}
                className="text-green-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {activeCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Running automatically
            </p>

          </div>

          {/* PAUSED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Paused
              </span>

              <Pause
                size={19}
                className="text-orange-500"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {pausedCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Currently disabled
            </p>

          </div>

        </div>

        {/* ====================================================
            FILTERS
        ==================================================== */}

        <div className="mb-5 flex flex-wrap gap-2">

          {(
            ["All", "Active", "Paused"] as const
          ).map((filter) => (

            <button
              key={filter}
              onClick={() =>
                setActiveFilter(filter)
              }
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeFilter === filter
                  ? "bg-purple-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {filter}
            </button>

          ))}

        </div>

        {/* ====================================================
            AUTOMATION LIST
        ==================================================== */}

        {filteredAutomations.length > 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* LIST HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h2 className="font-semibold text-slate-900">
                  Workflows
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {filteredAutomations.length} automation
                  {filteredAutomations.length !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">

                <Activity
                  size={14}
                  className="text-green-500"
                />

                Automation engine ready

              </div>

            </div>

            {/* LIST */}

            <div className="divide-y divide-slate-100">

              {filteredAutomations.map(
                (automation) => {

                  const CategoryIcon =
                    getCategoryIcon(
                      automation.category
                    );

                  return (

                    <div
                      key={automation.id}
                      className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 lg:flex-row lg:items-center"
                    >

                      {/* ICON */}

                      <div className="flex items-start gap-4">

                        <div className="mt-0.5 shrink-0 rounded-xl bg-purple-50 p-3 text-purple-600">
                          <CategoryIcon size={20} />
                        </div>

                        {/* MAIN */}

                        <div className="min-w-0 lg:w-[420px]">

                          <div className="mb-1 flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold text-slate-800">
                              {automation.name}
                            </h3>

                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                automation.status ===
                                "Active"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-orange-50 text-orange-600"
                              }`}
                            >
                              {automation.status}
                            </span>

                          </div>

                          <p className="text-sm leading-5 text-slate-500">
                            {automation.description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">

                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500">
                              {automation.category}
                            </span>

                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500">
                              {automation.trigger}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* SCHEDULE */}

                      <div className="flex-1">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <Clock3
                            size={15}
                            className="text-slate-400"
                          />

                          {automation.schedule}

                        </div>

                        <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-slate-400">

                          <span>
                            Last run:{" "}
                            {automation.lastRun}
                          </span>

                          <span>
                            Next:{" "}
                            {automation.nextRun}
                          </span>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex items-center gap-2">

                        {/* RUN */}

                        <button
                          onClick={() =>
                            runAutomation(
                              automation
                            )
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          <Play size={14} />
                          Run
                        </button>

                        {/* TOGGLE */}

                        <button
                          onClick={() =>
                            toggleAutomation(
                              automation.id
                            )
                          }
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                            automation.status ===
                            "Active"
                              ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >

                          {automation.status ===
                          "Active" ? (
                            <>
                              <Pause size={14} />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play size={14} />
                              Activate
                            </>
                          )}

                        </button>

                        {/* DETAILS */}

                        <button
                          onClick={() => {
                            setSelectedAutomation(
                              automation
                            );
                            setShowDetails(true);
                          }}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreHorizontal
                            size={18}
                          />
                        </button>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          </div>

        ) : (

          /* EMPTY */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-500">
              <Zap size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
              No automations found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Try another search or filter.
            </p>

            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className="mt-4 text-sm font-medium text-purple-600 hover:underline"
            >
              Clear filters
            </button>

          </div>

        )}

      </div>

      {/* ========================================================
          DETAILS MODAL
      ========================================================= */}

      {showDetails && selectedAutomation && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() =>
            setShowDetails(false)
          }
        >

          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Zap size={22} />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedAutomation.name}
                    </h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        selectedAutomation.status ===
                        "Active"
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {selectedAutomation.status}
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedAutomation.description}
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setShowDetails(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* BODY */}

            <div className="p-6">

              {/* CONFIG */}

              <div className="mb-6 grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-400">
                    Trigger
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedAutomation.trigger}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-400">
                    Schedule
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedAutomation.schedule}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-400">
                    Last Run
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedAutomation.lastRun}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-400">
                    Next Run
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedAutomation.nextRun}
                  </p>

                </div>

              </div>

              {/* ACTION PIPELINE */}

              <div>

                <div className="mb-3 flex items-center gap-2">

                  <Sparkles
                    size={17}
                    className="text-purple-600"
                  />

                  <h3 className="font-semibold text-slate-800">
                    Workflow Actions
                  </h3>

                </div>

                <div className="space-y-2">

                  {selectedAutomation.actions.map(
                    (action, index) => (

                      <div
                        key={action}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                      >

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">
                          {index + 1}
                        </div>

                        <span className="text-sm text-slate-700">
                          {action}
                        </span>

                        {index <
                          selectedAutomation
                            .actions.length -
                            1 && (
                          <ChevronRight
                            size={15}
                            className="ml-auto text-slate-300"
                          />
                        )}

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* NOTE */}

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-xs leading-5 text-blue-700">
                  This workflow is currently a frontend
                  representation. Actual autonomous execution,
                  scheduling and integrations will be connected
                  to the backend later.
                </p>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                onClick={deleteAutomation}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete
              </button>

              <div className="flex items-center gap-2">

                <button
                  onClick={() =>
                    toggleAutomation(
                      selectedAutomation.id
                    )
                  }
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${
                    selectedAutomation.status ===
                    "Active"
                      ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >

                  {selectedAutomation.status ===
                  "Active" ? (
                    <>
                      <Pause size={16} />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Activate
                    </>
                  )}

                </button>

                <button
                  onClick={() =>
                    runAutomation(
                      selectedAutomation
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
                >
                  <Play size={16} />
                  Run Now
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ========================================================
          CREATE AUTOMATION MODAL
      ======================================================== */}

      {showCreateModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() =>
            setShowCreateModal(false)
          }
        >

          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  New Automation
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Create a workflow for the productivity agent.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={19} />
              </button>

            </div>

            {/* FORM */}

            <div className="space-y-4 p-6">

              {/* NAME */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Automation Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Weekly Assignment Check"
                  value={newAutomation.name}
                  onChange={(event) =>
                    setNewAutomation({
                      ...newAutomation,
                      name: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  rows={3}
                  placeholder="What should this automation do?"
                  value={newAutomation.description}
                  onChange={(event) =>
                    setNewAutomation({
                      ...newAutomation,
                      description:
                        event.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />

              </div>

              {/* TRIGGER */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Trigger
                </label>

                <select
                  value={newAutomation.trigger}
                  onChange={(event) =>
                    setNewAutomation({
                      ...newAutomation,
                      trigger:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400"
                >

                  <option value="Scheduled">
                    Scheduled
                  </option>

                  <option value="New Email">
                    New Email
                  </option>

                  <option value="Calendar Event">
                    Calendar Event
                  </option>

                  <option value="Task Update">
                    Task Update
                  </option>

                  <option value="Manual">
                    Manual
                  </option>

                </select>

              </div>

              {/* SCHEDULE */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Schedule
                </label>

                <input
                  type="text"
                  placeholder="e.g. Every day at 9:00 AM"
                  value={newAutomation.schedule}
                  onChange={(event) =>
                    setNewAutomation({
                      ...newAutomation,
                      schedule:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={newAutomation.category}
                  onChange={(event) =>
                    setNewAutomation({
                      ...newAutomation,
                      category:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400"
                >

                  <option value="Planning">
                    Planning
                  </option>

                  <option value="Email">
                    Email
                  </option>

                  <option value="Calendar">
                    Calendar
                  </option>

                  <option value="Tasks">
                    Tasks
                  </option>

                </select>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-white"
              >
                Cancel
              </button>

              <button
                onClick={createAutomation}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
              >
                <Plus size={16} />
                Create Automation
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}