import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  SunMoon,
} from "lucide-react";

import type { ReactNode } from "react";
import { useTheme } from "@/src/layout/ThemeContext";

type AuthLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

const previewItems = [
  { time: "09:00", title: "Plan the day", detail: "3 priorities" },
  { time: "11:30", title: "Product sync", detail: "Design team" },
  { time: "14:00", title: "Focus block", detail: "Protected time" },
];

export default function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  const { toggleTheme } = useTheme();

  return (
    <main className="grid h-dvh min-h-[600px] overflow-y-auto bg-white md:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
      <aside className="relative hidden min-h-[600px] overflow-hidden bg-slate-950 px-12 py-10 text-white md:flex md:flex-col lg:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <Link
          href="/"
          className="relative flex w-fit items-center gap-3 rounded-sm"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
            <Sparkles size={20} />
          </span>
          <span className="text-base font-semibold">Productivity AI</span>
        </Link>

        <div className="relative my-auto max-w-xl py-14">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
            <span className="h-px w-7 bg-emerald-300" />
            A calmer way to work
          </p>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.08] tracking-normal text-white lg:text-6xl">
            Make space for your best work.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            Your day, priorities, and helpful automations in one clear place.
          </p>

          <div className="mt-12 max-w-md border-y border-white/15">
            {previewItems.map((item, index) => (
              <div
                key={item.time}
                className={`grid grid-cols-[56px_1fr_auto] items-center gap-3 py-4 ${
                  index > 0 ? "border-t border-white/10" : ""
                }`}
              >
                <span className="font-mono text-xs text-slate-400">
                  {item.time}
                </span>
                <span className="flex items-center gap-2 text-sm font-medium text-white">
                  {index === 1 ? (
                    <CalendarDays size={15} className="text-sky-300" />
                  ) : (
                    <CheckCircle2 size={15} className="text-emerald-300" />
                  )}
                  {item.title}
                </span>
                <span className="text-xs text-slate-400">{item.detail}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between text-xs text-slate-400">
          <span>Built for a more intentional day.</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </div>
      </aside>

      <section className="relative flex min-h-[600px] flex-col px-6 py-7 sm:px-10 md:px-12 lg:px-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute right-6 top-7 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 sm:right-10 md:right-12 lg:right-20"
          aria-label="Toggle light and dark mode"
          title="Toggle light and dark mode"
        >
          <SunMoon size={18} />
        </button>

        <Link
          href="/"
          className="flex w-fit items-center gap-2 text-sm font-semibold text-slate-900 md:hidden"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-emerald-300">
            <Sparkles size={17} />
          </span>
          Productivity AI
        </Link>

        <div className="my-auto w-full max-w-md self-center py-12">
          <p className="text-sm font-semibold text-emerald-700">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>

          <div className="mt-8">{children}</div>

          <div className="mt-7 border-t border-slate-200 pt-6 text-sm text-slate-500">
            {footer}
          </div>

          <p className="mt-8 flex items-start gap-2 text-xs leading-5 text-slate-400">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            Preview mode: account access is not connected, and credentials are
            not stored.
          </p>
        </div>
      </section>
    </main>
  );
}