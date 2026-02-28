// WBS 3.6 – Add section dropdown
"use client";

import { useState } from "react";
import type { SectionType } from "@/types/resume";
import { createEmptySection } from "@/types/resume";
import { cn } from "@/lib/utils";

interface Props {
  sections: { type: SectionType }[];
  onAdd: (section: ReturnType<typeof createEmptySection>) => void;
}

const SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: "summary", label: "Summary" },
  { type: "experience", label: "Experience" },
  { type: "education", label: "Education" },
  { type: "skills", label: "Skills" },
  { type: "projects", label: "Projects" },
];

export function AddSection({ sections, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const used = new Set(sections.map((s) => s.type));
  const canAddSummary = !used.has("summary");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-colors w-full justify-center"
      >
        + Add section
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
            {SECTION_TYPES.map(({ type, label }) => {
              const disabled = type === "summary" && !canAddSummary;
              return (
                <button
                  key={type}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    const order = sections.length;
                    onAdd(createEmptySection(type, order));
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {label}
                  {disabled && " (already added)"}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
