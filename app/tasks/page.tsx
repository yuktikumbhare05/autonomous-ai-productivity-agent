"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Check,
  Clock3,
  AlertCircle,
  CircleCheck,
  ListTodo,
  Sparkles,
  CalendarDays,
  Timer,
  Mail,
  User,
  ChevronDown,
  X,
} from "lucide-react";

type TaskStatus = "Pending" | "In Progress" | "Completed";
type Priority = "High" | "Medium" | "Low";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  due: string;
  dueLabel: string;
  duration: string;
  source: string;
  project: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete Database Assignment",
    description: "Finish MongoDB queries and submit the assignment.",
    priority: "High",
    status: "In Progress",
    due: "2026-10-03",
    dueLabel: "Today, 6:00 PM",
    duration: "2 hrs",
    source: "Manual",
    project: "College",
  },
  {
    id: 2,
    title: "Reply to Internship Email",
    description: "Respond to the internship coordinator regarding project tasks.",
    priority: "Medium",
    status: "Pending",
    due: "2026-10-03",
    dueLabel: "Today, 4:00 PM",
    duration: "15 min",
    source: "Gmail",
    project: "Internship",
  },
  {
    id: 3,
    title: "Prepare Project Presentation",
    description: "Complete slides and prepare speaking notes.",
    priority: "High",
    status: "Pending",
    due: "2026-10-04",
    dueLabel: "Tomorrow",
    duration: "1.5 hrs",
    source: "Manual",
    project: "College",
  },
  {
    id: 4,
    title: "Review Operating Systems Notes",
    description: "Revise CPU scheduling and memory management.",
    priority: "Low",
    status: "Pending",
    due: "2026-10-05",
    dueLabel: "Oct 5",
    duration: "45 min",
    source: "Manual",
    project: "College",
  },
  {
    id: 5,
    title: "Update AI Learning Assistant README",
    description: "Add installation and usage instructions.",
    priority: "Medium",
    status: "Completed",
    due: "2026-10-02",
    dueLabel: "Yesterday",
    duration: "30 min",
    source: "Manual",
    project: "AI Project",
  },
  {
    id: 6,
    title: "Check Calendar for Upcoming Meetings",
    description: "Review upcoming events and identify scheduling conflicts.",
    priority: "Low",
    status: "Pending",
    due: "2026-10-06",
    dueLabel: "Oct 6",
    duration: "10 min",
    source: "Calendar",
    project: "Personal",
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      let matchesFilter = true;

      if (activeFilter === "Today") {
        matchesFilter = task.due === "2026-10-03";
      }

      if (activeFilter === "Upcoming") {
        matchesFilter =
          task.status !== "Completed" && task.due > "2026-10-03";
      }

      if (activeFilter === "Overdue") {
        matchesFilter =
          task.status !== "Completed" && task.due < "2026-10-03";
      }

      if (activeFilter === "Completed") {
        matchesFilter = task.status === "Completed";
      }

      if (activeFilter === "High Priority") {
        matchesFilter = task.priority === "High";
      }

      return matchesSearch && matchesFilter;
    });
  }, [tasks, activeFilter, search]);

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const todayCount = tasks.filter(
    (task) => task.due === "2026-10-03" && task.status !== "Completed"
  ).length;

  const overdueCount = tasks.filter(
    (task) => task.due < "2026-10-03" && task.status !== "Completed"
  ).length;

  const dueSoonCount = tasks.filter(
    (task) => task.due >= "2026-10-03" && task.status !== "Completed"
  ).length;

  function toggleTask(taskId: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                task.status === "Completed"
                  ? "Pending"
                  : "Completed",
            }
          : task
      )
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Tasks
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your tasks, priorities, and deadlines.
            </p>
          </div>

          <button
            onClick={() => setShowCreateTask(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={17} />
            New Task
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<ListTodo size={18} />}
            label="Today"
            value={todayCount}
          />

          <StatCard
            icon={<AlertCircle size={18} />}
            label="Overdue"
            value={overdueCount}
          />

          <StatCard
            icon={<Clock3 size={18} />}
            label="Due Soon"
            value={dueSoonCount}
          />

          <StatCard
            icon={<CircleCheck size={18} />}
            label="Completed"
            value={completedCount}
          />
        </div>

        {/* AI Recommendation */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Sparkles size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  AI Recommended Order
                </h2>

                <p className="text-xs text-slate-500">
                  Tasks prioritized using urgency, importance, and deadlines.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <RecommendedTask
              number="01"
              title="Complete Database Assignment"
              reason="Due today · High priority · 2 hrs estimated"
            />

            <RecommendedTask
              number="02"
              title="Reply to Internship Email"
              reason="Deadline approaching · Quick task · 15 min"
            />

            <RecommendedTask
              number="03"
              title="Prepare Project Presentation"
              reason="Due tomorrow · High priority · 1.5 hrs estimated"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "Today",
              "Upcoming",
              "Overdue",
              "Completed",
              "High Priority",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-56"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Optional filter bar */}
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
              <option>All Projects</option>
              <option>College</option>
              <option>Internship</option>
              <option>AI Project</option>
              <option>Personal</option>
            </select>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        )}

        {/* Tasks */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              My Tasks
            </h2>

            <span className="text-xs text-slate-400">
              {filteredTasks.length} tasks
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <ListTodo size={22} className="text-slate-400" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  No tasks found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your filter or search query.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          onClose={() => setShowCreateTask(false)}
          onCreate={(task) => {
            setTasks((current) => [
              {
                ...task,
                id: Date.now(),
              },
              ...current,
            ]);

            setShowCreateTask(false);
          }}
        />
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>

        <span className="text-2xl font-semibold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function RecommendedTask({
  number,
  title,
  reason,
}: {
  number: string;
  title: string;
  reason: string;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <span className="text-xs font-semibold text-blue-300">
        {number}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">{reason}</p>
      </div>

      <button className="hidden text-xs font-medium text-slate-500 hover:text-blue-700 sm:block">
        Why?
      </button>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onClick,
}: {
  task: Task;
  onToggle: () => void;
  onClick: () => void;
}) {
  return (
    <div className="group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={`Mark ${task.title} as ${
          task.status === "Completed" ? "pending" : "completed"
        }`}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
          task.status === "Completed"
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-300 bg-white hover:border-blue-500"
        }`}
      >
        {task.status === "Completed" && <Check size={12} />}
      </button>

      {/* Main task information */}
      <button
        onClick={onClick}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`text-sm font-medium ${
              task.status === "Completed"
                ? "text-slate-400 line-through"
                : "text-slate-800"
            }`}
          >
            {task.title}
          </p>

          <PriorityBadge priority={task.priority} />
        </div>

        <p className="mt-1 truncate text-xs text-slate-400">
          {task.description}
        </p>
      </button>

      {/* Project */}
      <div className="hidden w-28 md:block">
        <p className="text-xs text-slate-500">{task.project}</p>

        <p className="mt-1 text-[11px] text-slate-400">
          {task.source}
        </p>
      </div>

      {/* Due */}
      <div className="hidden w-32 items-center gap-2 lg:flex">
        <CalendarDays size={14} className="text-slate-400" />

        <span className="text-xs text-slate-500">
          {task.dueLabel}
        </span>
      </div>

      {/* Duration */}
      <div className="hidden w-20 items-center gap-1.5 xl:flex">
        <Timer size={14} className="text-slate-400" />

        <span className="text-xs text-slate-500">
          {task.duration}
        </span>
      </div>

      {/* Status */}
      <StatusBadge status={task.status} />

      {/* Menu */}
      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100">
        <MoreHorizontal size={17} />
      </button>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles = {
    High: "bg-slate-100 text-slate-700",
    Medium: "bg-slate-100 text-slate-600",
    Low: "bg-slate-50 text-slate-500",
  };

  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const styles = {
    Pending: "bg-slate-100 text-slate-600",
    "In Progress": "bg-blue-600 text-white",
    Completed: "bg-slate-100 text-slate-400",
  };

  return (
    <span
      className={`hidden shrink-0 rounded-md px-2.5 py-1 text-[10px] font-medium sm:block ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Create Task Modal                                                            */
/* -------------------------------------------------------------------------- */

function CreateTaskModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (task: Omit<Task, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [project, setProject] = useState("College");
  const [dueDate, setDueDate] = useState("2026-10-04");
  const [duration, setDuration] = useState("30 min");

  function handleCreate() {
    if (!title.trim()) return;

    onCreate({
      title,
      description,
      priority,
      status: "Pending",
      due: dueDate,
      dueLabel:
        dueDate === "2026-10-03"
          ? "Today"
          : dueDate === "2026-10-04"
          ? "Tomorrow"
          : dueDate,
      duration,
      source: "Manual",
      project,
    });
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Create New Task
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Add a task to your productivity workspace.
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4 p-6">
        <InputField
          label="Task title"
          value={title}
          onChange={setTitle}
          placeholder="e.g. Complete project documentation"
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Add some details..."
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Priority"
            value={priority}
            onChange={(value) => setPriority(value as Priority)}
            options={["High", "Medium", "Low"]}
          />

          <SelectField
            label="Project"
            value={project}
            onChange={setProject}
            options={["College", "Internship", "AI Project", "Personal"]}
          />

          <InputField
            label="Due date"
            type="date"
            value={dueDate}
            onChange={setDueDate}
          />

          <SelectField
            label="Estimated duration"
            value={duration}
            onChange={setDuration}
            options={["10 min", "15 min", "30 min", "45 min", "1 hr", "2 hrs"]}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          onClick={handleCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Task
        </button>
      </div>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Task Details Modal                                                           */
/* -------------------------------------------------------------------------- */

function TaskDetailsModal({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Task Details
        </h2>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {task.title}
            </h3>

            <PriorityBadge priority={task.priority} />
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {task.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DetailItem
            icon={<CalendarDays size={15} />}
            label="Due"
            value={task.dueLabel}
          />

          <DetailItem
            icon={<Timer size={15} />}
            label="Duration"
            value={task.duration}
          />

          <DetailItem
            icon={<FolderIcon />}
            label="Project"
            value={task.project}
          />

          <DetailItem
            icon={task.source === "Gmail" ? <Mail size={15} /> : <User size={15} />}
            label="Source"
            value={task.source}
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-blue-600" />

            <span className="text-xs font-semibold text-slate-700">
              AI Priority Explanation
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            This task is prioritized based on its deadline, importance,
            estimated effort, and current workload.
          </p>
        </div>
      </div>
    </ModalShell>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[10px] uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-1.5 text-xs font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function FolderIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h5l2 2h11v10H3z" />
    </svg>
  );
}