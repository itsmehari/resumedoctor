"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Upload, ChevronDown, Settings, LogOut, FileText } from "lucide-react";

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

interface UserMenuProps {
  inverted?: boolean;
  /** Use compact style (avatar only) for tight headers */
  compact?: boolean;
}

export function UserMenu({ inverted, compact }: UserMenuProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  if (!session?.user) return null;

  const name = session.user.name ?? null;
  const email = session.user.email ?? null;
  const initials = getInitials(name, email);
  const displayLabel = name || email || "Account";

  const baseCls = inverted
    ? "text-white/90 hover:text-white"
    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100";
  const avatarBg = inverted ? "bg-white/20" : "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-200";
  const dropdownBg = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${baseCls}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${avatarBg}`}
        >
          {initials}
        </span>
        {!compact && (
          <>
            <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
              {displayLabel}
            </span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </>
        )}
      </button>
      {open && (
        <div
          className={`absolute right-0 top-full mt-1 z-50 w-56 rounded-lg py-1 ${dropdownBg}`}
          role="menu"
        >
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {email || name || "User"}
            </p>
          </div>
          <div className="py-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => setOpen(false)}
            >
              <FileText className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard?openImport=1"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => setOpen(false)}
            >
              <Upload className="h-4 w-4" />
              Import Resume
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 py-1">
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
