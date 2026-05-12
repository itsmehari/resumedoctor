"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { computeLiveFeedback } from "@/lib/ats-checker";
import type { ResumeSection } from "@/types/resume";

interface LiveFeedbackPanelProps {
  sections: ResumeSection[];
  isPro?: boolean;
  analysisReady?: boolean;
  onTipAction?: (sectionLabel: string | undefined) => void;
}

export function LiveFeedbackPanel({
  sections,
  isPro = true,
  analysisReady = true,
  onTipAction,
}: LiveFeedbackPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const tips = useMemo(() => computeLiveFeedback(sections), [sections]);
  const actionable = tips.filter((t) => t.type !== "good");
  const primary = actionable[0] ?? tips[0];
  const rest = actionable.slice(1);

  if (!analysisReady) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
        Finish a field to see tailored tips.
      </div>
    );
  }

  if (tips.length === 0) {
    const hasContent = sections.some((s) => s.type === "contact" || s.type === "summary" || s.type === "experience");
    return (
      <div className="rounded-xl border border-green-200 bg-green-50/50 p-3 dark:border-green-800 dark:bg-green-900/20">
        <div className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-200">
          <Lightbulb className="h-4 w-4" aria-hidden />
          {hasContent ? "Looking good! Your content has strong structure." : "Add contact details to start coaching."}
        </div>
      </div>
    );
  }

  const renderTip = (t: (typeof tips)[number], key: string) => (
    <li key={key} className="list-none">
      <button
        type="button"
        onClick={() => onTipAction?.(t.section)}
        className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
          t.type === "warning"
            ? "text-amber-700 dark:text-amber-400"
            : t.type === "good"
              ? "text-green-700 dark:text-green-400"
              : "text-slate-600 dark:text-slate-400"
        }`}
      >
        <span
          className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
            t.type === "good" ? "bg-green-500" : t.type === "warning" ? "bg-amber-500" : "bg-slate-400"
          }`}
          aria-hidden
        />
        <span>
          {t.message}
          {t.section ? <span className="ml-1 text-slate-500">({t.section})</span> : null}
        </span>
      </button>
    </li>
  );

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden />
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Live tips</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700">
            {actionable.length || tips.length}
          </span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {expanded && primary && (
        <ul className="space-y-1 border-t border-slate-200 px-2 py-2 dark:border-slate-700">
          {renderTip(primary, "primary")}
          {showAll && rest.map((t, i) => renderTip(t, `rest-${i}`))}
        </ul>
      )}
      {expanded && rest.length > 0 && (
        <div className="border-t border-slate-200 px-4 py-2 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            {showAll ? "Show fewer tips" : `Show ${rest.length} more`}
          </button>
        </div>
      )}
      {!isPro && expanded && (
        <p className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Full ATS runs and portal-ready exports are on Pro or a resume pack.{" "}
          <Link href="/pricing" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            See plans
          </Link>
        </p>
      )}
    </div>
  );
}
