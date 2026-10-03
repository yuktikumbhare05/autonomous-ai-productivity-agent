"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Users,
  Plus,
  Search,
  X,
  Video,
  CalendarCheck,
  ListTodo,
  AlertTriangle,
} from "lucide-react";

type EventType = "meeting" | "focus" | "task" | "personal";

type CalendarEvent = {
  id: number;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: EventType;
  location?: string;
  attendees?: string[];
  project?: string;
  meetingLink?: string;
};

const initialEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Team Standup",
    description: "Daily project progress and blockers.",
    date: "2026-10-05",
    startTime: "09:00",
    endTime: "09:30",
    type: "meeting",
    attendees: ["You", "Aditi", "Rohit", "Karan"],
    meetingLink: "https://meet.google.com/",
  },
  {
    id: 2,
    title: "Deep Work — AI Agent",
    description: "Work on the productivity agent frontend.",
    date: "2026-10-05",
    startTime: "10:00",
    endTime: "12:00",
    type: "focus",
    project: "AI Productivity Agent",
  },
  {
    id: 3,
    title: "Lunch",
    date: "2026-10-05",
    startTime: "13:00",
    endTime: "14:00",
    type: "personal",
  },
  {
    id: 4,
    title: "Internship Meeting",
    description: "Discuss current internship tasks and progress.",
    date: "2026-10-06",
    startTime: "11:00",
    endTime: "12:00",
    type: "meeting",
    attendees: ["You", "Project Mentor"],
    meetingLink: "https://meet.google.com/",
  },
  {
    id: 5,
    title: "Build Calendar Page",
    description: "Implement calendar UI and interactions.",
    date: "2026-10-07",
    startTime: "10:00",
    endTime: "11:30",
    type: "task",
    project: "AI Productivity Agent",
  },
  {
    id: 6,
    title: "Project Review",
    description: "Review Tasks and Calendar modules.",
    date: "2026-10-08",
    startTime: "15:00",
    endTime: "16:00",
    type: "meeting",
    attendees: ["You", "Team"],
  },
  {
    id: 7,
    title: "Study Session",
    description: "Review upcoming academic topics.",
    date: "2026-10-09",
    startTime: "17:00",
    endTime: "19:00",
    type: "focus",
  },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const eventTypeStyles: Record<EventType, string> = {
  meeting: "bg-blue-100 text-blue-700 border-blue-200",
  focus: "bg-purple-100 text-purple-700 border-purple-200",
  task: "bg-indigo-100 text-indigo-700 border-indigo-200",
  personal: "bg-slate-100 text-slate-700 border-slate-200",
};

