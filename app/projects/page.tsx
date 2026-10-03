"use client";

import { useMemo, useState } from "react";
import {
  FolderKanban,
  Plus,
  Search,
  MoreHorizontal,
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ListTodo,
  Users,
  X,
  Edit3,
  Trash2,
  ArrowRight,
  Target,
} from "lucide-react";

type ProjectStatus = "Active" | "On Hold" | "Completed";

type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: "High" | "Medium" | "Low";
  progress: number;
  tasksTotal: number;
  tasksCompleted: number;
  dueDate: string;
  dueLabel: string;
  members: number;
  color: string;
  category: string;
};

const initialProjects: Project[] = [
  {
    id: 1,
    name: "Productivity AI Agent",
    description:
      "Build an autonomous AI productivity assistant with tasks, calendar, email, memory and automation.",
    status: "Active",
    priority: "High",
    progress: 68,
    tasksTotal: 25,
    tasksCompleted: 17,
    dueDate: "Oct 20, 2026",
    dueLabel: "Due in 17 days",
    members: 4,
    color: "blue",
    category: "Development",
  },
  {
    id: 2,
    name: "AI Video Learning Assistant",
    description:
      "AI-powered learning assistant that converts educational videos into summaries, concepts and quizzes.",
    status: "Active",
    priority: "High",
    progress: 82,
    tasksTotal: 17,
    tasksCompleted: 14,
    dueDate: "Oct 12, 2026",
    dueLabel: "Due in 9 days",
    members: 2,
    color: "purple",
    category: "AI / ML",
  },
  {
    id: 3,
    name: "EventMatch",
    description:
      "Community event discovery platform with event registration, location-based discovery and buddy matching.",
    status: "Active",
    priority: "Medium",
    progress: 55,
    tasksTotal: 20,
    tasksCompleted: 11,
    dueDate: "Oct 28, 2026",
    dueLabel: "Due in 25 days",
    members: 3,
    color: "green",
    category: "Web Development",
  },
  {
    id: 4,
    name: "Resume & Portfolio",
    description:
      "Improve technical resume, portfolio projects and internship application materials.",
    status: "Active",
    priority: "Medium",
    progress: 45,
    tasksTotal: 11,
    tasksCompleted: 5,
    dueDate: "Oct 15, 2026",
    dueLabel: "Due in 12 days",
    members: 1,
    color: "orange",
    category: "Career",
  },
  {
    id: 5,
    name: "Digital Marketing Campaign",
    description:
      "Plan and execute a digital marketing campaign with social media content and performance tracking.",
    status: "On Hold",
    priority: "Low",
    progress: 30,
    tasksTotal: 10,
    tasksCompleted: 3,
    dueDate: "Nov 5, 2026",
    dueLabel: "Due in 33 days",
    members: 3,
    color: "pink",
    category: "Marketing",
  },
  {
    id: 6,
    name: "Hackathon Preparation",
    description:
      "Prepare project documentation, presentation, demo and technical pitch for the upcoming hackathon.",
    status: "Completed",
    priority: "High",
    progress: 100,
    tasksTotal: 15,
    tasksCompleted: 15,
    dueDate: "Sep 28, 2026",
    dueLabel: "Completed",
    members: 4,
    color: "indigo",
    category: "Hackathon",
  },
];

const colorClasses: Record<
  string,
  {
    icon: string;
    bg: string;
    progress: string;
  }
> = {
  blue: {
    icon: "bg-blue-100 text-blue-600",
    bg: "bg-blue-600",
    progress: "bg-blue-600",
  },
  purple: {
    icon: "bg-purple-100 text-purple-600",
    bg: "bg-purple-600",
    progress: "bg-purple-600",
  },
  green: {
    icon: "bg-green-100 text-green-600",
    bg: "bg-green-600",
    progress: "bg-green-600",
  },
  orange: {
    icon: "bg-orange-100 text-orange-600",
    bg: "bg-orange-600",
    progress: "bg-orange-600",
  },
  pink: {
    icon: "bg-pink-100 text-pink-600",
    bg: "bg-pink-600",
    progress: "bg-pink-600",
  },
  indigo: {
    icon: "bg-indigo-100 text-indigo-600",
    bg: "bg-indigo-600",
    progress: "bg-indigo-600",
  },
};

