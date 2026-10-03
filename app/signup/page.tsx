"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import AuthLayout from "@/src/components/auth/AuthLayout";
import {
  authInputClassName,
  authPrimaryButtonClassName,
} from "@/src/components/auth/authStyles";

export default function SignupPage() {
  const router = useRouter();
  const [notice, setNotice] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setNotice("Those passwords do not match. Check them and try again.");
      return;
    }

    router.replace("/home");
  };

  return (
    <AuthLayout
      eyebrow="Start with a clear slate"
      title="Create your account"
      description="Set up your workspace and bring your priorities together."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input
            className={authInputClassName}
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </label>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              className={authInputClassName}
              type="password"
              name="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="8+ characters"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Confirm password
            <input
              className={authInputClassName}
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              minLength={8}
              placeholder="Repeat password"
              required
            />
          </label>
        </div>

        <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-slate-500">
          <input
            type="checkbox"
            name="terms"
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-700"
            required
          />
          <span>I agree to the terms and privacy policy.</span>
        </label>

        <button
          type="submit"
          className={authPrimaryButtonClassName}
        >
          Create account
        </button>

        {notice && (
          <p
            role="status"
            className={`rounded-lg border px-4 py-3 text-sm leading-5 ${
              notice.startsWith("Those passwords")
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {notice}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}