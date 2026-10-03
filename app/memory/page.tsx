"use client";

import { useMemo, useState } from "react";
import {
  Brain,
  Search,
  Plus,
  Trash2,
  X,
  MoreHorizontal,
  Clock3,
  Heart,
  History,
  Users,
  Database,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Tag,
  CalendarDays,
} from "lucide-react";

type MemoryType =
  | "Preference"
  | "Episodic"
  | "Entity"
  | "Structured"
  | "Semantic"
  | "Working";

type Memory = {
  id: number;
  title: string;
  content: string;
  type: MemoryType;
  source: string;
  createdAt: string;
  lastUsed: string;
  importance: "High" | "Medium" | "Low";
  tags: string[];
};

const initialMemories: Memory[] = [
  {
    id: 1,
    title: "Preferred Working Hours",
    content:
      "User prefers doing focused work between 9:00 AM and 1:00 PM.",
    type: "Preference",
    source: "User preference",
    createdAt: "Oct 1, 2026",
    lastUsed: "Today",
    importance: "High",
    tags: ["schedule", "focus-time"],
  },
  {
    id: 2,
    title: "Email Communication Style",
    content:
      "User prefers professional but concise email responses.",
    type: "Preference",
    source: "User preference",
    createdAt: "Sep 28, 2026",
    lastUsed: "Yesterday",
    importance: "High",
    tags: ["email", "communication"],
  },
  {
    id: 3,
    title: "AI Video Learning Assistant",
    content:
      "User completed an AI-powered video learning assistant that converts educational videos into transcripts, summaries and quizzes.",
    type: "Episodic",
    source: "Project activity",
    createdAt: "Sep 20, 2026",
    lastUsed: "Sep 30",
    importance: "High",
    tags: ["project", "AI", "Python"],
  },
  {
    id: 4,
    title: "EventMatch Project",
    content:
      "User is working on the database layer for an event discovery application using MongoDB.",
    type: "Entity",
    source: "Project context",
    createdAt: "Sep 18, 2026",
    lastUsed: "Sep 29",
    importance: "Medium",
    tags: ["project", "MongoDB", "events"],
  },
  {
    id: 5,
    title: "Current Productivity Agent",
    content:
      "User is developing an autonomous AI personal productivity agent with tasks, projects, goals, email, calendar and workflows.",
    type: "Structured",
    source: "Workspace",
    createdAt: "Oct 2, 2026",
    lastUsed: "Today",
    importance: "High",
    tags: ["project", "productivity", "AI"],
  },
  {
    id: 6,
    title: "Current Semester Projects",
    content:
      "Several academic projects and presentations need to be completed during the current semester.",
    type: "Structured",
    source: "Workspace",
    createdAt: "Sep 25, 2026",
    lastUsed: "Today",
    importance: "Medium",
    tags: ["academics", "projects"],
  },
  {
    id: 7,
    title: "Hackathon Experience",
    content:
      "User has participated in hackathon projects involving AI and cybersecurity concepts.",
    type: "Episodic",
    source: "Project history",
    createdAt: "Sep 15, 2026",
    lastUsed: "Sep 27",
    importance: "Medium",
    tags: ["hackathon", "AI", "cybersecurity"],
  },
  {
    id: 8,
    title: "Productivity Context",
    content:
      "Current conversation context includes active tasks, projects, goals and upcoming deadlines.",
    type: "Working",
    source: "Current session",
    createdAt: "Oct 3, 2026",
    lastUsed: "Now",
    importance: "Low",
    tags: ["context", "session"],
  },
];

const memoryTypeConfig: Record<
  MemoryType,
  {
    icon: any;
    description: string;
    iconClass: string;
    bgClass: string;
  }
> = {
  Preference: {
    icon: Heart,
    description: "User preferences and habits",
    iconClass: "text-pink-600",
    bgClass: "bg-pink-50",
  },
  Episodic: {
    icon: History,
    description: "Important past events",
    iconClass: "text-purple-600",
    bgClass: "bg-purple-50",
  },
  Entity: {
    icon: Users,
    description: "People, projects and relationships",
    iconClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },
  Structured: {
    icon: Database,
    description: "Structured user information",
    iconClass: "text-green-600",
    bgClass: "bg-green-50",
  },
  Semantic: {
    icon: Sparkles,
    description: "Searchable contextual information",
    iconClass: "text-orange-600",
    bgClass: "bg-orange-50",
  },
  Working: {
    icon: Clock3,
    description: "Current execution context",
    iconClass: "text-slate-600",
    bgClass: "bg-slate-100",
  },
};

