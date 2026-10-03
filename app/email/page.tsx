"use client";

import { useMemo, useState } from "react";
import {
  Mail,
  Search,
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  Reply,
  Forward,
  Paperclip,
  CalendarDays,
  ListTodo,
  Sparkles,
  X,
  Send,
  RefreshCw,
  Inbox,
  MailOpen,
  AlertCircle,
} from "lucide-react";

type EmailCategory =
  | "important"
  | "work"
  | "personal"
  | "updates"
  | "promotions";

type Email = {
  id: number;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  date: string;
  unread: boolean;
  starred: boolean;
  category: EmailCategory;
  hasAttachment?: boolean;
  attachmentName?: string;
  aiSummary?: string;
  actionRequired?: boolean;
  extractedTask?: string;
};

const initialEmails: Email[] = [
  {
    id: 1,
    sender: "Project Mentor",
    senderEmail: "mentor@example.com",
    subject: "Project Review Meeting - Tomorrow",
    preview:
      "Hi, let's review the progress of the productivity agent tomorrow...",
    body: `Hi Yukti,

Let's review the progress of the Productivity AI project tomorrow.

Please make sure the Tasks and Calendar modules are ready for demonstration.

We will also discuss the next phase of backend integration.

Regards,
Project Mentor`,
    time: "10:32 AM",
    date: "Oct 5, 2026",
    unread: true,
    starred: true,
    category: "important",
    aiSummary:
      "Your mentor wants to review the Productivity AI project tomorrow and expects the Tasks and Calendar modules to be ready.",
    actionRequired: true,
    extractedTask:
      "Prepare Tasks and Calendar modules for project review",
  },
  {
    id: 2,
    sender: "GitHub",
    senderEmail: "notifications@github.com",
    subject: "Pull request review requested",
    preview:
      "You have been requested to review a pull request in your repository...",
    body: `A pull request review has been requested from you.

Repository:
productivity-ai-agent

Please review the changes and submit your feedback.

Regards,
GitHub`,
    time: "9:48 AM",
    date: "Oct 5, 2026",
    unread: true,
    starred: false,
    category: "work",
    aiSummary:
      "GitHub is requesting you to review a pull request in the Productivity AI repository.",
    actionRequired: true,
    extractedTask:
      "Review the pending GitHub pull request",
  },
  {
    id: 3,
    sender: "Google Calendar",
    senderEmail: "calendar@google.com",
    subject: "Reminder: Team Standup at 11:00 AM",
    preview:
      "Your event Team Standup starts in 30 minutes...",
    body: `Reminder:

Team Standup
Today at 11:00 AM

You have 30 minutes before the meeting begins.

Please be ready before the meeting starts.`,
    time: "9:12 AM",
    date: "Oct 5, 2026",
    unread: true,
    starred: false,
    category: "updates",
    aiSummary:
      "Reminder for your Team Standup scheduled at 11:00 AM today.",
    actionRequired: false,
  },
  {
    id: 4,
    sender: "LinkedIn",
    senderEmail: "jobs@linkedin.com",
    subject: "5 new job recommendations for you",
    preview:
      "Based on your profile, here are some new opportunities...",
    body: `Here are five new job recommendations based on your profile and recent activity.

Explore opportunities that match your skills and interests.

You can view these recommendations from your LinkedIn account.`,
    time: "Yesterday",
    date: "Oct 4, 2026",
    unread: false,
    starred: false,
    category: "promotions",
    aiSummary:
      "LinkedIn has sent five job recommendations based on your profile.",
    actionRequired: false,
  },
  {
    id: 5,
    sender: "Team Lead",
    senderEmail: "team@example.com",
    subject: "Updated project requirements",
    preview:
      "I have attached the updated requirements document for the project...",
    body: `Hi Team,

I have attached the updated project requirements document.

Please review the changes before our next discussion.

The updated requirements include changes to the productivity workflow, task management, and integration modules.

Thanks,
Team Lead`,
    time: "Yesterday",
    date: "Oct 4, 2026",
    unread: false,
    starred: true,
    category: "work",
    hasAttachment: true,
    attachmentName: "Updated_Project_Requirements.pdf",
    aiSummary:
      "The updated project requirements document is attached and should be reviewed before the next discussion.",
    actionRequired: true,
    extractedTask:
      "Review updated project requirements",
  },
  {
    id: 6,
    sender: "Amazon",
    senderEmail: "orders@amazon.in",
    subject: "Your order has been shipped",
    preview:
      "Your order is on its way and will arrive soon...",
    body: `Your order has been shipped.

Expected delivery:
October 7, 2026

Track your package from your Amazon account.

Thank you for shopping with us.`,
    time: "Oct 3",
    date: "Oct 3, 2026",
    unread: false,
    starred: false,
    category: "updates",
    aiSummary:
      "Your order has been shipped and is expected to arrive on October 7.",
    actionRequired: false,
  },
  {
    id: 7,
    sender: "College Administration",
    senderEmail: "admin@college.edu",
    subject: "Important: Academic Schedule Update",
    preview:
      "Please note the changes to the academic schedule...",
    body: `Dear Students,

Please note that there have been changes to the academic schedule.

The updated schedule is attached for your reference.

Please review the updated schedule carefully and make note of any changes to your classes.

Regards,
College Administration`,
    time: "Oct 2",
    date: "Oct 2, 2026",
    unread: true,
    starred: true,
    category: "important",
    hasAttachment: true,
    attachmentName: "Academic_Schedule.pdf",
    aiSummary:
      "College administration has sent an updated academic schedule that requires review.",
    actionRequired: true,
    extractedTask:
      "Review updated academic schedule",
  },
];

