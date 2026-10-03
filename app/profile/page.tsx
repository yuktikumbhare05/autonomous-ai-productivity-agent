"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Check, LogOut, UserRound } from "lucide-react";

type Profile = {
  name: string;
  email: string;
  role: string;
  timezone: string;
};

const profileStorageKey = "productivity-ai-profile";

const defaultProfile: Profile = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  role: "Product manager",
  timezone: "Asia/Kolkata",
};

const inputClassName =
  "mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15";

const defaultProfileSnapshot = JSON.stringify(defaultProfile);

function subscribeToProfile(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
  };
}

function getProfileSnapshot() {
  return localStorage.getItem(profileStorageKey) ?? defaultProfileSnapshot;
}

function getServerProfileSnapshot() {
  return defaultProfileSnapshot;
}

function parseProfile(snapshot: string): Profile {
  try {
    return {
      ...defaultProfile,
      ...(JSON.parse(snapshot) as Partial<Profile>),
    };
  } catch {
    return defaultProfile;
  }
}

export default function ProfilePage() {
  const profileSnapshot = useSyncExternalStore(
    subscribeToProfile,
    getProfileSnapshot,
    getServerProfileSnapshot,
  );
  const profile = parseProfile(profileSnapshot);

  const handleSave = (updatedProfile: Profile) => {
    localStorage.setItem(profileStorageKey, JSON.stringify(updatedProfile));
  };

  return (
    <ProfileEditor
      key={profileSnapshot}
      initialProfile={profile}
      onSave={handleSave}
    />
  );
}

function ProfileEditor({
  initialProfile,
  onSave,
}: {
  initialProfile: Profile;
  onSave: (profile: Profile) => void;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [isSaved, setIsSaved] = useState(false);

  const updateProfile = (field: keyof Profile, value: string) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
    setIsSaved(false);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(profile);
    setIsSaved(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(profileStorageKey);
    router.replace("/login");
  };

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-7 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
            Account
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Your profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Keep your personal details and working timezone up to date.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8 sm:px-8">
        <form onSubmit={handleSave}>
          <section className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
              {initials || <UserRound size={24} />}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">{profile.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Workspace member
              </p>
            </div>
          </section>

          <section className="py-7">
            <div className="mb-5">
              <h2 className="text-base font-semibold">Personal details</h2>
              <p className="mt-1 text-sm text-slate-500">
                Used to personalize your workspace.
              </p>
            </div>

            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Full name
                <input
                  className={inputClassName}
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={profile.name}
                  onChange={(event) => updateProfile("name", event.target.value)}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Work email
                <input
                  className={inputClassName}
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={profile.email}
                  onChange={(event) => updateProfile("email", event.target.value)}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Job title
                <input
                  className={inputClassName}
                  type="text"
                  name="role"
                  value={profile.role}
                  onChange={(event) => updateProfile("role", event.target.value)}
                  placeholder="Your role"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Timezone
                <select
                  className={inputClassName}
                  name="timezone"
                  value={profile.timezone}
                  onChange={(event) =>
                    updateProfile("timezone", event.target.value)
                  }
                >
                  <option value="Asia/Kolkata">India Standard Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="Europe/London">United Kingdom Time</option>
                  <option value="UTC">UTC</option>
                </select>
              </label>
            </div>
          </section>

          <footer className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div aria-live="polite" className="text-sm text-slate-500">
              {isSaved ? (
                <span className="inline-flex items-center gap-2 text-emerald-700">
                  <Check size={16} />
                  Profile saved in this browser
                </span>
              ) : (
                "Profile details are stored locally in this demo."
              )}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
              >
                <LogOut size={16} />
                Sign out
              </button>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Save profile
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}