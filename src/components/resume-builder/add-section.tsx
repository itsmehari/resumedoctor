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

const SECTION_GROUPS: {
  group: string;
  hint: string;
  color: string;
  items: { type: SectionType; label: string; icon: string; description: string }[];
}[] = [
  {
    group: "Identity",
    hint: "Who you are",
    color: "text-blue-600",
    items: [
      { type: "contact",   icon: "◈", label: "Contact",          description: "Name, email, phone, location, GitHub, LinkedIn" },
      { type: "summary",   icon: "◆", label: "Summary",          description: "Professional snapshot — for 3+ years experience" },
      { type: "objective", icon: "◆", label: "Career Objective", description: "Goal statement — ideal for freshers & career changers" },
    ],
  },
  {
    group: "Work & Education",
    hint: "Your journey",
    color: "text-emerald-600",
    items: [
      { type: "experience", icon: "◉", label: "Work Experience",  description: "Job titles, companies, bullet achievements" },
      { type: "education",  icon: "◈", label: "Education",        description: "Degrees, schools, GPA, honours" },
      { type: "volunteer",  icon: "◇", label: "Volunteer Work",   description: "NGO, community service, social impact" },
    ],
  },
  {
    group: "Skills & Projects",
    hint: "What you can do",
    color: "text-violet-600",
    items: [
      { type: "skills",    icon: "◇", label: "Skills",    description: "Technical & soft skills — supports category grouping" },
      { type: "projects",  icon: "◉", label: "Projects",  description: "Multiple projects with tech stack tags & bullets" },
      { type: "languages", icon: "◎", label: "Languages", description: "Spoken languages with 5-level proficiency dots" },
    ],
  },
  {
    group: "Achievements",
    hint: "What you've earned",
    color: "text-amber-600",
    items: [
      { type: "certifications", icon: "◈", label: "Certifications", description: "AWS, Google, NPTEL, industry certs + credential ID" },
      { type: "awards",         icon: "★", label: "Awards",         description: "Prizes, recognition, honours received" },
      { type: "publications",   icon: "◆", label: "Publications",   description: "Research papers, articles, books, DOI links" },
    ],
  },
  {
    group: "Personal",
    hint: "Your full picture",
    color: "text-rose-500",
    items: [
      { type: "interests", icon: "♦", label: "Interests",       description: "Hobbies, passions, personal pursuits" },
      { type: "custom",    icon: "◆", label: "Custom Section",  description: "Your own heading — courses, extras, anything else" },
    ],
  },
];

const UNIQUE_SECTIONS = new Set<SectionType>(["contact", "summary", "objective"]);

export function AddSection({ sections, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const usedTypes = new Set(sections.map((s) => s.type));

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 px-4 py-3.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all w-full"
      >
        <span className="text-lg leading-none">+</span>
        Add section
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
            <div className="max-h-[75vh] overflow-y-auto">
              {SECTION_GROUPS.map((group, gi) => (
                <div key={group.group}>
                  {/* Group header */}
                  <div className={`flex items-baseline gap-2 px-4 pt-4 ${gi > 0 ? "border-t border-slate-100 dark:border-slate-800" : ""}`}>
                    <p className={`text-[11px] font-bold uppercase tracking-widest ${group.color}`}>
                      {group.group}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{group.hint}</p>
                  </div>

                  {/* Section items */}
                  <div className="py-1.5 px-2">
                    {group.items.map(({ type, label, icon, description }) => {
                      const disabled = UNIQUE_SECTIONS.has(type) && usedTypes.has(type);
                      const used = usedTypes.has(type) && !UNIQUE_SECTIONS.has(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            onAdd(createEmptySection(type, sections.length));
                            setOpen(false);
                          }}
                          className={cn(
                            "w-full px-3 py-2.5 text-left rounded-lg flex items-start gap-3 transition-colors",
                            disabled
                              ? "opacity-35 cursor-not-allowed"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                          )}
                        >
                          {/* Icon circle */}
                          <span className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${group.color} bg-slate-100 dark:bg-slate-800`}>
                            {icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                                {label}
                              </p>
                              {disabled && (
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-400 px-1.5 py-0 rounded-full">added</span>
                              )}
                              {used && !disabled && (
                                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 px-1.5 py-0 rounded-full">in use</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="h-3" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