const categoryLabels: Record<EmailCategory, string> = {
  important: "Important",
  work: "Work",
  personal: "Personal",
  updates: "Updates",
  promotions: "Promotions",
};

const categoryStyles: Record<EmailCategory, string> = {
  important: "bg-red-50 text-red-600 border-red-100",
  work: "bg-blue-50 text-blue-600 border-blue-100",
  personal: "bg-purple-50 text-purple-600 border-purple-100",
  updates: "bg-green-50 text-green-600 border-green-100",
  promotions: "bg-orange-50 text-orange-600 border-orange-100",
};

export default function EmailPage() {
  const [emails, setEmails] = useState<Email[]>(initialEmails);

  const [selectedEmail, setSelectedEmail] =
    useState<Email | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [activeFolder, setActiveFolder] =
    useState<
      "inbox" | "starred" | "important" | "sent" | "trash"
    >("inbox");

  const [activeCategory, setActiveCategory] =
    useState<EmailCategory | "all">("all");

  const [showCompose, setShowCompose] = useState(false);

  const [showSummary, setShowSummary] = useState(false);

  const [showReplyBox, setShowReplyBox] = useState(false);

  const [replyText, setReplyText] = useState("");

  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const filteredEmails = useMemo(() => {
    let result = [...emails];

    if (activeFolder === "starred") {
      result = result.filter((email) => email.starred);
    }

    if (activeFolder === "important") {
      result = result.filter(
        (email) => email.category === "important"
      );
    }

    if (activeFolder === "trash") {
      result = [];
    }

    if (activeFolder === "sent") {
      result = [];
    }

    if (activeCategory !== "all") {
      result = result.filter(
        (email) => email.category === activeCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (email) =>
          email.sender.toLowerCase().includes(query) ||
          email.subject.toLowerCase().includes(query) ||
          email.preview.toLowerCase().includes(query)
      );
    }

    return result;
  }, [
    emails,
    activeFolder,
    activeCategory,
    searchQuery,
  ]);

  const unreadCount = emails.filter(
    (email) => email.unread
  ).length;

  const importantCount = emails.filter(
    (email) => email.category === "important"
  ).length;

  const starredCount = emails.filter(
    (email) => email.starred
  ).length;

  const actionRequiredCount = emails.filter(
    (email) => email.actionRequired
  ).length;

  const handleSelectEmail = (email: Email) => {
    const updatedEmail = {
      ...email,
      unread: false,
    };

    setSelectedEmail(updatedEmail);

    setEmails((previous) =>
      previous.map((item) =>
        item.id === email.id
          ? { ...item, unread: false }
          : item
      )
    );

    setShowSummary(false);
    setShowReplyBox(false);
  };

  const closeEmail = () => {
    setSelectedEmail(null);
    setShowSummary(false);
    setShowReplyBox(false);
    setReplyText("");
  };

  const toggleStar = (
    event: React.MouseEvent,
    emailId: number
  ) => {
    event.stopPropagation();

    setEmails((previous) =>
      previous.map((email) =>
        email.id === emailId
          ? {
              ...email,
              starred: !email.starred,
            }
          : email
      )
    );

    if (selectedEmail?.id === emailId) {
      setSelectedEmail((previous) =>
        previous
          ? {
              ...previous,
              starred: !previous.starred,
            }
          : null
      );
    }
  };

  const handleArchive = () => {
    if (!selectedEmail) return;

    setEmails((previous) =>
      previous.filter(
        (email) => email.id !== selectedEmail.id
      )
    );

    closeEmail();
  };

  const handleDelete = () => {
    if (!selectedEmail) return;

    setEmails((previous) =>
      previous.filter(
        (email) => email.id !== selectedEmail.id
      )
    );

    closeEmail();
  };

  const handleCreateTask = () => {
    if (!selectedEmail?.extractedTask) return;

    alert(
      `Task created:\n\n${selectedEmail.extractedTask}`
    );
  };

  const handleAddToCalendar = () => {
    alert(
      "Calendar event creation will be connected later."
    );
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    alert("Reply sent in demo mode.");

    setReplyText("");
    setShowReplyBox(false);
  };

  const handleSendEmail = () => {
    if (!composeData.to.trim()) {
      alert("Please enter a recipient.");
      return;
    }

    alert("Email sent in demo mode.");

    setComposeData({
      to: "",
      subject: "",
      body: "",
    });

    setShowCompose(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px]">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-600 p-3 text-white shadow-sm">
              <Mail size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Email
              </h1>

              <p className="text-sm text-slate-500">
                Manage your inbox and turn important messages into actions.
              </p>
            </div>

          </div>

          {/* SEARCH + REFRESH + COMPOSE */}

          <div className="flex items-center gap-2">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-60 rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* REFRESH */}

            <button
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
              title="Refresh"
              onClick={() =>
                alert("Inbox refreshed in demo mode.")
              }
            >
              <RefreshCw size={18} />
            </button>

            {/* COMPOSE */}

            <button
              onClick={() => setShowCompose(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              <Mail size={17} />
              Compose
            </button>

          </div>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* UNREAD */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Unread
              </span>

              <MailOpen
                size={19}
                className="text-blue-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {unreadCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Emails needing attention
            </p>

          </div>

          {/* IMPORTANT */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Important
              </span>

              <AlertCircle
                size={19}
                className="text-red-500"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {importantCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Important messages
            </p>

          </div>

          {/* STARRED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Starred
              </span>

              <Star
                size={19}
                className="text-yellow-500"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {starredCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Saved for later
            </p>

          </div>

          {/* ACTION REQUIRED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Action Required
              </span>

              <ListTodo
                size={19}
                className="text-purple-600"
              />

            </div>

            <p className="text-2xl font-bold text-slate-900">
              {actionRequiredCount}
            </p>

            <p className="mt-1 text-xs text-purple-600">
              AI extracted actionable items
            </p>

          </div>

        </div>

        {/* =====================================================
            EMAIL WORKSPACE
        ====================================================== */}

        <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:grid-cols-[210px_1fr]">

          {/* =================================================
              LEFT SIDEBAR
          ================================================== */}

          <div className="border-b border-slate-200 bg-slate-50/70 p-4 xl:border-b-0 xl:border-r">

            {/* INBOX */}

            <button
              onClick={() => setActiveFolder("inbox")}
              className={`mb-2 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium ${
                activeFolder === "inbox"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-white"
              }`}
            >

              <span className="flex items-center gap-3">
                <Inbox size={17} />
                Inbox
              </span>

              <span className="text-xs font-semibold">
                {unreadCount}
              </span>

            </button>

            {/* STARRED */}

            <button
              onClick={() => setActiveFolder("starred")}
              className={`mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                activeFolder === "starred"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              <Star size={17} />
              Starred
            </button>

            {/* IMPORTANT */}

            <button
              onClick={() => setActiveFolder("important")}
              className={`mb-2 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium ${
                activeFolder === "important"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-white"
              }`}
            >

              <span className="flex items-center gap-3">
                <AlertCircle size={17} />
                Important
              </span>

              <span className="text-xs font-semibold">
                {importantCount}
              </span>

            </button>

            {/* SENT */}

            <button
              onClick={() => setActiveFolder("sent")}
              className={`mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                activeFolder === "sent"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              <Send size={17} />
              Sent
            </button>

            {/* TRASH */}

            <button
              onClick={() => setActiveFolder("trash")}
              className={`mb-5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                activeFolder === "trash"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              <Trash2 size={17} />
              Trash
            </button>

            <div className="border-t border-slate-200 pt-5">

              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Categories
              </p>

              <button
                onClick={() => setActiveCategory("all")}
                className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeCategory === "all"
                    ? "bg-white font-medium text-slate-800"
                    : "text-slate-500 hover:bg-white"
                }`}
              >
                All Mail
              </button>

              {(
                Object.keys(categoryLabels) as EmailCategory[]
              ).map((category) => (

                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                    activeCategory === category
                      ? "bg-white font-medium text-slate-800"
                      : "text-slate-500 hover:bg-white"
                  }`}
                >

                  <span
                    className={`h-2 w-2 rounded-full ${
                      category === "important"
                        ? "bg-red-500"
                        : category === "work"
                        ? "bg-blue-500"
                        : category === "personal"
                        ? "bg-purple-500"
                        : category === "updates"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                  />

                  {categoryLabels[category]}

                </button>

              ))}

            </div>
          </div>

          {/* =================================================
              EMAIL LIST
          ================================================== */}

          <div className="min-w-0">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h2 className="font-semibold text-slate-900">
                  {activeFolder === "inbox"
                    ? "Inbox"
                    : activeFolder.charAt(0).toUpperCase() +
                      activeFolder.slice(1)}
                </h2>

                <p className="text-xs text-slate-400">
                  {filteredEmails.length} messages
                </p>

              </div>

              <button
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                title="More options"
              >
                <MoreHorizontal size={18} />
              </button>

            </div>

            {/* CATEGORY FILTER */}

            <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 py-2">

              {[
                "all",
                "important",
                "work",
                "updates",
              ].map((category) => (

                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(
                      category as EmailCategory | "all"
                    )
                  }
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${
                    activeCategory === category
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>

              ))}

            </div>

            {/* EMAIL ROWS */}

            <div>

              {filteredEmails.map((email) => (

                <button
                  key={email.id}
                  onClick={() =>
                    handleSelectEmail(email)
                  }
                  className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-blue-50/40 ${
                    email.unread
                      ? "bg-white"
                      : "bg-slate-50/40"
                  }`}
                >

                  <div className="flex gap-3">

                    {/* AVATAR */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
                      {email.sender
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <p
                          className={`truncate text-sm ${
                            email.unread
                              ? "font-bold text-slate-900"
                              : "font-medium text-slate-700"
                          }`}
                        >
                          {email.sender}
                        </p>

                        <span className="shrink-0 text-[11px] text-slate-400">
                          {email.time}
                        </span>

                      </div>

                      <p
                        className={`mt-1 truncate text-sm ${
                          email.unread
                            ? "font-semibold text-slate-800"
                            : "text-slate-600"
                        }`}
                      >
                        {email.subject}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                        {email.preview}
                      </p>

                      <div className="mt-2 flex items-center gap-2">

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${categoryStyles[email.category]}`}
                        >
                          {categoryLabels[email.category]}
                        </span>

                        {email.actionRequired && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-purple-600">
                            <ListTodo size={11} />
                            Action
                          </span>
                        )}

                        {email.hasAttachment && (
                          <Paperclip
                            size={13}
                            className="text-slate-400"
                          />
                        )}

                      </div>

                    </div>

                    {/* STAR */}

                    <span
                      onClick={(event) =>
                        toggleStar(event, email.id)
                      }
                      className="shrink-0"
                    >
                      <Star
                        size={17}
                        className={
                          email.starred
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }
                      />
                    </span>

                  </div>

                </button>

              ))}

              {filteredEmails.length === 0 && (

                <div className="flex flex-col items-center justify-center px-6 py-24 text-center">

                  <MailOpen
                    size={42}
                    className="text-slate-300"
                  />

                  <p className="mt-4 font-medium text-slate-600">
                    No emails found
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Try changing your filters or search query.
                  </p>

                </div>

              )}

            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          EMAIL POPUP
      ====================================================== */}

      {selectedEmail && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={closeEmail}
        >

          <div
            className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* POPUP HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

              <div className="min-w-0 pr-6">

                <div className="mb-3 flex flex-wrap items-center gap-2">

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${categoryStyles[selectedEmail.category]}`}
                  >
                    {categoryLabels[selectedEmail.category]}
                  </span>

                  {selectedEmail.actionRequired && (

                    <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-600">

                      <ListTodo size={12} />

                      Action Required

                    </span>

                  )}

                </div>

                <h2 className="break-words text-2xl font-bold leading-8 text-slate-900">
                  {selectedEmail.subject}
                </h2>

              </div>

              <button
                onClick={closeEmail}
                className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={21} />
              </button>

            </div>

            {/* SENDER */}

            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                {selectedEmail.sender
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-semibold text-slate-800">
                  {selectedEmail.sender}
                </p>

                <p className="text-xs text-slate-400">
                  {selectedEmail.senderEmail}
                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-slate-500">
                  {selectedEmail.date}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedEmail.time}
                </p>

              </div>

            </div>

            {/* TOOLBAR */}

            <div className="flex items-center gap-1 border-b border-slate-200 px-6 py-3">

              <button
                onClick={() =>
                  setShowReplyBox(true)
                }
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                <Reply size={16} />
                Reply
              </button>

              <button
                onClick={() =>
                  alert(
                    "Forward functionality will be connected later."
                  )
                }
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                <Forward size={16} />
                Forward
              </button>

              <button
                onClick={handleArchive}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                title="Archive"
              >
                <Archive size={17} />
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-500"
                title="Delete"
              >
                <Trash2 size={17} />
              </button>

              <button
                className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                title="More"
              >
                <MoreHorizontal size={17} />
              </button>

            </div>

            {/* EMAIL CONTENT */}

            <div className="px-8 py-7">

              <div className="whitespace-pre-line text-[15px] leading-7 text-slate-700">
                {selectedEmail.body}
              </div>

              {/* ATTACHMENT */}

              {selectedEmail.hasAttachment && (

                <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">
                      <Paperclip size={18} />
                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-medium text-slate-700">
                        {selectedEmail.attachmentName}
                      </p>

                      <p className="text-xs text-slate-400">
                        Attachment
                      </p>

                    </div>

                    <button
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      onClick={() =>
                        alert(
                          "Attachment preview will be connected later."
                        )
                      }
                    >
                      View
                    </button>

                  </div>

                </div>

              )}

              {/* AI SUMMARY */}

              {selectedEmail.aiSummary && (

                <div className="mt-7 rounded-xl border border-purple-200 bg-purple-50/60 p-4">

                  <div className="flex items-start gap-3">

                    <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                      <Sparkles size={17} />
                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-semibold text-purple-800">
                        AI Summary
                      </p>

                      {showSummary ? (

                        <p className="mt-2 text-sm leading-6 text-purple-700">
                          {selectedEmail.aiSummary}
                        </p>

                      ) : (

                        <p className="mt-1 text-xs text-purple-500">
                          AI has generated a summary for this email.
                        </p>

                      )}

                      <button
                        onClick={() =>
                          setShowSummary(!showSummary)
                        }
                        className="mt-2 text-xs font-medium text-purple-700 hover:underline"
                      >
                        {showSummary
                          ? "Hide summary"
                          : "Show summary"}
                      </button>

                    </div>

                  </div>

                </div>

              )}

              {/* EXTRACTED ACTION */}

              {selectedEmail.extractedTask && (

                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/60 p-4">

                  <div className="flex items-start gap-3">

                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                      <ListTodo size={17} />
                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-semibold text-blue-800">
                        Action detected
                      </p>

                      <p className="mt-1 text-sm text-blue-700">
                        {selectedEmail.extractedTask}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        <button
                          onClick={handleCreateTask}
                          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          <ListTodo size={14} />
                          Create Task
                        </button>

                        <button
                          onClick={handleAddToCalendar}
                          className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50"
                        >
                          <CalendarDays size={14} />
                          Add to Calendar
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              )}

              {/* REPLY BOX */}

              {showReplyBox && (

                <div className="mt-6 rounded-xl border border-slate-200 bg-white">

                  <div className="border-b border-slate-100 px-4 py-3">

                    <p className="text-sm font-medium text-slate-700">
                      Reply to {selectedEmail.sender}
                    </p>

                  </div>

                  <textarea
                    value={replyText}
                    onChange={(e) =>
                      setReplyText(e.target.value)
                    }
                    placeholder="Write your reply..."
                    rows={5}
                    className="w-full resize-none border-0 px-4 py-3 text-sm outline-none"
                  />

                  <div className="flex justify-end gap-2 border-t border-slate-100 p-3">

                    <button
                      onClick={() =>
                        setShowReplyBox(false)
                      }
                      className="rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSendReply}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      <Send size={14} />
                      Send Reply
                    </button>

                  </div>

                </div>

              )}

            </div>

            {/* POPUP FOOTER */}

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">

              <p className="text-xs text-slate-400">
                Email opened from Inbox
              </p>

              <button
                onClick={closeEmail}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          COMPOSE MODAL
      ====================================================== */}

      {showCompose && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setShowCompose(false)}
        >

          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* COMPOSE HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h2 className="font-semibold text-slate-900">
                  New Message
                </h2>

                <p className="text-xs text-slate-400">
                  Compose an email
                </p>

              </div>

              <button
                onClick={() =>
                  setShowCompose(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={19} />
              </button>

            </div>

            {/* RECIPIENT */}

            <input
              type="text"
              placeholder="To"
              value={composeData.to}
              onChange={(e) =>
                setComposeData({
                  ...composeData,
                  to: e.target.value,
                })
              }
              className="w-full border-b border-slate-100 px-5 py-3 text-sm outline-none focus:bg-slate-50"
            />

            {/* SUBJECT */}

            <input
              type="text"
              placeholder="Subject"
              value={composeData.subject}
              onChange={(e) =>
                setComposeData({
                  ...composeData,
                  subject: e.target.value,
                })
              }
              className="w-full border-b border-slate-100 px-5 py-3 text-sm outline-none focus:bg-slate-50"
            />

            {/* BODY */}

            <textarea
              rows={12}
              placeholder="Write your message..."
              value={composeData.body}
              onChange={(e) =>
                setComposeData({
                  ...composeData,
                  body: e.target.value,
                })
              }
              className="w-full resize-none px-5 py-4 text-sm outline-none"
            />

            {/* COMPOSE FOOTER */}

            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

              <div className="flex items-center gap-1">

                <button
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                  title="Attach file"
                  onClick={() =>
                    alert(
                      "File attachment will be connected later."
                    )
                  }
                >
                  <Paperclip size={18} />
                </button>

                <button
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                  title="More options"
                >
                  <MoreHorizontal size={18} />
                </button>

              </div>

              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Send size={16} />
                Send
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}