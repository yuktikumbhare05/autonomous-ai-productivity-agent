export default function DashboardHome() {
  return (
    <main className="min-h-full bg-slate-100 p-6">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Good morning
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s what&apos;s happening with your work today.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Tasks</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">12</p>

          <p className="mt-2 text-xs text-slate-500">4 due today</p>
        </div>

        {/* Meetings */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Meetings</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">3</p>

          <p className="mt-2 text-xs text-slate-500">
            Next at 10:30 AM
          </p>
        </div>

        {/* Emails */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Emails</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">8</p>

          <p className="mt-2 text-xs text-slate-500">
            Need attention
          </p>
        </div>

        {/* Approvals */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending approvals</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">2</p>

          <p className="mt-2 text-xs text-slate-500">
            Awaiting your decision
          </p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Today's Schedule */}
        <section>
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Today&apos;s Schedule
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your meetings and planned activities for today.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Team Meeting */}
            <div className="flex items-center gap-5 border-b border-slate-100 p-5">
              <div className="w-20 shrink-0">
                <p className="text-sm font-medium text-slate-900">
                  10:30 AM
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  45 min
                </p>
              </div>

              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  Team Meeting
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Weekly team sync and progress updates
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                Meeting
              </span>
            </div>

            {/* Project Review */}
            <div className="flex items-center gap-5 border-b border-slate-100 p-5">
              <div className="w-20 shrink-0">
                <p className="text-sm font-medium text-slate-900">
                  1:00 PM
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  60 min
                </p>
              </div>

              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  Project Review
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Review current project progress and next steps
                </p>
              </div>

              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                Review
              </span>
            </div>

            {/* Focus Time */}
            <div className="flex items-center gap-5 p-5">
              <div className="w-20 shrink-0">
                <p className="text-sm font-medium text-slate-900">
                  3:00 PM
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  90 min
                </p>
              </div>

              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  Focus Time
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Protected time for high-priority work
                </p>
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                Focus
              </span>
            </div>
          </div>
        </section>

        {/* Priority Tasks */}
        <section>
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Priority Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tasks that need your attention today.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* High Priority */}
            <div className="flex items-center gap-4 border-b border-slate-100 p-5">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
              />

              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  Complete project proposal
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Prepare the final proposal document
                </p>
              </div>

              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                High
              </span>

              <span className="text-xs text-slate-500">
                Today
              </span>
            </div>

            {/* Medium Priority */}
            <div className="flex items-center gap-4 border-b border-slate-100 p-5">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
              />

              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  Review team updates
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Review updates before the afternoon meeting
                </p>
              </div>

              <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                Medium
              </span>

              <span className="text-xs text-slate-500">
                Today
              </span>
            </div>

            {/* Normal Priority */}
            <div className="flex items-center gap-4 p-5">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
              />

              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  Respond to important emails
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Respond to messages requiring your attention
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                Normal
              </span>

              <span className="text-xs text-slate-500">
                Today
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      <section className="mt-6">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recent actions and updates from your workspace.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Email received
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Project update and next steps
              </p>
            </div>

            <span className="text-xs text-slate-400">
              10 mins ago
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Task created
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Prepare presentation for client meeting
              </p>
            </div>

            <span className="text-xs text-slate-400">
              25 mins ago
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Calendar event added
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Team Sync
              </p>
            </div>

            <span className="text-xs text-slate-400">
              1 hour ago
            </span>
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Memory updated
              </p>

              <p className="mt-1 text-xs text-slate-500">
                User preference updated
              </p>
            </div>

            <span className="text-xs text-slate-400">
              2 hours ago
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
