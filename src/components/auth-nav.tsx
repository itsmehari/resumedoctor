"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserMenu } from "@/components/user-menu";

const linkBase = "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 min-h-[44px] inline-flex items-center";
const linkInverted = "text-white/90 hover:text-white min-h-[44px] inline-flex items-center";
const ctaBase = "rounded-lg bg-primary-600 px-3 sm:px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors min-h-[44px] inline-flex items-center justify-center touch-manipulation";
const ctaInverted = "rounded-lg bg-accent hover:bg-accent-hover px-3 sm:px-4 py-2.5 text-sm font-medium text-accent-dark transition-colors min-h-[44px] inline-flex items-center justify-center touch-manipulation";
const outlineBase = "rounded-lg border border-slate-300 dark:border-slate-600 px-3 sm:px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors min-h-[44px] inline-flex items-center justify-center touch-manipulation";
const outlineInverted = "rounded-lg border border-white/60 px-3 sm:px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors min-h-[44px] inline-flex items-center justify-center touch-manipulation";

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
      <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
        <Link href="/pricing" className={linkCls}>Pricing</Link>
        <Link href="/dashboard" className={linkCls}>Dashboard</Link>
        <Link href="/dashboard?openImport=1" className={linkCls}>Import</Link>
        <UserMenu inverted={inverted} compact={inverted} />
        <Link href="/resumes/new" className={ctaCls}>Create Resume</Link>
      </nav>
    );
  }

  return (
    <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
      <Link href="/pricing" className={linkCls}>Pricing</Link>
      <Link href="/login" className={linkCls}>Sign In</Link>
      <Link href="/signup" className={outlineCls}>Sign up</Link>
      <Link href="/resumes/new" className={ctaCls}>Create Resume</Link>
    </nav>
  );
}
