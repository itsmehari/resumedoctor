"use client";

// Phase 1.4 – Live content feedback (real-time tips as you type)
import { useMemo, useState } from "react";
import Link from "next/link";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { computeLiveFeedback } from "@/lib/ats-checker";
import type { ResumeSection } from "@/types/resume";

interface LiveFeedbackPanelProps {
  sections: ResumeSection[];
  /** When false, show a one-line note tying coaching to plans (exports / Pro limits). */
  isPro?: boolean;
}

export function LiveFeedbackPanel({ sections, isPro = true }: LiveFeedbackPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const tips = useMemo(() => computeLiveFeedback(sections), [sections]);

  if (tips.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20 p-3">
        <div className="flex items-center gap-2 text-green-800 dark:text-green-200 text-sm font-medium">
          <Lightbulb className="h-4 w-4" />
          Looking good! Your content has strong structure.
        </div>
        {!isPro && (
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            Full ATS checks and higher AI limits follow your subscription; exports may use Pro or a resume pack—see{" "}
            <Link href="/pricing" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
              Pricing
            </Link>
            .
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
            Live tips
          </span>
          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 rounded-full px-2 py-0.5">
            {tips.length}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {expanded && (
        <ul className="px-4 pb-3 space-y-2 border-t border-slate-200 dark:border-slate-700 pt-2">
          {tips.map((t, i) => (
            <li
              key={i}
              className={`flex items-start gap-2 text-sm ${
                t.type === "good"
                  ? "text-green-700 dark:text-green-400"
                  : t.type === "warning"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <span
                className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${
                  t.type === "good"
                    ? "bg-green-500"
                    : t.type === "warning"
                      ? "bg-amber-500"
                      : "bg-slate-400"
                }`}
                aria-hidden
              />
              <span>
                {t.message}
                {t.section && (
                  <span className="text-slate-500 dark:text-slate-500 ml-1">
                    ({t.section})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      {!isPro && (
        <p className="px-4 pb-3 pt-1 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
          Full ATS checks and higher AI limits follow your subscription; PDF and Word may use Pro or a resume pack—see{" "}
          <Link href="/pricing" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Pricing
          </Link>
          .
        </p>
      )}
    </div>
  );
}
