"use client";

import type { ResumeSection, SectionType } from "@/types/resume";
import { getNextEditorStep } from "@/lib/resume-editor-progress";
import { useResumeEditor } from "./resume-editor-context";

interface Props {
  sections: ResumeSection[];
  onAddSection: (section: ResumeSection) => void;
}

export function NextStepBanner({ sections, onAddSection }: Props) {
  const { addSectionAndScroll, scrollToStep } = useResumeEditor();
  const next = getNextEditorStep(sections);

  const handleClick = () => {
    if (next.sectionType) {
      const exists = sections.some((s) => s.type === next.sectionType);
      if (!exists) {
        addSectionAndScroll(next.sectionType as SectionType, onAddSection, sections);
        return;
      }
    }
    scrollToStep(next.stepId);
  };

  return (
    <div className="rounded-xl border border-primary-200 bg-white p-4 shadow-sm dark:border-primary-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">
        Next step
      </p>
      <h3 className="mt-1 font-medium text-slate-900 dark:text-slate-100">{next.title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{next.description}</p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-3 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
      >
        {next.ctaLabel}
      </button>
    </div>
  );
}
