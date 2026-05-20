"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Row = {
  feature: string;
  try: string;
  basic: string;
  pro: string;
  pass?: string;
};

const KEY_ROWS: Row[] = [
  { feature: "Save resumes in account", try: "Preview only", basic: "Yes", pro: "Yes", pass: "Yes" },
  { feature: "Shareable resume link", try: "—", basic: "Yes", pro: "Yes", pass: "Yes" },
  { feature: "PDF export", try: "—", basic: "—", pro: "Yes", pass: "Yes" },
  { feature: "Word export", try: "—", basic: "—", pro: "Yes", pass: "Yes" },
  { feature: "ATS / JD match in editor", try: "Limited", basic: "Basic checks", pro: "Full", pass: "Full" },
  { feature: "All templates", try: "Subset", basic: "10 templates", pro: "All", pass: "All" },
  { feature: "AI writing assist", try: "Trial limits", basic: "5/day", pro: "Higher limits", pass: "Higher limits" },
  { feature: "Custom resume URL (Pro Link)", try: "—", basic: "Add-on", pro: "Annual included", pass: "Add-on" },
];

export function PricingCompareMobile({ isIndia }: { isIndia: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-6 lg:hidden" aria-label="Compare plans (mobile)">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full min-h-[44px] items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        aria-expanded={open}
      >
        Compare plans (tap to expand)
        <ChevronDown className={cn("h-5 w-5 transition", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <ul className="mt-3 space-y-3">
          {KEY_ROWS.map((row) => (
            <li
              key={row.feature}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="font-medium text-slate-900 dark:text-white">{row.feature}</p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <dt className="font-semibold text-violet-700 dark:text-violet-300">Try</dt>
                  <dd>{row.try}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700 dark:text-slate-300">Basic</dt>
                  <dd>{row.basic}</dd>
                </div>
                {isIndia && row.pass ? (
                  <div>
                    <dt className="font-semibold text-amber-700 dark:text-amber-300">14-day pass</dt>
                    <dd>{row.pass}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-semibold text-primary-700 dark:text-primary-300">Pro</dt>
                  <dd>{row.pro}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
