"use client";

import { useMemo, useState } from "react";
import {
  Target,
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  CalendarDays,
  FolderKanban,
  ListTodo,
  X,
  Edit3,
  Trash2,
  ArrowRight,
  Trophy,
  Circle,
} from "lucide-react";

type GoalStatus = "Active" | "Completed" | "On Hold";

type Milestone = {
  id: number;
  title: string;
  completed: boolean;
};

type Goal = {
  id: number;
  title: string;
  description: string;
  status: GoalStatus;
  priority: "High" | "Medium" | "Low";
  progress: number;
  projects: number;
  tasksCompleted: number;
  tasksTotal: number;
  dueDate: string;
  dueLabel: string;
  category: string;
  milestones: Milestone[];
};

const initialGoals: Goal[] = [
  {
    id: 1,
    title: "Build a Production-Ready AI Agent",
    description:
      "Develop an autonomous productivity assistant capable of managing tasks, projects, email, calendar and workflows.",
    status: "Active",
    priority: "High",
    progress: 65,
    projects: 2,
    tasksCompleted: 26,
    tasksTotal: 40,
    dueDate: "Dec 15, 2026",
    dueLabel: "Due in 73 days",
    category: "Career & Development",
    milestones: [
      {
        id: 1,
        title: "Complete frontend workspace",
        completed: true,
      },
      {
        id: 2,
        title: "Build backend API layer",
        completed: true,
      },
      {
        id: 3,
        title: "Connect database",
        completed: false,
      },
      {
        id: 4,
        title: "Integrate AI agent",
        completed: false,
      },
      {
        id: 5,
        title: "Complete Gmail and Calendar integration",
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: "Build Strong AI/ML Portfolio",
    description:
      "Create practical AI and machine learning projects that demonstrate technical and problem-solving skills.",
    status: "Active",
    priority: "High",
    progress: 72,
    projects: 3,
    tasksCompleted: 18,
    tasksTotal: 25,
    dueDate: "Nov 30, 2026",
    dueLabel: "Due in 58 days",
    category: "Learning",
    milestones: [
      {
        id: 6,
        title: "Complete AI Video Learning Assistant",
        completed: true,
      },
      {
        id: 7,
        title: "Build predictive AI project",
        completed: true,
      },
      {
        id: 8,
        title: "Deploy projects",
        completed: false,
      },
      {
        id: 9,
        title: "Document projects on GitHub",
        completed: false,
      },
    ],
  },
  {
    id: 3,
    title: "Prepare for Internship Opportunities",
    description:
      "Improve resume, portfolio, technical skills and interview preparation for software engineering internships.",
    status: "Active",
    priority: "High",
    progress: 48,
    projects: 2,
    tasksCompleted: 9,
    tasksTotal: 20,
    dueDate: "Nov 15, 2026",
    dueLabel: "Due in 43 days",
    category: "Career",
    milestones: [
      {
        id: 10,
        title: "Finalize ATS-friendly resume",
        completed: true,
      },
      {
        id: 11,
        title: "Complete portfolio",
        completed: false,
      },
      {
        id: 12,
        title: "Practice technical interviews",
        completed: false,
      },
      {
        id: 13,
        title: "Apply to internships",
        completed: false,
      },
    ],
  },
  {
    id: 4,
    title: "Complete Current Semester Projects",
    description:
      "Finish academic projects, presentations and documentation before the semester deadlines.",
    status: "Active",
    priority: "Medium",
    progress: 58,
    projects: 4,
    tasksCompleted: 23,
    tasksTotal: 39,
    dueDate: "Nov 10, 2026",
    dueLabel: "Due in 38 days",
    category: "Academics",
    milestones: [
      {
        id: 14,
        title: "Complete project implementations",
        completed: true,
      },
      {
        id: 15,
        title: "Prepare presentations",
        completed: true,
      },
      {
        id: 16,
        title: "Complete documentation",
        completed: false,
      },
      {
        id: 17,
        title: "Submit final projects",
        completed: false,
      },
    ],
  },
  {
    id: 5,
    title: "Learn Advanced Python",
    description:
      "Strengthen Python programming skills with advanced concepts, APIs, automation and practical projects.",
    status: "On Hold",
    priority: "Medium",
    progress: 35,
    projects: 1,
    tasksCompleted: 7,
    tasksTotal: 20,
    dueDate: "Jan 15, 2027",
    dueLabel: "Due in 104 days",
    category: "Learning",
    milestones: [
      {
        id: 18,
        title: "Complete advanced Python concepts",
        completed: true,
      },
      {
        id: 19,
        title: "Learn REST APIs",
        completed: false,
      },
      {
        id: 20,
        title: "Build automation project",
        completed: false,
      },
    ],
  },
  {
    id: 6,
    title: "Hackathon Project",
    description:
      "Prepare a complete hackathon solution including research, implementation, presentation and final demo.",
    status: "Completed",
    priority: "High",
    progress: 100,
    projects: 1,
    tasksCompleted: 18,
    tasksTotal: 18,
    dueDate: "Sep 28, 2026",
    dueLabel: "Completed",
    category: "Hackathon",
    milestones: [
      {
        id: 21,
        title: "Problem research",
        completed: true,
      },
      {
        id: 22,
        title: "Prototype",
        completed: true,
      },
      {
        id: 23,
        title: "Final presentation",
        completed: true,
      },
      {
        id: 24,
        title: "Final submission",
        completed: true,
      },
    ],
  },
];

export default function GoalsPage() {
  const [goals, setGoals] =
    useState<Goal[]>(initialGoals);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState<"All" | GoalStatus>("All");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [selectedGoal, setSelectedGoal] =
    useState<Goal | null>(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    dueDate: "",
    category: "Personal",
  });

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const activeGoals = goals.filter(
    (goal) => goal.status === "Active"
  ).length;

  const completedGoals = goals.filter(
    (goal) => goal.status === "Completed"
  ).length;

  const totalMilestones = goals.reduce(
    (total, goal) =>
      total + goal.milestones.length,
    0
  );

  const completedMilestones = goals.reduce(
    (total, goal) =>
      total +
      goal.milestones.filter(
        (milestone) => milestone.completed
      ).length,
    0
  );

  const overallProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce(
            (total, goal) => total + goal.progress,
            0
          ) / goals.length
        )
      : 0;

  /* ==========================================================
     FILTER
  ========================================================== */

  const filteredGoals = useMemo(() => {
    let result = [...goals];

    if (activeFilter !== "All") {
      result = result.filter(
        (goal) => goal.status === activeFilter
      );
    }

    if (searchQuery.trim()) {
      const query =
        searchQuery.toLowerCase();

      result = result.filter(
        (goal) =>
          goal.title
            .toLowerCase()
            .includes(query) ||
          goal.description
            .toLowerCase()
            .includes(query) ||
          goal.category
            .toLowerCase()
            .includes(query)
      );
    }

    return result;
  }, [goals, activeFilter, searchQuery]);

  /* ==========================================================
     CREATE GOAL
  ========================================================== */

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) {
      alert("Please enter a goal title.");
      return;
    }

    const goal: Goal = {
      id: Date.now(),
      title: newGoal.title,
      description:
        newGoal.description ||
        "New goal created from the Productivity AI workspace.",
      status: "Active",
      priority: newGoal.priority,
      progress: 0,
      projects: 0,
      tasksCompleted: 0,
      tasksTotal: 0,
      dueDate:
        newGoal.dueDate || "No deadline",
      dueLabel: newGoal.dueDate
        ? "Upcoming"
        : "No deadline",
      category: newGoal.category,
      milestones: [],
    };

    setGoals((previous) => [
      goal,
      ...previous,
    ]);

    setNewGoal({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
      category: "Personal",
    });

    setShowCreateModal(false);
  };

  /* ==========================================================
     DELETE GOAL
  ========================================================== */

  const handleDeleteGoal = () => {
    if (!selectedGoal) return;

    const confirmed = window.confirm(
      `Delete "${selectedGoal.title}"?`
    );

    if (!confirmed) return;

    setGoals((previous) =>
      previous.filter(
        (goal) =>
          goal.id !== selectedGoal.id
      )
    );

    setSelectedGoal(null);
    setShowDetails(false);
  };

  /* ==========================================================
     TOGGLE MILESTONE
  ========================================================== */

  const toggleMilestone = (
    goalId: number,
    milestoneId: number
  ) => {
    setGoals((previous) =>
      previous.map((goal) => {
        if (goal.id !== goalId) {
          return goal;
        }

        const updatedMilestones =
          goal.milestones.map(
            (milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    completed:
                      !milestone.completed,
                  }
                : milestone
          );

        const completed =
          updatedMilestones.filter(
            (milestone) =>
              milestone.completed
          ).length;

        const progress =
          updatedMilestones.length > 0
            ? Math.round(
                (completed /
                  updatedMilestones.length) *
                  100
              )
            : goal.progress;

        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
          status:
            progress === 100
              ? "Completed"
              : goal.status === "Completed"
              ? "Active"
              : goal.status,
        };
      })
    );

    if (selectedGoal?.id === goalId) {
      setSelectedGoal((previous) => {
        if (!previous) return null;

        const updatedMilestones =
          previous.milestones.map(
            (milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    completed:
                      !milestone.completed,
                  }
                : milestone
          );

        const completed =
          updatedMilestones.filter(
            (milestone) =>
              milestone.completed
          ).length;

        return {
          ...previous,
          milestones: updatedMilestones,
          progress:
            updatedMilestones.length > 0
              ? Math.round(
                  (completed /
                    updatedMilestones.length) *
                    100
                )
              : previous.progress,
        };
      });
    }
  };

  /* ==========================================================
     OPEN DETAILS
  ========================================================== */

  const openGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="mx-auto max-w-[1600px]">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-600 p-3 text-white shadow-sm">
              <Target size={24} />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Goals
              </h1>

              <p className="text-sm text-slate-500">
                Track your long-term objectives and milestones.
              </p>

            </div>

          </div>

          {/* SEARCH + NEW GOAL */}

          <div className="flex items-center gap-2">

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search goals..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                className="w-64 rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <button
              onClick={() =>
                setShowCreateModal(true)
              }
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              <Plus size={17} />
              New Goal
            </button>

          </div>

        </div>

        {/* ====================================================
            SUMMARY CARDS
        ==================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* ACTIVE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Active Goals
              </span>

              <Target
                size={19}
                className="text-blue-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {activeGoals}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Goals currently in progress
            </p>

          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Completed
              </span>

              <Trophy
                size={19}
                className="text-green-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {completedGoals}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Goals successfully achieved
            </p>

          </div>

          {/* MILESTONES */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Milestones
              </span>

              <CheckCircle2
                size={19}
                className="text-purple-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">

              {completedMilestones}

              <span className="text-base font-medium text-slate-400">
                /{totalMilestones}
              </span>

            </p>

            <p className="mt-1 text-xs text-slate-500">
              Milestones completed
            </p>

          </div>

          {/* OVERALL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Overall Progress
              </span>

              <Clock3
                size={19}
                className="text-orange-500"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {overallProgress}%
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${overallProgress}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* ====================================================
            FILTERS
        ==================================================== */}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

          <div className="flex flex-wrap gap-2">

            {(
              [
                "All",
                "Active",
                "On Hold",
                "Completed",
              ] as const
            ).map((filter) => (

              <button
                key={filter}
                onClick={() =>
                  setActiveFilter(filter)
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>

            ))}

          </div>

          <p className="text-sm text-slate-400">
            {filteredGoals.length} goal
            {filteredGoals.length !== 1
              ? "s"
              : ""}
          </p>

        </div>

        {/* ====================================================
            GOAL CARDS
        ==================================================== */}

        {filteredGoals.length > 0 ? (

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {filteredGoals.map((goal) => {

              const completedMilestones =
                goal.milestones.filter(
                  (milestone) =>
                    milestone.completed
                ).length;

              return (

                <div
                  key={goal.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                  {/* CARD HEADER */}

                  <div className="mb-4 flex items-start justify-between">

                    <div className="flex items-start gap-3">

                      <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
                        <Target size={21} />
                      </div>

                      <div>

                        <h3 className="font-semibold text-slate-900">
                          {goal.title}
                        </h3>

                        <span className="mt-1 inline-block text-xs text-slate-400">
                          {goal.category}
                        </span>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        openGoal(goal)
                      }
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="mb-5 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
                    {goal.description}
                  </p>

                  {/* STATUS */}

                  <div className="mb-5 flex flex-wrap gap-2">

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        goal.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : goal.status ===
                            "Completed"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {goal.status}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        goal.priority === "High"
                          ? "bg-red-50 text-red-600"
                          : goal.priority ===
                            "Medium"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {goal.priority} Priority
                    </span>

                  </div>

                  {/* PROGRESS */}

                  <div className="mb-5">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-xs font-medium text-slate-500">
                        Goal Progress
                      </span>

                      <span className="text-xs font-semibold text-blue-600">
                        {goal.progress}%
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${goal.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* MILESTONE PREVIEW */}

                  <div className="mb-5">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-xs font-medium text-slate-500">
                        Milestones
                      </span>

                      <span className="text-xs text-slate-400">
                        {completedMilestones}/
                        {goal.milestones.length}
                      </span>

                    </div>

                    <div className="space-y-2">

                      {goal.milestones
                        .slice(0, 3)
                        .map((milestone) => (

                          <div
                            key={milestone.id}
                            className="flex items-center gap-2"
                          >

                            {milestone.completed ? (
                              <CheckCircle2
                                size={15}
                                className="shrink-0 text-green-500"
                              />
                            ) : (
                              <Circle
                                size={15}
                                className="shrink-0 text-slate-300"
                              />
                            )}

                            <span
                              className={`truncate text-xs ${
                                milestone.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-600"
                              }`}
                            >
                              {milestone.title}
                            </span>

                          </div>

                        ))}

                      {goal.milestones.length >
                        3 && (
                        <button
                          onClick={() =>
                            openGoal(goal)
                          }
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          +{" "}
                          {goal.milestones.length -
                            3}{" "}
                          more milestones
                        </button>
                      )}

                    </div>

                  </div>

                  {/* INFO */}

                  <div className="mb-5 grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">

                        <FolderKanban size={13} />

                        <span className="text-xs">
                          Projects
                        </span>

                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        {goal.projects}
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">

                        <ListTodo size={13} />

                        <span className="text-xs">
                          Tasks
                        </span>

                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        {goal.tasksCompleted}/
                        {goal.tasksTotal}
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">

                        <CalendarDays size={13} />

                        <span className="text-xs">
                          Due
                        </span>

                      </div>

                      <p className="truncate text-xs font-semibold text-slate-700">
                        {goal.dueDate}
                      </p>

                    </div>

                  </div>

                  {/* FOOTER */}

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">

                    <span className="text-xs text-slate-400">
                      {goal.dueLabel}
                    </span>

                    <button
                      onClick={() =>
                        openGoal(goal)
                      }
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Goal
                      <ArrowRight size={13} />
                    </button>

                  </div>

                </div>

              );
            })}

          </div>

        ) : (

          /* EMPTY STATE */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Target size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
              No goals found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filter.
            </p>

            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className="mt-4 text-sm font-medium text-blue-600 hover:underline"
            >
              Clear filters
            </button>

          </div>

        )}

      </div>

      {/* ========================================================
          CREATE GOAL MODAL
      ========================================================= */}

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
                  Create New Goal
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Define a long-term objective and track its progress.
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

              {/* TITLE */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Goal Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Become job-ready for internships"
                  value={newGoal.title}
                  onChange={(event) =>
                    setNewGoal({
                      ...newGoal,
                      title:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  rows={3}
                  placeholder="What do you want to achieve?"
                  value={newGoal.description}
                  onChange={(event) =>
                    setNewGoal({
                      ...newGoal,
                      description:
                        event.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* PRIORITY + CATEGORY */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    value={newGoal.priority}
                    onChange={(event) =>
                      setNewGoal({
                        ...newGoal,
                        priority:
                          event.target.value as
                            | "High"
                            | "Medium"
                            | "Low",
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  >

                    <option value="High">
                      High
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Low">
                      Low
                    </option>

                  </select>

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    value={newGoal.category}
                    onChange={(event) =>
                      setNewGoal({
                        ...newGoal,
                        category:
                          event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  >

                    <option>
                      Personal
                    </option>

                    <option>
                      Career
                    </option>

                    <option>
                      Academics
                    </option>

                    <option>
                      Learning
                    </option>

                    <option>
                      Career & Development
                    </option>

                    <option>
                      Health
                    </option>

                    <option>
                      Finance
                    </option>

                  </select>

                </div>

              </div>

              {/* DUE DATE */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Target Date
                </label>

                <input
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(event) =>
                    setNewGoal({
                      ...newGoal,
                      dueDate:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

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
                onClick={handleCreateGoal}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Create Goal
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ========================================================
          GOAL DETAILS MODAL
      ========================================================= */}

      {showDetails && selectedGoal && (

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

                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <Target size={22} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedGoal.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {selectedGoal.category}
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

            {/* CONTENT */}

            <div className="max-h-[70vh] overflow-y-auto p-6">

              <div className="space-y-6">

                {/* DESCRIPTION */}

                <div>

                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Objective
                  </p>

                  <p className="text-sm leading-6 text-slate-600">
                    {selectedGoal.description}
                  </p>

                </div>

                {/* STATS */}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-xl bg-slate-50 p-3">

                    <p className="text-xs text-slate-400">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedGoal.status}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">

                    <p className="text-xs text-slate-400">
                      Priority
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedGoal.priority}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">

                    <p className="text-xs text-slate-400">
                      Projects
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedGoal.projects}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">

                    <p className="text-xs text-slate-400">
                      Progress
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedGoal.progress}%
                    </p>

                  </div>

                </div>

                {/* PROGRESS */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <p className="text-sm font-medium text-slate-700">
                      Overall Progress
                    </p>

                    <p className="text-sm font-semibold text-blue-600">
                      {selectedGoal.progress}%
                    </p>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${selectedGoal.progress}%`,
                      }}
                    />

                  </div>

                </div>

                {/* MILESTONES */}

                <div>

                  <div className="mb-3 flex items-center justify-between">

                    <p className="text-sm font-semibold text-slate-800">
                      Milestones
                    </p>

                    <span className="text-xs text-slate-400">
                      {
                        selectedGoal.milestones.filter(
                          (milestone) =>
                            milestone.completed
                        ).length
                      }
                      /
                      {
                        selectedGoal.milestones
                          .length
                      }{" "}
                      completed
                    </span>

                  </div>

                  <div className="space-y-2">

                    {selectedGoal.milestones
                      .length > 0 ? (

                      selectedGoal.milestones.map(
                        (milestone) => (

                          <button
                            key={milestone.id}
                            onClick={() =>
                              toggleMilestone(
                                selectedGoal.id,
                                milestone.id
                              )
                            }
                            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:bg-slate-50"
                          >

                            {milestone.completed ? (
                              <CheckCircle2
                                size={19}
                                className="shrink-0 text-green-500"
                              />
                            ) : (
                              <Circle
                                size={19}
                                className="shrink-0 text-slate-300"
                              />
                            )}

                            <span
                              className={`text-sm ${
                                milestone.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-700"
                              }`}
                            >
                              {milestone.title}
                            </span>

                          </button>

                        )
                      )

                    ) : (

                      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">

                        <p className="text-sm text-slate-400">
                          No milestones added yet.
                        </p>

                      </div>

                    )}

                  </div>

                </div>

                {/* DEADLINE */}

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">

                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <CalendarDays size={18} />
                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Target Date
                    </p>

                    <p className="text-sm font-medium text-slate-700">
                      {selectedGoal.dueDate}
                    </p>

                  </div>

                </div>

                {/* PROJECT CONNECTION */}

                <div className="rounded-xl border border-slate-200 p-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                        <FolderKanban size={18} />
                      </div>

                      <div>

                        <p className="text-sm font-medium text-slate-700">
                          Linked Projects
                        </p>

                        <p className="text-xs text-slate-400">
                          {selectedGoal.projects} project
                          {selectedGoal.projects !==
                          1
                            ? "s"
                            : ""}{" "}
                          connected to this goal
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        alert(
                          "Project linking will be connected later."
                        )
                      }
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      View Projects
                    </button>

                  </div>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                onClick={handleDeleteGoal}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete Goal
              </button>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    alert(
                      "Goal editing will be connected later."
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Edit3 size={16} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    setShowDetails(false)
                  }
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Done
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}