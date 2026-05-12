"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import type { ResumeSection } from "@/types/resume";
import {
  EDITOR_STEPS,
  getActiveStepId,
  getStepProgressLabel,
  isStepComplete,
  type EditorStepId,
} from "@/lib/resume-editor-progress";

interface StepWizardProps {
  sections: ResumeSection[];
  onStepClick?: (stepId: EditorStepId) => void;
}

export function StepWizard({ sections, onStepClick }: StepWizardProps) {
  const activeStepId = useMemo(() => getActiveStepId(sections), [sections]);

  const stepsWithStatus = useMemo(
    () =>
      EDITOR_STEPS.map((s) => ({
        ...s,
        complete: isStepComplete(s.id, sections),
        progress: getStepProgressLabel(s.id, sections),
      })),
    [sections]
  );

  return (
    <nav aria-label="Resume build progress" className="flex items-center gap-1 sm:gap-2">
      {stepsWithStatus.map((step) => {
        const isActive = step.id === activeStepId;
        const className = step.complete
          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
          : isActive
            ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onStepClick?.(step.id)}
            aria-current={isActive ? "step" : undefined}
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors hover:opacity-90 ${className}`}
            title={step.progress ?? step.label}
          >
            {step.complete ? (
              <Check className="h-3 w-3 flex-shrink-0" aria-hidden />
            ) : (
              <span className="h-3 w-3 flex-shrink-0 rounded-full border border-current" aria-hidden />
            )}
            <span className="hidden sm:inline">{step.label}</span>
            {isActive && step.progress && (
              <span className="hidden md:inline text-[10px] opacity-80">· {step.progress}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