export default function MemoryPage() {
  const [memories, setMemories] =
    useState<Memory[]>(initialMemories);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [activeType, setActiveType] =
    useState<"All" | MemoryType>("All");

  const [selectedMemory, setSelectedMemory] =
    useState<Memory | null>(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [newMemory, setNewMemory] = useState({
    title: "",
    content: "",
    type: "Preference" as MemoryType,
    importance: "Medium" as
      | "High"
      | "Medium"
      | "Low",
    tags: "",
  });

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const preferenceCount = memories.filter(
    (memory) => memory.type === "Preference"
  ).length;

  const episodicCount = memories.filter(
    (memory) => memory.type === "Episodic"
  ).length;

  const structuredCount = memories.filter(
    (memory) => memory.type === "Structured"
  ).length;

  const totalMemories = memories.length;

  /* ==========================================================
     FILTER
  ========================================================== */

  const filteredMemories = useMemo(() => {
    let result = [...memories];

    if (activeType !== "All") {
      result = result.filter(
        (memory) => memory.type === activeType
      );
    }

    if (searchQuery.trim()) {
      const query =
        searchQuery.toLowerCase();

      result = result.filter(
        (memory) =>
          memory.title
            .toLowerCase()
            .includes(query) ||
          memory.content
            .toLowerCase()
            .includes(query) ||
          memory.source
            .toLowerCase()
            .includes(query) ||
          memory.tags.some((tag) =>
            tag.toLowerCase().includes(query)
          )
      );
    }

    return result;
  }, [memories, activeType, searchQuery]);

  /* ==========================================================
     CREATE MEMORY
  ========================================================== */

  const handleCreateMemory = () => {
    if (
      !newMemory.title.trim() ||
      !newMemory.content.trim()
    ) {
      alert(
        "Please enter both a title and memory content."
      );
      return;
    }

    const memory: Memory = {
      id: Date.now(),
      title: newMemory.title,
      content: newMemory.content,
      type: newMemory.type,
      source: "Manually added",
      createdAt: "Today",
      lastUsed: "Never",
      importance: newMemory.importance,
      tags: newMemory.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setMemories((previous) => [
      memory,
      ...previous,
    ]);

    setNewMemory({
      title: "",
      content: "",
      type: "Preference",
      importance: "Medium",
      tags: "",
    });

    setShowCreateModal(false);
  };

  /* ==========================================================
     DELETE MEMORY
  ========================================================== */

  const handleDeleteMemory = () => {
    if (!selectedMemory) return;

    const confirmed = window.confirm(
      `Delete "${selectedMemory.title}" from memory?`
    );

    if (!confirmed) return;

    setMemories((previous) =>
      previous.filter(
        (memory) =>
          memory.id !== selectedMemory.id
      )
    );

    setSelectedMemory(null);
    setShowDetails(false);
  };

  /* ==========================================================
     OPEN DETAILS
  ========================================================== */

  const openMemory = (memory: Memory) => {
    setSelectedMemory(memory);
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

            <div className="rounded-xl bg-purple-600 p-3 text-white shadow-sm">
              <Brain size={24} />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Memory
              </h1>

              <p className="text-sm text-slate-500">
                Manage the information your AI assistant remembers.
              </p>

            </div>

          </div>

          {/* SEARCH + ADD */}

          <div className="flex items-center gap-2">

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search memory..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                className="w-64 rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            <button
              onClick={() =>
                setShowCreateModal(true)
              }
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
            >
              <Plus size={17} />
              Add Memory
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
              Personalized AI Context
            </p>

            <p className="mt-1 text-xs leading-5 text-purple-700">
              Your assistant can use relevant memories to provide
              more personalized responses and automate tasks.
            </p>

          </div>

        </div>

        {/* ====================================================
            SUMMARY CARDS
        ==================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Total Memories
              </span>

              <Brain
                size={19}
                className="text-purple-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {totalMemories}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Stored context items
            </p>

          </div>

          {/* PREFERENCES */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Preferences
              </span>

              <Heart
                size={19}
                className="text-pink-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {preferenceCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Saved user preferences
            </p>

          </div>

          {/* EPISODIC */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Past Events
              </span>

              <History
                size={19}
                className="text-purple-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {episodicCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Important past experiences
            </p>

          </div>

          {/* STRUCTURED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Structured
              </span>

              <Database
                size={19}
                className="text-green-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {structuredCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Projects, tasks and context
            </p>

          </div>

        </div>

        {/* ====================================================
            MEMORY TYPE FILTERS
        ==================================================== */}

        <div className="mb-5">

          <div className="flex flex-wrap gap-2">

            {(
              [
                "All",
                "Preference",
                "Episodic",
                "Entity",
                "Structured",
                "Semantic",
                "Working",
              ] as const
            ).map((type) => (

              <button
                key={type}
                onClick={() =>
                  setActiveType(type)
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeType === type
                    ? "bg-purple-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>

            ))}

          </div>

        </div>

        {/* ====================================================
            MEMORY LIST
        ==================================================== */}

        {filteredMemories.length > 0 ? (

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* LIST HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h2 className="font-semibold text-slate-900">
                  Stored Memories
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {filteredMemories.length} memory
                  {filteredMemories.length !== 1
                    ? " items"
                    : " item"}
                </p>

              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">

                <CheckCircle2
                  size={14}
                  className="text-green-500"
                />

                Memory system active

              </div>

            </div>

            {/* MEMORY ITEMS */}

            <div className="divide-y divide-slate-100">

              {filteredMemories.map(
                (memory) => {

                  const config =
                    memoryTypeConfig[
                      memory.type
                    ];

                  const Icon = config.icon;

                  return (

                    <div
                      key={memory.id}
                      className="group flex items-start gap-4 px-5 py-5 transition hover:bg-slate-50"
                    >

                      {/* ICON */}

                      <div
                        className={`mt-0.5 shrink-0 rounded-xl p-2.5 ${config.bgClass} ${config.iconClass}`}
                      >
                        <Icon size={19} />
                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="mb-1 flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold text-slate-800">
                            {memory.title}
                          </h3>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${config.bgClass} ${config.iconClass}`}
                          >
                            {memory.type}
                          </span>

                          {memory.importance ===
                            "High" && (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-500">
                              Important
                            </span>
                          )}

                        </div>

                        <p className="max-w-4xl text-sm leading-5 text-slate-500">
                          {memory.content}
                        </p>

                        {/* TAGS */}

                        <div className="mt-3 flex flex-wrap items-center gap-2">

                          {memory.tags.map(
                            (tag) => (
                              <span
                                key={tag}
                                className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500"
                              >
                                <Tag size={10} />
                                {tag}
                              </span>
                            )
                          )}

                        </div>

                        {/* META */}

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">

                          <span>
                            Source:{" "}
                            {memory.source}
                          </span>

                          <span>
                            Added:{" "}
                            {memory.createdAt}
                          </span>

                          <span>
                            Last used:{" "}
                            {memory.lastUsed}
                          </span>

                        </div>

                      </div>

                      {/* ACTION */}

                      <button
                        onClick={() =>
                          openMemory(memory)
                        }
                        className="shrink-0 rounded-lg p-2 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <MoreHorizontal size={18} />
                      </button>

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
              <Brain size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
              No memories found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Try another search or memory type.
            </p>

            <button
              onClick={() => {
                setSearchQuery("");
                setActiveType("All");
              }}
              className="mt-4 text-sm font-medium text-purple-600 hover:underline"
            >
              Clear filters
            </button>

          </div>

        )}

      </div>

      {/* ========================================================
          ADD MEMORY MODAL
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
                  Add Memory
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Store useful context for future interactions.
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
                  Memory Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Preferred meeting time"
                  value={newMemory.title}
                  onChange={(event) =>
                    setNewMemory({
                      ...newMemory,
                      title:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />

              </div>

              {/* CONTENT */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Memory
                </label>

                <textarea
                  rows={4}
                  placeholder="What should the AI remember?"
                  value={newMemory.content}
                  onChange={(event) =>
                    setNewMemory({
                      ...newMemory,
                      content:
                        event.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />

              </div>

              {/* TYPE + IMPORTANCE */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Memory Type
                  </label>

                  <select
                    value={newMemory.type}
                    onChange={(event) =>
                      setNewMemory({
                        ...newMemory,
                        type: event.target
                          .value as MemoryType,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400"
                  >

                    <option value="Preference">
                      Preference
                    </option>

                    <option value="Episodic">
                      Episodic
                    </option>

                    <option value="Entity">
                      Entity
                    </option>

                    <option value="Structured">
                      Structured
                    </option>

                    <option value="Semantic">
                      Semantic
                    </option>

                    <option value="Working">
                      Working
                    </option>

                  </select>

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Importance
                  </label>

                  <select
                    value={
                      newMemory.importance
                    }
                    onChange={(event) =>
                      setNewMemory({
                        ...newMemory,
                        importance:
                          event.target.value as
                            | "High"
                            | "Medium"
                            | "Low",
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400"
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

              </div>

              {/* TAGS */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Tags
                </label>

                <input
                  type="text"
                  placeholder="e.g. work, email, schedule"
                  value={newMemory.tags}
                  onChange={(event) =>
                    setNewMemory({
                      ...newMemory,
                      tags:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />

                <p className="mt-1 text-[11px] text-slate-400">
                  Separate multiple tags with commas.
                </p>

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
                onClick={handleCreateMemory}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
              >
                <Plus size={16} />
                Save Memory
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ========================================================
          MEMORY DETAILS MODAL
      ========================================================= */}

      {showDetails && selectedMemory && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() =>
            setShowDetails(false)
          }
        >

          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

              <div className="flex items-start gap-3">

                <div
                  className={`rounded-xl p-3 ${
                    memoryTypeConfig[
                      selectedMemory.type
                    ].bgClass
                  } ${
                    memoryTypeConfig[
                      selectedMemory.type
                    ].iconClass
                  }`}
                >

                  {(() => {
                    const Icon =
                      memoryTypeConfig[
                        selectedMemory.type
                      ].icon;

                    return <Icon size={22} />;
                  })()}

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedMemory.title}
                  </h2>

                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                      memoryTypeConfig[
                        selectedMemory.type
                      ].bgClass
                    } ${
                      memoryTypeConfig[
                        selectedMemory.type
                      ].iconClass
                    }`}
                  >
                    {selectedMemory.type}
                  </span>

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

            <div className="p-6">

              {/* MEMORY CONTENT */}

              <div className="mb-6">

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Memory Content
                </p>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-sm leading-6 text-slate-700">
                    {selectedMemory.content}
                  </p>

                </div>

              </div>

              {/* DETAILS */}

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-400">
                    Source
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {selectedMemory.source}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-400">
                    Importance
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${
                      selectedMemory.importance ===
                      "High"
                        ? "text-red-500"
                        : selectedMemory.importance ===
                          "Medium"
                        ? "text-orange-500"
                        : "text-slate-600"
                    }`}
                  >
                    {selectedMemory.importance}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <div className="flex items-center gap-2">

                    <CalendarDays
                      size={15}
                      className="text-slate-400"
                    />

                    <p className="text-xs text-slate-400">
                      Created
                    </p>

                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {selectedMemory.createdAt}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <div className="flex items-center gap-2">

                    <Clock3
                      size={15}
                      className="text-slate-400"
                    />

                    <p className="text-xs text-slate-400">
                      Last Used
                    </p>

                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {selectedMemory.lastUsed}
                  </p>

                </div>

              </div>

              {/* TAGS */}

              <div className="mt-5">

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Tags
                </p>

                <div className="flex flex-wrap gap-2">

                  {selectedMemory.tags.map(
                    (tag) => (

                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600"
                      >
                        <Tag size={11} />
                        {tag}
                      </span>

                    )
                  )}

                </div>

              </div>

              {/* RETRIEVAL INFO */}

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                <Sparkles
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>

                  <p className="text-xs font-semibold text-blue-800">
                    AI Retrieval
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    This memory can be retrieved when it is
                    relevant to the assistant's current context.
                  </p>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                onClick={handleDeleteMemory}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete Memory
              </button>

              <button
                onClick={() =>
                  setShowDetails(false)
                }
                className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
              >
                Done
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}