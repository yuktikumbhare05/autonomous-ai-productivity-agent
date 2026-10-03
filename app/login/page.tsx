"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthLayout from "@/src/components/auth/AuthLayout";
import {
  authInputClassName,
  authPrimaryButtonClassName,
} from "@/src/components/auth/authStyles";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.replace("/home");
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      description="Pick up where you left off and get a clear view of your day."
      footer={
        <p>
          New to Productivity AI?{" "}
          <Link
            href="/signup"
            className="font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Work email
          <input
            className={authInputClassName}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            className={authInputClassName}
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </label>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-slate-300 accent-emerald-700"
            />
            Remember me
          </label>
          <span className="text-xs text-slate-400">Demo access only</span>
        </div>

        <button
          type="submit"
          className={authPrimaryButtonClassName}
        >
          Sign in
        </button>

      </form>
    </AuthLayout>
  );
}