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

const SECTION_TYPES: { type: SectionType; label: string; description: string }[] = [
  { type: "contact",        label: "Contact",        description: "Name, email, phone, location" },
  { type: "summary",        label: "Summary",        description: "Professional overview / objective" },
  { type: "experience",     label: "Experience",     description: "Work history with bullet points" },
  { type: "education",      label: "Education",      description: "Degrees, schools, GPA" },
  { type: "skills",         label: "Skills",         description: "Technical & soft skills" },
  { type: "projects",       label: "Projects",       description: "Key projects & links" },
  { type: "certifications", label: "Certifications", description: "AWS, Google, industry certs" },
  { type: "languages",      label: "Languages",      description: "Spoken languages & proficiency" },
  { type: "awards",         label: "Awards",         description: "Honours, recognitions & achievements" },
];

// Only one contact + one summary allowed
const UNIQUE_SECTIONS = new Set<SectionType>(["contact", "summary"]);

export function AddSection({ sections, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const usedTypes = new Set(sections.map((s) => s.type));

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
          <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 max-h-80 overflow-y-auto">
            {SECTION_TYPES.map(({ type, label, description }) => {
              const disabled = UNIQUE_SECTIONS.has(type) && usedTypes.has(type);
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
                    "w-full px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-start gap-3",
                    disabled && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {label}
                      {disabled && (
                        <span className="ml-1.5 text-xs text-slate-400 font-normal">
                          (already added)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
