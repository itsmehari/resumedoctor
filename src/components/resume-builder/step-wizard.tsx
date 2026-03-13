"use client";

// Phase 3 – Step-by-step wizard (guided build flow)
import { useMemo } from "react";
import { Check } from "lucide-react";
import type { ResumeSection } from "@/types/resume";

const STEPS = [
  { id: "contact", label: "Contact" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "ready", label: "Review" },
];

function isStepComplete(stepId: string, sections: ResumeSection[]): boolean {
  switch (stepId) {
    case "contact": {
      const c = sections.find((s) => s.type === "contact");
      const d = c?.data as { name?: string; email?: string } | undefined;
      return !!(d?.name?.trim() && d?.email?.trim());
    }
    case "summary": {
      const s = sections.find((sec) => sec.type === "summary" || sec.type === "objective");
      const text = (s?.data as { text?: string })?.text ?? "";
      return text.trim().length >= 50;
    }
    case "experience": {
      const exp = sections.find((s) => s.type === "experience");
      const entries = exp && "entries" in exp.data ? (exp.data as { entries?: unknown[] }).entries : [];
      return Array.isArray(entries) && entries.some((e: unknown) => {
        const x = e as { title?: string; company?: string };
        return !!(x?.title?.trim() && x?.company?.trim());
      });
    }
    case "skills": {
      const sk = sections.find((s) => s.type === "skills");
      const items = (sk?.data as { items?: string[] })?.items ?? [];
      return items.some((i) => i?.trim());
    }
    case "ready":
      return isStepComplete("contact", sections) && isStepComplete("experience", sections);
    default:
      return false;
  }
}

interface StepWizardProps {
  sections: ResumeSection[];
}

export function StepWizard({ sections }: StepWizardProps) {
  const stepsWithStatus = useMemo(
    () =>
      STEPS.map((s) => ({
        ...s,
        complete: isStepComplete(s.id, sections),
      })),
    [sections]
  );

  const currentIndex = stepsWithStatus.findIndex((s) => !s.complete);
  const activeIndex = currentIndex >= 0 ? currentIndex : STEPS.length - 1;

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {stepsWithStatus.map((step, i) => (
        <div
          key={step.id}
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            step.complete
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
              : i === activeIndex
                ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
          }`}
        >
          {step.complete ? (
            <Check className="h-3 w-3 flex-shrink-0" />
          ) : (
            <span className="w-3 h-3 flex-shrink-0 rounded-full border border-current" />
          )}
          <span className="hidden sm:inline">{step.label}</span>
        </div>
      ))}
    </div>
  );
}
