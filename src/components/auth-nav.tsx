"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const linkBase = "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100";
const linkInverted = "text-white/90 hover:text-white";
const ctaBase = "rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors";
const ctaInverted = "rounded-lg bg-accent hover:bg-accent-hover px-4 py-2 text-sm font-medium text-accent-dark transition-colors";
const outlineBase = "rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors";
const outlineInverted = "rounded-lg border border-white/60 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors";

export function AuthNav({ inverted }: { inverted?: boolean }) {
  const { data: session, status } = useSession();
  const linkCls = inverted ? linkInverted : linkBase;
  const ctaCls = inverted ? ctaInverted : ctaBase;
  const outlineCls = inverted ? outlineInverted : outlineBase;

  if (status === "loading") {
    return (
      <nav className="flex items-center gap-4">
        <div className={`h-9 w-24 animate-pulse rounded ${inverted ? "bg-white/30" : "bg-slate-200 dark:bg-slate-700"}`} />
      </nav>
    );
  }

  if (session?.user) {
    return (
      <nav className="flex items-center gap-4">
        <Link href="/pricing" className={linkCls}>Pricing</Link>
        <Link href="/dashboard" className={linkCls}>Dashboard</Link>
        <Link href="/settings" className={linkCls}>Settings</Link>
        <button onClick={() => signOut({ callbackUrl: "/" })} className={linkCls}>
          Sign out
        </button>
        <Link href="/resumes/new" className={ctaCls}>Create Resume</Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      <Link href="/pricing" className={linkCls}>Pricing</Link>
      <Link href="/login" className={linkCls}>Sign In</Link>
      <Link href="/signup" className={outlineCls}>Sign up</Link>
      <Link href="/resumes/new" className={ctaCls}>Create Resume</Link>
    </nav>
  );
}
