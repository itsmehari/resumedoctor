"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type StepKey = "template_chosen" | "section_filled" | "ats_run" | "export_done";

function buildSteps(firstResumeId?: string | null): { key: StepKey; label: string; hint: string; href: string }[] {
  const atsHref = firstResumeId ? `/resumes/${firstResumeId}/edit?panel=ats` : "/dashboard";
  return [
  {
    key: "template_chosen",
    label: "Create a resume",
    hint: "Pick a template and save your first resume.",
    href: "/resumes/new",
  },
  {
    key: "section_filled",
    label: "Fill key sections",
    hint: "Add experience, summary, or education so your resume tells a story.",
    href: firstResumeId ? `/resumes/${firstResumeId}/edit` : "/dashboard",
  },
  {
    key: "ats_run",
    label: "Run the ATS checker",
    hint: "See how well your resume matches applicant tracking systems.",
    href: atsHref,
  },
  {
    key: "export_done",
    label: "Export your resume",
    hint: "Download TXT (Free) or PDF/DOCX on Pro.",
    href: "/pricing",
  },
];
}


interface OnboardingChecklistProps {
  firstResumeId?: string | null;
}

export function OnboardingChecklist({ firstResumeId }: OnboardingChecklistProps) {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<Record<StepKey, boolean> | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [marking, setMarking] = useState<StepKey | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch("/api/user/onboarding-status", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.steps) setSteps(d.steps);
        if (d?.completedAt) setCompletedAt(d.completedAt);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, firstResumeId]);

  async function markManual(key: StepKey) {
    setMarking(key);
    try {
      const patch: Record<string, boolean> = { [key]: true };
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ onboardingChecklist: patch }),
      });
      if (res.ok) {
        trackEvent("onboarding_step_completed", { step_name: key });
        refresh();
      }
    } finally {
      setMarking(null);
    }
  }

  if (loading || !steps) {
    return (
      <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading checklist…
      </div>
    );
  }

  if (completedAt) {
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
                  <>
                    <Link
                      href={s.href}
                      className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                    >
                      Go
                    </Link>
                    <button
                      type="button"
                      disabled={!!marking}
                      onClick={() => markManual(s.key)}
                      className="rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                      {marking === s.key ? "…" : "Mark done"}
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
