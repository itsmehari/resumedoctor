"use client";

import Link from "next/link";
import { Upload, MoreHorizontal } from "lucide-react";
import { useState } from "react";

type Props = {
  isPro: boolean;
  onImport: () => void;
};

export function DashboardHeaderActions({ isPro, onImport }: Props) {
  const [overflowOpen, setOverflowOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onImport}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-white hover:shadow-md dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/80 touch-manipulation"
      >
        <Upload className="h-4 w-4 shrink-0" />
        Import
      </button>
      <Link
        href="/resumes/new"
        className="inline-flex min-h-[44px] items-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25 touch-manipulation"
      >
        + Create Resume
      </Link>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOverflowOpen((o) => !o)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 touch-manipulation"
          aria-expanded={overflowOpen}
          aria-haspopup="menu"
          aria-label="More actions"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
        {overflowOpen && (
          <>
            <div className="fixed inset-0 z-10" aria-hidden onClick={() => setOverflowOpen(false)} />
            <div
              role="menu"
              className="absolute right-0 top-full z-20 mt-1 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <Link
                href="/cover-letters"
                role="menuitem"
                className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setOverflowOpen(false)}
              >
                Cover letters
              </Link>
              {!isPro && (
                <Link
                  href="/pricing"
                  role="menuitem"
                  className="block px-4 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/40"
                  onClick={() => setOverflowOpen(false)}
                >
                  Get PDF &amp; Word (Pro)
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
