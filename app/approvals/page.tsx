"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Info,
  Play,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
  XCircle,
  Zap,
} from "lucide-react";

type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";
type RiskLevel = "Low" | "Medium" | "High";

type Approval = {
  id: number;
  title: string;
  description: string;
  action: string;
  source: string;
  workflow: string;
  risk: RiskLevel;
  status: ApprovalStatus;
  requestedAt: string;
  expiresAt: string;
  details: string[];
};

const initialApprovals: Approval[] = [
  {
    id: 1,
    title: "Send email to Project Mentor",
    description:
      "The agent drafted a follow-up email regarding your project submission.",
    action: "Send email",
    source: "Gmail",
    workflow: "Email Triage",
    risk: "Medium",
    status: "pending",
    requestedAt: "10 minutes ago",
    expiresAt: "Expires in 45 minutes",
    details: [
      "Recipient: project.mentor@example.com",
      "Subject: Project Submission Follow-up",
      "Draft contains project status and submission details.",
      "No attachments included.",
    ],
  },
  {
    id: 2,
    title: "Schedule project review meeting",
    description:
      "The agent found a suitable time and wants to schedule a project review.",
    action: "Create calendar event",
    source: "Google Calendar",
    workflow: "Daily Planning",
    risk: "Medium",
    status: "pending",
    requestedAt: "25 minutes ago",
    expiresAt: "Expires in 2 hours",
    details: [
      "Meeting: Project Review",
      "Duration: 45 minutes",
      "Proposed time: Tomorrow at 11:00 AM",
      "Participants: 3 people",
    ],
  },
  {
    id: 3,
    title: "Create deadline task from email",
    description:
      "An important deadline was detected in an incoming email.",
    action: "Create task",
    source: "Gmail",
    workflow: "Assignment & Deadline Tracker",
    risk: "Low",
    status: "pending",
    requestedAt: "1 hour ago",
    expiresAt: "Expires in 5 hours",
    details: [
      "Task: Submit database documentation",
      "Detected deadline: October 8",
      "Suggested priority: High",
      "Estimated duration: 90 minutes",
    ],
  },
  {
    id: 4,
    title: "Send weekly productivity report",
    description:
      "The agent prepared your weekly productivity summary for delivery.",
    action: "Send report",
    source: "Telegram",
    workflow: "Weekly Review",
    risk: "Low",
    status: "approved",
    requestedAt: "Yesterday",
    expiresAt: "Completed",
    details: [
      "Report includes weekly task completion.",
      "Includes productivity trends.",
      "Includes upcoming deadlines.",
    ],
  },
  {
    id: 5,
    title: "Archive low-priority emails",
    description:
      "The agent identified several low-priority promotional emails.",
    action: "Archive emails",
    source: "Gmail",
    workflow: "Email Triage",
    risk: "Medium",
    status: "rejected",
    requestedAt: "Yesterday",
    expiresAt: "Rejected",
    details: [
      "12 emails were identified.",
      "Emails were classified as low priority.",
      "No emails were permanently deleted.",
    ],
  },
  {
    id: 6,
    title: "Create evening review reminder",
    description:
      "The agent attempted to create an evening productivity review reminder.",
    action: "Create reminder",
    source: "Google Calendar",
    workflow: "Evening Review",
    risk: "Low",
    status: "expired",
    requestedAt: "2 days ago",
    expiresAt: "Expired",
    details: [
      "Reminder: Complete evening productivity review",
      "Original reminder time: 8:30 PM",
      "Approval window expired before action was authorized.",
    ],
  },
];