const eventTypeLabels: Record<EventType, string> = {
  meeting: "Meeting",
  focus: "Focus Time",
  task: "Task",
  personal: "Personal",
};

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;

  return `${hour}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatFullDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getMonthDays(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: Date[] = [];

  for (let i = firstDay.getDay() - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  let nextDay = 1;

  while (days.length < 42) {
    days.push(new Date(year, month + 1, nextDay));
    nextDay++;
  }

  return days;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 9, 5)
  );

  const [events, setEvents] =
    useState<CalendarEvent[]>(initialEvents);

  const [view, setView] =
    useState<"month" | "week" | "day">("month");

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEvent | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "2026-10-05",
    startTime: "10:00",
    endTime: "11:00",
    type: "meeting" as EventType,
    description: "",
    location: "",
  });

  const monthDays = useMemo(
    () => getMonthDays(currentDate),
    [currentDate]
  );

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMonthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const todayKey = "2026-10-05";

  const todayEvents = events
    .filter((event) => event.date === todayKey)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const upcomingEvents = [...events]
    .filter((event) => event.date >= todayKey)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);

      if (dateCompare !== 0) return dateCompare;

      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, 5);

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 5));
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;

    const event: CalendarEvent = {
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: newEvent.type,
      description: newEvent.description,
      location: newEvent.location,
    };

    setEvents((previous) => [...previous, event]);

    setShowAddModal(false);

    setNewEvent({
      title: "",
      date: "2026-10-05",
      startTime: "10:00",
      endTime: "11:00",
      type: "meeting",
      description: "",
      location: "",
    });
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;

    setEvents((previous) =>
      previous.filter((event) => event.id !== selectedEvent.id)
    );

    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-3 text-white shadow-sm">
                <CalendarDays size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Calendar
                </h1>

                <p className="text-sm text-slate-500">
                  Manage your schedule and let AI optimize your time.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* ADD EVENT */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Event
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TODAY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Today's Events
              </span>

              <CalendarCheck
                size={19}
                className="text-blue-600"
              />
            </div>

            <p className="text-2xl font-bold text-slate-900">
              {todayEvents.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Scheduled for today
            </p>
          </div>

          {/* MEETINGS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Meetings
              </span>

              <Users
                size={19}
                className="text-purple-600"
              />
            </div>

            <p className="text-2xl font-bold text-slate-900">
              {
                events.filter(
                  (event) => event.type === "meeting"
                ).length
              }
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Meetings scheduled
            </p>
          </div>

          {/* FOCUS TIME */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Focus Time
              </span>

              <Clock3
                size={19}
                className="text-indigo-600"
              />
            </div>

            <p className="text-2xl font-bold text-slate-900">
              4 hrs
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Planned deep work
            </p>
          </div>

          {/* CONFLICTS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Conflicts
              </span>

              <AlertTriangle
                size={19}
                className="text-orange-500"
              />
            </div>

            <p className="text-2xl font-bold text-slate-900">
              1
            </p>

            <p className="mt-1 text-xs text-orange-600">
              AI detected a scheduling conflict
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_330px]">

          {/* CALENDAR */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* CALENDAR TOOLBAR */}
            <div className="flex flex-col gap-4 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-2">

                <button
                  onClick={handleToday}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Today
                </button>

                <button
                  onClick={handlePreviousMonth}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={handleNextMonth}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                >
                  <ChevronRight size={18} />
                </button>

                <h2 className="ml-2 text-lg font-semibold text-slate-900">
                  {currentMonthName}
                </h2>
              </div>

              {/* VIEW SWITCHER */}
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">

                {(["month", "week", "day"] as const).map(
                  (option) => (
                    <button
                      key={option}
                      onClick={() => setView(option)}
                      className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition ${
                        view === option
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* MONTH VIEW */}
            {view === "month" && (
              <div className="overflow-x-auto">
                <div className="min-w-[850px]">

                  <div className="grid grid-cols-7 border-b border-slate-200">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="border-r border-slate-100 px-3 py-3 text-center text-xs font-semibold uppercase text-slate-400 last:border-r-0"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">

                    {monthDays.map((day) => {
                      const dateKey = getDateKey(day);

                      const dayEvents = filteredEvents.filter(
                        (event) => event.date === dateKey
                      );

                      const isCurrentMonth =
                        day.getMonth() === currentDate.getMonth();

                      const isToday = dateKey === todayKey;

                      return (
                        <div
                          key={dateKey}
                          className={`min-h-[135px] border-b border-r border-slate-100 p-2 ${
                            !isCurrentMonth
                              ? "bg-slate-50/70"
                              : "bg-white"
                          }`}
                        >
                          <div className="mb-2 flex justify-end">
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                                isToday
                                  ? "bg-blue-600 font-bold text-white"
                                  : isCurrentMonth
                                  ? "text-slate-700"
                                  : "text-slate-300"
                              }`}
                            >
                              {day.getDate()}
                            </span>
                          </div>

                          <div className="space-y-1">

                            {dayEvents.map((event) => (
                              <button
                                key={event.id}
                                onClick={() =>
                                  setSelectedEvent(event)
                                }
                                className={`w-full rounded-lg border px-2 py-1.5 text-left text-xs transition hover:shadow-sm ${eventTypeStyles[event.type]}`}
                              >
                                <div className="truncate font-semibold">
                                  {event.title}
                                </div>

                                <div className="mt-0.5 truncate opacity-75">
                                  {formatTime(event.startTime)}
                                </div>
                              </button>
                            ))}

                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>
              </div>
            )}

            {/* WEEK VIEW */}
            {view === "week" && (
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">

                  <div className="grid grid-cols-8 border-b border-slate-200">

                    <div className="p-3 text-xs font-semibold text-slate-400">
                      TIME
                    </div>

                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="border-l border-slate-100 p-3 text-center text-sm font-semibold text-slate-600"
                      >
                        {day}
                      </div>
                    ))}

                  </div>

                  <div className="grid grid-cols-8">

                    <div>
                      {timeSlots.map((time) => (
                        <div
                          key={time}
                          className="h-20 border-b border-slate-100 px-3 pt-2 text-xs text-slate-400"
                        >
                          {formatTime(time)}
                        </div>
                      ))}
                    </div>

                    {daysOfWeek.map((day, dayIndex) => (
                      <div
                        key={day}
                        className="relative border-l border-slate-100"
                      >
                        {timeSlots.map((time) => (
                          <div
                            key={time}
                            className="h-20 border-b border-slate-100"
                          />
                        ))}

                        {filteredEvents
                          .filter(
                            (_, index) =>
                              index % 7 === dayIndex
                          )
                          .map((event) => (
                            <button
                              key={event.id}
                              onClick={() =>
                                setSelectedEvent(event)
                              }
                              className={`absolute left-1 right-1 rounded-lg border p-2 text-left text-xs ${eventTypeStyles[event.type]}`}
                              style={{
                                top: `${Math.max(
                                  0,
                                  (parseInt(event.startTime) - 8) *
                                    80
                                )}px`,
                              }}
                            >
                              <div className="font-semibold">
                                {event.title}
                              </div>

                              <div className="mt-1 opacity-75">
                                {formatTime(event.startTime)}
                              </div>
                            </button>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DAY VIEW */}
            {view === "day" && (
              <div className="p-4">

                <div className="mb-5">
                  <p className="text-sm text-slate-500">
                    Selected day
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    {formatFullDate(todayKey)}
                  </h3>
                </div>

                <div className="space-y-1">

                  {timeSlots.map((time) => {

                    const event = filteredEvents.find(
                      (item) =>
                        item.date === todayKey &&
                        item.startTime === time
                    );

                    return (
                      <div
                        key={time}
                        className="flex min-h-[75px] border-t border-slate-100"
                      >
                        <div className="w-24 pt-3 text-xs text-slate-400">
                          {formatTime(time)}
                        </div>

                        <div className="flex-1 border-l border-slate-100 p-2">

                          {event && (
                            <button
                              onClick={() =>
                                setSelectedEvent(event)
                              }
                              className={`w-full rounded-xl border p-3 text-left ${eventTypeStyles[event.type]}`}
                            >
                              <p className="font-semibold">
                                {event.title}
                              </p>

                              <p className="mt-1 text-xs opacity-75">
                                {formatTime(event.startTime)} –{" "}
                                {formatTime(event.endTime)}
                              </p>
                            </button>
                          )}

                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* UPCOMING EVENTS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Upcoming
                  </h3>

                  <p className="text-xs text-slate-500">
                    Your next scheduled events
                  </p>
                </div>

                <CalendarDays
                  size={18}
                  className="text-slate-400"
                />

              </div>

              <div className="space-y-3">

                {upcomingEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full rounded-xl border border-slate-100 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
                  >
                    <div className="flex items-start gap-3">

                      <div
                        className={`mt-1 h-2.5 w-2.5 rounded-full ${
                          event.type === "meeting"
                            ? "bg-blue-500"
                            : event.type === "focus"
                            ? "bg-purple-500"
                            : event.type === "task"
                            ? "bg-indigo-500"
                            : "bg-slate-400"
                        }`}
                      />

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium text-slate-800">
                          {event.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatTime(event.startTime)} –{" "}
                          {formatTime(event.endTime)}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {event.date}
                        </p>

                      </div>
                    </div>
                  </button>
                ))}

                {upcomingEvents.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-400">
                    No upcoming events.
                  </p>
                )}

              </div>
            </div>

            {/* CALENDAR LEGEND */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                Calendar Legend
              </h3>

              <div className="space-y-3">

                {(Object.keys(eventTypeLabels) as EventType[]).map(
                  (type) => (
                    <div
                      key={type}
                      className="flex items-center gap-3"
                    >
                      <span
                        className={`h-3 w-3 rounded-full ${
                          type === "meeting"
                            ? "bg-blue-500"
                            : type === "focus"
                            ? "bg-purple-500"
                            : type === "task"
                            ? "bg-indigo-500"
                            : "bg-slate-400"
                        }`}
                      />

                      <span className="text-sm text-slate-600">
                        {eventTypeLabels[type]}
                      </span>
                    </div>
                  )
                )}

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-200 p-5">

              <div>

                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${eventTypeStyles[selectedEvent.type]}`}
                >
                  {eventTypeLabels[selectedEvent.type]}
                </span>

                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  {selectedEvent.title}
                </h2>

              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-4 p-5">

              {/* DATE/TIME */}
              <div className="flex gap-3">

                <Clock3
                  size={18}
                  className="mt-0.5 text-slate-400"
                />

                <div>

                  <p className="text-sm font-medium text-slate-800">
                    {formatFullDate(selectedEvent.date)}
                  </p>

                  <p className="text-sm text-slate-500">
                    {formatTime(selectedEvent.startTime)} –{" "}
                    {formatTime(selectedEvent.endTime)}
                  </p>

                </div>

              </div>

              {/* LOCATION */}
              {selectedEvent.location && (
                <div className="flex gap-3">

                  <MapPin
                    size={18}
                    className="mt-0.5 text-slate-400"
                  />

                  <p className="text-sm text-slate-600">
                    {selectedEvent.location}
                  </p>

                </div>
              )}

              {/* ATTENDEES */}
              {selectedEvent.attendees &&
                selectedEvent.attendees.length > 0 && (
                  <div className="flex gap-3">

                    <Users
                      size={18}
                      className="mt-0.5 text-slate-400"
                    />

                    <div>

                      <p className="text-sm font-medium text-slate-800">
                        Attendees
                      </p>

                      <p className="text-sm text-slate-500">
                        {selectedEvent.attendees.join(", ")}
                      </p>

                    </div>

                  </div>
                )}

              {/* DESCRIPTION */}
              {selectedEvent.description && (
                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Description
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedEvent.description}
                  </p>

                </div>
              )}

              {/* PROJECT */}
              {selectedEvent.project && (
                <div className="flex items-center gap-2 text-sm text-slate-500">

                  <ListTodo size={16} />

                  Project:

                  <span className="font-medium text-slate-700">
                    {selectedEvent.project}
                  </span>

                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2 pt-2">

                {selectedEvent.meetingLink && (
                  <button
                    onClick={() =>
                      window.open(
                        selectedEvent.meetingLink,
                        "_blank"
                      )
                    }
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Video size={16} />
                    Join Meeting
                  </button>
                )}

                <button
                  onClick={handleDeleteEvent}
                  className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Event
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new calendar event.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-4 p-5">

              {/* TITLE */}
              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Event title
                </label>

                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Project Meeting"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* DATE + TYPE */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Date
                  </label>

                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        date: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Event type
                  </label>

                  <select
                    value={newEvent.type}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        type: e.target.value as EventType,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="focus">Focus Time</option>
                    <option value="task">Task</option>
                    <option value="personal">Personal</option>
                  </select>

                </div>
              </div>

              {/* TIME */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Start time
                  </label>

                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    End time
                  </label>

                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* LOCATION */}
              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Location
                </label>

                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      location: e.target.value,
                    })
                  }
                  placeholder="Optional"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* DESCRIPTION */}
              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Add event details..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-2 pt-2">

                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddEvent}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Create Event
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}