export default function ProjectsPage() {
  const [projects, setProjects] =
    useState<Project[]>(initialProjects);

  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<"All" | ProjectStatus>("All");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [showDetails, setShowDetails] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    dueDate: "",
    category: "Development",
  });

  /* ============================================================
     STATISTICS
  ============================================================ */

  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const totalTasks = projects.reduce(
    (total, project) => total + project.tasksTotal,
    0
  );

  const completedTasks = projects.reduce(
    (total, project) => total + project.tasksCompleted,
    0
  );

  const overallProgress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  /* ============================================================
     FILTER PROJECTS
  ============================================================ */

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (activeFilter !== "All") {
      result = result.filter(
        (project) => project.status === activeFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description
            .toLowerCase()
            .includes(query) ||
          project.category
            .toLowerCase()
            .includes(query)
      );
    }

    return result;
  }, [projects, activeFilter, searchQuery]);

  /* ============================================================
     CREATE PROJECT
  ============================================================ */

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      alert("Please enter a project name.");
      return;
    }

    const project: Project = {
      id: Date.now(),
      name: newProject.name,
      description:
        newProject.description ||
        "New project created from the Productivity AI workspace.",
      status: "Active",
      priority: newProject.priority,
      progress: 0,
      tasksTotal: 0,
      tasksCompleted: 0,
      dueDate:
        newProject.dueDate || "No deadline",
      dueLabel: newProject.dueDate
        ? "Upcoming"
        : "No deadline",
      members: 1,
      color: "blue",
      category: newProject.category,
    };

    setProjects((previous) => [
      project,
      ...previous,
    ]);

    setNewProject({
      name: "",
      description: "",
      priority: "Medium",
      dueDate: "",
      category: "Development",
    });

    setShowCreateModal(false);
  };

  /* ============================================================
     DELETE PROJECT
  ============================================================ */

  const handleDeleteProject = () => {
    if (!selectedProject) return;

    const confirmed = window.confirm(
      `Delete "${selectedProject.name}"?`
    );

    if (!confirmed) return;

    setProjects((previous) =>
      previous.filter(
        (project) =>
          project.id !== selectedProject.id
      )
    );

    setSelectedProject(null);
    setShowDetails(false);
  };

  /* ============================================================
     VIEW PROJECT
  ============================================================ */

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="mx-auto max-w-[1600px]">

        {/* ======================================================
            PAGE HEADER
        ======================================================= */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* TITLE */}

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-600 p-3 text-white shadow-sm">
              <FolderKanban size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Projects
              </h1>

              <p className="text-sm text-slate-500">
                Organize your work and track project progress.
              </p>
            </div>

          </div>

          {/* SEARCH + CREATE */}

          <div className="flex items-center gap-2">

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
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
              New Project
            </button>

          </div>
        </div>

        {/* ======================================================
            SUMMARY CARDS
        ======================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* ACTIVE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Active Projects
              </span>

              <FolderKanban
                size={19}
                className="text-blue-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {activeProjects}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Projects currently in progress
            </p>

          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Completed
              </span>

              <CheckCircle2
                size={19}
                className="text-green-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {completedProjects}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Successfully completed projects
            </p>

          </div>

          {/* TASKS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Project Tasks
              </span>

              <ListTodo
                size={19}
                className="text-purple-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {completedTasks}
              <span className="text-base font-medium text-slate-400">
                /{totalTasks}
              </span>
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Tasks completed across projects
            </p>

          </div>

          {/* OVERALL PROGRESS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Overall Progress
              </span>

              <Target
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

        {/* ======================================================
            FILTER BAR
        ======================================================= */}

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
            {filteredProjects.length} project
            {filteredProjects.length !== 1
              ? "s"
              : ""}
          </p>

        </div>

        {/* ======================================================
            PROJECT GRID
        ======================================================= */}

        {filteredProjects.length > 0 ? (

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">

            {filteredProjects.map((project) => {

              const colors =
                colorClasses[project.color] ??
                colorClasses.blue;

              return (

                <div
                  key={project.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                  {/* CARD HEADER */}

                  <div className="mb-4 flex items-start justify-between">

                    <div className="flex items-start gap-3">

                      <div
                        className={`rounded-xl p-2.5 ${colors.icon}`}
                      >
                        <FolderKanban size={20} />
                      </div>

                      <div className="min-w-0">

                        <h3 className="break-words font-semibold text-slate-900">
                          {project.name}
                        </h3>

                        <span className="mt-1 inline-block text-xs text-slate-400">
                          {project.category}
                        </span>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        openProject(project)
                      }
                      className="rounded-lg p-2 text-slate-400 opacity-70 hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="mb-5 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
                    {project.description}
                  </p>

                  {/* STATUS + PRIORITY */}

                  <div className="mb-5 flex flex-wrap items-center gap-2">

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        project.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : project.status ===
                            "Completed"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {project.status}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        project.priority === "High"
                          ? "bg-red-50 text-red-600"
                          : project.priority ===
                            "Medium"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {project.priority} Priority
                    </span>

                  </div>

                  {/* PROGRESS */}

                  <div className="mb-5">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-xs font-medium text-slate-500">
                        Progress
                      </span>

                      <span className="text-xs font-semibold text-slate-700">
                        {project.progress}%
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className={`h-full rounded-full transition-all ${colors.progress}`}
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* PROJECT INFO */}

                  <div className="mb-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="mb-1 flex items-center gap-2 text-slate-400">

                        <ListTodo size={14} />

                        <span className="text-xs">
                          Tasks
                        </span>

                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        {project.tasksCompleted}/
                        {project.tasksTotal}
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="mb-1 flex items-center gap-2 text-slate-400">

                        <Users size={14} />

                        <span className="text-xs">
                          Members
                        </span>

                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        {project.members}
                      </p>

                    </div>

                  </div>

                  {/* FOOTER */}

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">

                    <div className="flex items-center gap-2 text-xs text-slate-400">

                      {project.status ===
                      "Completed" ? (
                        <CheckCircle2
                          size={14}
                          className="text-green-500"
                        />
                      ) : (
                        <CalendarDays size={14} />
                      )}

                      <span>
                        {project.dueLabel}
                      </span>

                    </div>

                    <button
                      onClick={() =>
                        openProject(project)
                      }
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Project
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
              <FolderKanban size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
              No projects found
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
          CREATE PROJECT MODAL
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
                  Create New Project
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Add a project to organize your work.
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
                  Project Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Website Redesign"
                  value={newProject.name}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      name: event.target.value,
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
                  placeholder="What is this project about?"
                  value={newProject.description}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
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
                    value={newProject.priority}
                    onChange={(event) =>
                      setNewProject({
                        ...newProject,
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
                    value={newProject.category}
                    onChange={(event) =>
                      setNewProject({
                        ...newProject,
                        category:
                          event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  >
                    <option>
                      Development
                    </option>
                    <option>
                      AI / ML
                    </option>
                    <option>
                      Web Development
                    </option>
                    <option>
                      Career
                    </option>
                    <option>
                      Marketing
                    </option>
                    <option>
                      Hackathon
                    </option>
                    <option>
                      Personal
                    </option>
                  </select>

                </div>

              </div>

              {/* DUE DATE */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Due Date
                </label>

                <input
                  type="date"
                  value={newProject.dueDate}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
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
                onClick={handleCreateProject}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Create Project
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          PROJECT DETAILS MODAL
      ========================================================= */}

      {showDetails && selectedProject && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
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

                <div
                  className={`rounded-xl p-3 ${
                    colorClasses[
                      selectedProject.color
                    ]?.icon ??
                    colorClasses.blue.icon
                  }`}
                >
                  <FolderKanban size={22} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedProject.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {selectedProject.category}
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

            <div className="space-y-6 p-6">

              {/* DESCRIPTION */}

              <div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="text-sm leading-6 text-slate-600">
                  {selectedProject.description}
                </p>

              </div>

              {/* STATUS */}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-xs text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedProject.status}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-xs text-slate-400">
                    Priority
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedProject.priority}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-xs text-slate-400">
                    Tasks
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedProject.tasksCompleted}/
                    {selectedProject.tasksTotal}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-xs text-slate-400">
                    Members
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedProject.members}
                  </p>

                </div>

              </div>

              {/* PROGRESS */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <p className="text-sm font-medium text-slate-700">
                    Project Progress
                  </p>

                  <p className="text-sm font-semibold text-blue-600">
                    {selectedProject.progress}%
                  </p>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className={`h-full rounded-full ${
                      colorClasses[
                        selectedProject.color
                      ]?.progress ??
                      colorClasses.blue.progress
                    }`}
                    style={{
                      width: `${selectedProject.progress}%`,
                    }}
                  />

                </div>

              </div>

              {/* DEADLINE */}

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">

                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <CalendarDays size={18} />
                </div>

                <div>

                  <p className="text-xs text-slate-400">
                    Deadline
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {selectedProject.dueDate}
                  </p>

                </div>

              </div>

              {/* QUICK ACTIONS */}

              <div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Quick Actions
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                  <button
                    onClick={() =>
                      alert(
                        "Project tasks will be connected to the Tasks page later."
                      )
                    }
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"
                  >

                    <ListTodo
                      size={18}
                      className="text-blue-600"
                    />

                    <div>

                      <p className="text-sm font-medium text-slate-700">
                        View Tasks
                      </p>

                      <p className="text-xs text-slate-400">
                        See project tasks
                      </p>

                    </div>

                  </button>

                  <button
                    onClick={() =>
                      alert(
                        "Calendar integration will be connected later."
                      )
                    }
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50"
                  >

                    <CalendarDays
                      size={18}
                      className="text-purple-600"
                    />

                    <div>

                      <p className="text-sm font-medium text-slate-700">
                        View Calendar
                      </p>

                      <p className="text-xs text-slate-400">
                        See project schedule
                      </p>

                    </div>

                  </button>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                onClick={handleDeleteProject}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete Project
              </button>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    alert(
                      "Project editing will be connected later."
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