export default function ApprovalPage() {
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
  const [activeTab, setActiveTab] = useState<"all" | ApprovalStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApproval, setSelectedApproval] =
    useState<Approval | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [emergencyStop, setEmergencyStop] = useState(false);

  const filteredApprovals = useMemo(() => {
    return approvals.filter((approval) => {
      const matchesTab =
        activeTab === "all" || approval.status === activeTab;

      const search = searchQuery.toLowerCase();

      const matchesSearch =
        approval.title.toLowerCase().includes(search) ||
        approval.description.toLowerCase().includes(search) ||
        approval.action.toLowerCase().includes(search) ||
        approval.source.toLowerCase().includes(search) ||
        approval.workflow.toLowerCase().includes(search);

      return matchesTab && matchesSearch;
    });
  }, [approvals, activeTab, searchQuery]);

  const pendingCount = approvals.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = approvals.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = approvals.filter(
    (item) => item.status === "rejected"
  ).length;

  const expiredCount = approvals.filter(
    (item) => item.status === "expired"
  ).length;

  const approveAction = (id: number) => {
    setApprovals((current) =>
      current.map((approval) =>
        approval.id === id
          ? {
              ...approval,
              status: "approved",
              expiresAt: "Approved just now",
            }
          : approval
      )
    );

    setSelectedApproval(null);
  };

  const rejectAction = () => {
    if (!selectedApproval) return;

    setApprovals((current) =>
      current.map((approval) =>
        approval.id === selectedApproval.id
          ? {
              ...approval,
              status: "rejected",
              expiresAt: rejectReason
                ? `Rejected: ${rejectReason}`
                : "Rejected",
            }
          : approval
      )
    );

    setRejectReason("");
    setShowRejectModal(false);
    setSelectedApproval(null);
  };

  const getStatusStyles = (status: ApprovalStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "expired":
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getRiskStyles = (risk: RiskLevel) => {
    switch (risk) {
      case "Low":
        return "bg-emerald-50 text-emerald-700";
      case "Medium":
        return "bg-amber-50 text-amber-700";
      case "High":
        return "bg-red-50 text-red-700";
    }
  };

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "approved":
        return <CheckCircle2 size={14} />;
      case "rejected":
        return <XCircle size={14} />;
      case "expired":
        return <AlertTriangle size={14} />;
    }
  };

  const formatStatus = (status: ApprovalStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-3 text-white shadow-lg">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Approvals
              </h1>
              <p className="text-sm text-slate-500">
                Review and authorize actions proposed by your AI agent
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search approvals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            onClick={() => setEmergencyStop((value) => !value)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              emergencyStop
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-red-200 bg-white text-red-600 hover:bg-red-50"
            }`}
          >
            <ShieldAlert size={17} />

            {emergencyStop ? "Agent Stopped" : "Emergency Stop"}
          </button>
        </div>
      </div>

      {/* Emergency Stop Banner */}
      {emergencyStop && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <ShieldAlert className="mt-0.5 text-red-600" size={20} />

          <div className="flex-1">
            <p className="font-semibold text-red-800">
              Autonomous actions are paused
            </p>

            <p className="mt-1 text-sm text-red-700">
              The agent will not execute new autonomous actions until you
              resume it.
            </p>
          </div>

          <button
            onClick={() => setEmergencyStop(false)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Resume Agent
          </button>
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
        <Info className="mt-0.5 text-indigo-600" size={20} />

        <div>
          <p className="font-semibold text-indigo-900">
            Human-in-the-Loop Protection
          </p>

          <p className="mt-1 text-sm text-indigo-700">
            The agent requests your approval before performing actions that
            require authorization. Review the action, understand its impact,
            and approve or reject it.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Approval</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {pendingCount}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Approved</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {approvedCount}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Rejected</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {rejectedCount}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <XCircle size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Expired</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {expiredCount}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
              <AlertTriangle size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
          { key: "expired", label: "Expired" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setActiveTab(tab.key as "all" | ApprovalStatus)
            }
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}

        <div className="ml-auto hidden items-center gap-2 text-sm text-slate-400 md:flex">
          <Filter size={15} />
          {filteredApprovals.length} approval
          {filteredApprovals.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Approval List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <ShieldCheck
              size={42}
              className="mx-auto mb-3 text-slate-300"
            />

            <h3 className="font-semibold text-slate-700">
              No approvals found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your filter or search query.
            </p>
          </div>
        ) : (
          filteredApprovals.map((approval) => (
            <div
              key={approval.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                {/* Main */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(
                        approval.status
                      )}`}
                    >
                      {getStatusIcon(approval.status)}
                      {formatStatus(approval.status)}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRiskStyles(
                        approval.risk
                      )}`}
                    >
                      {approval.risk} Risk
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900">
                    {approval.title}
                  </h3>

                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                    {approval.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span>
                      <strong className="text-slate-700">Action:</strong>{" "}
                      {approval.action}
                    </span>

                    <span>
                      <strong className="text-slate-700">Source:</strong>{" "}
                      {approval.source}
                    </span>

                    <span>
                      <strong className="text-slate-700">Workflow:</strong>{" "}
                      {approval.workflow}
                    </span>

                    <span>{approval.requestedAt}</span>
                  </div>
                </div>

                {/* Expiry + Actions */}
                <div className="flex shrink-0 flex-col gap-3 xl:w-64">
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-400">Authorization</p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {approval.expiresAt}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedApproval(approval)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Eye size={16} />
                      Details
                    </button>

                    {approval.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveAction(approval.id)}
                          disabled={emergencyStop}
                          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Check size={16} />
                          Approve
                        </button>

                        <button
                          onClick={() => {
                            setSelectedApproval(approval);
                            setShowRejectModal(true);
                          }}
                          className="flex items-center justify-center rounded-xl border border-red-200 px-3 py-2.5 text-red-600 hover:bg-red-50"
                          title="Reject"
                        >
                          <X size={17} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedApproval && !showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck className="text-indigo-600" size={21} />

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(
                      selectedApproval.status
                    )}`}
                  >
                    {formatStatus(selectedApproval.status)}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {selectedApproval.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedApproval.action}
                </p>
              </div>

              <button
                onClick={() => setSelectedApproval(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Agent Explanation
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedApproval.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-400">Risk</p>
                  <p
                    className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getRiskStyles(
                      selectedApproval.risk
                    )}`}
                  >
                    {selectedApproval.risk}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Source</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedApproval.source}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Workflow</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedApproval.workflow}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Requested</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedApproval.requestedAt}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Action Details
                </p>

                <div className="space-y-2">
                  {selectedApproval.details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-indigo-500"
                      />

                      <p className="text-sm text-slate-600">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApproval.status === "pending" && (
                <div className="flex gap-3 border-t border-slate-200 pt-5">
                  <button
                    onClick={() => approveAction(selectedApproval.id)}
                    disabled={emergencyStop}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Check size={17} />
                    Approve Action
                  </button>

                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <X size={17} />
                    Reject Action
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {selectedApproval && showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <XCircle size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Reject Action
                  </h2>

                  <p className="text-sm text-slate-500">
                    Tell the agent why this action should not be performed.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  {selectedApproval.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedApproval.action}
                </p>
              </div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Reason
              </label>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. I want to review the email before sending..."
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                  }}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={rejectAction}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Reject Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Security Status */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
          <Shield size={19} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            Approval protection is active
          </p>

          <p className="text-xs text-slate-500">
            Sensitive autonomous actions require authorization before
            execution.
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs font-medium text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Protected
        </div>
      </div>
    </div>
  );
}