"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <nav className="flex items-center gap-4">
        <div className="h-9 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </nav>
    );
  }

  if (session?.user) {
    return (
      <nav className="flex items-center gap-4">
        <Link
          href="/pricing"
          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Pricing
        </Link>
        <Link
          href="/dashboard"
          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Dashboard
        </Link>
        <Link
          href="/settings"
          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Sign out
        </button>
        <Link
          href="/resumes/new"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          Create Resume
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      <Link
        href="/pricing"
        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        Pricing
      </Link>
      <Link
        href="/login"
        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Sign up
      </Link>
      <Link
        href="/resumes/new"
        className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        Create Resume
      </Link>
    </nav>
  );
}
