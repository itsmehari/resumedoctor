"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics-event-names";

type StepKey = "template_chosen" | "section_filled" | "ats_run" | "export_done";

function buildSteps(firstResumeId?: string | null): { key: StepKey; label: string; hint: string; href: string }[] {
  const atsHref = firstResumeId ? `/resumes/${firstResumeId}/edit?panel=ats` : "/dashboard";
  return [
    {
      key: "template_chosen",
      label: "Create a resume",
      hint: "Pick a layout you would be happy to send—first impression matters.",
      href: "/resumes/new",
    },
    {
      key: "section_filled",
      label: "Fill key sections",
      hint: "Add experience, summary, or education so hiring managers see a clear arc.",
      href: firstResumeId ? `/resumes/${firstResumeId}/edit` : "/dashboard",
    },
    {
      key: "ats_run",
      label: "Run the ATS checker",
      hint: "Paste a job description and see gaps before you press apply.",
      href: atsHref,
    },
    {
      key: "export_done",
      label: "Export your resume",
      hint: "TXT and print on Basic; PDF and Word with Pro or a resume pack.",
      href: "/pricing",
    },
  ];
}

interface OnboardingChecklistProps {
  firstResumeId?: string | null;
}

export function OnboardingChecklist({ firstResumeId }: OnboardingChecklistProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Record<StepKey, boolean> | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [checklistHidden, setChecklistHidden] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const refresh = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetch("/api/user/onboarding-status", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) {
          setSteps(null);
          setCompletedAt(null);
          setChecklistHidden(false);
          setLoadError("Could not load your checklist. Please try again.");
          return;
        }
        const d = await r.json().catch(() => null);
        if (!d?.steps || typeof d.steps !== "object") {
          setSteps(null);
          setCompletedAt(null);
          setChecklistHidden(false);
          setLoadError("Could not load your checklist. Please try again.");
          return;
        }
        setSteps(d.steps as Record<StepKey, boolean>);
        setCompletedAt(d.completedAt ?? null);
        setChecklistHidden(d.checklistHidden === true);
      })
      .catch(() => {
        setSteps(null);
        setCompletedAt(null);
        setChecklistHidden(false);
        setLoadError("Could not load your checklist. Check your connection and try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, firstResumeId]);

  async function dismissChecklist() {
    setDismissing(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ onboardingChecklist: { hideGettingStarted: true } }),
      });
      if (res.ok) {
        trackEvent(AnalyticsEvents.onboarding_checklist_dismissed);
        setChecklistHidden(true);
      }
    } finally {
      setDismissing(false);
    }
  }

  if (loadError && !loading) {
    return (
      <div
        className="mb-8 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-red-800 dark:text-red-200"
        role="alert"
      >
        <span>{loadError}</span>
        <button
          type="button"
          onClick={() => refresh()}
          className="shrink-0 rounded-lg bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading || !steps) {
    return (
      <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Loading checklist…
      </div>
    );
  }

  if (checklistHidden || completedAt) {
    return null;
  }

  const stepMeta = buildSteps(firstResumeId);
  const doneCount = stepMeta.filter((s) => steps[s.key]).length;
  if (doneCount === stepMeta.length) {
    return null;
  }

  return (
    <div className="mb-8 rounded-xl border border-primary-200/60 dark:border-primary-800/50 bg-gradient-to-br from-white to-primary-50/40 dark:from-slate-900 dark:to-primary-950/20 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Getting started</h2>
        <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
          {doneCount}/{stepMeta.length} complete
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        Steps complete automatically when you use the product. Use <strong className="font-medium text-slate-600 dark:text-slate-300">Go</strong> to jump in—no need to mark anything manually.
      </p>
      <ul className="space-y-3">
        {stepMeta.map((s) => {
          const done = steps[s.key];
          return (
            <li
              key={s.key}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-3 py-2.5"
            >
              <div className="flex items-start gap-2 min-w-0">
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" aria-hidden />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" aria-hidden />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{s.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.hint}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!done && (
                  <Link
                    href={s.href}
                    className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                  >
                    Go
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
        <button
          type="button"
          disabled={dismissing}
          onClick={() => void dismissChecklist()}
          className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-50"
        >
          {dismissing ? "Hiding…" : "Dismiss checklist"}
        </button>
        <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
          Hides this card only. Your progress is still tracked in the background.
        </p>
      </div>
    </div>
  );
}
