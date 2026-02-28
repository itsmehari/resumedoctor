// WBS 3.8 – Live preview panel
"use client";

import type { ResumeSection } from "@/types/resume";

interface Props {
  sections: ResumeSection[];
  className?: string;
}

export function ResumePreview({ sections, className = "" }: Props) {
  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div
      className={`bg-white text-slate-800 shadow-lg rounded-lg p-8 max-w-[21cm] mx-auto ${className}`}
      style={{ minHeight: "297mm" }}
    >
      {sorted.length === 0 ? (
        <p className="text-slate-400 text-sm italic">Add sections to see preview</p>
      ) : (
        <div className="space-y-4 text-sm">
          {sorted.map((section) => (
            <SectionPreview key={section.id} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionPreview({ section }: { section: ResumeSection }) {
  switch (section.type) {
    case "summary":
      return section.data.text ? (
        <div>
          <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Summary
          </h3>
          <p className="text-slate-700 whitespace-pre-wrap">{section.data.text}</p>
        </div>
      ) : null;

    case "experience":
      return (
        <div>
          <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Experience
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between">
                <span className="font-medium">{section.data.title || "Job Title"}</span>
                <span className="text-slate-600 text-xs">
                  {section.data.startDate}
                  {section.data.endDate && ` – ${section.data.endDate}`}
                </span>
              </div>
              <div className="text-slate-600 text-xs">
                {section.data.company}
                {section.data.location && `, ${section.data.location}`}
              </div>
              {section.data.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-2 list-disc list-inside space-y-1 text-slate-700">
                  {section.data.bullets.filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );

    case "education":
      return (
        <div>
          <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Education
          </h3>
          <div>
            <div className="flex justify-between">
              <span className="font-medium">{section.data.degree || "Degree"}</span>
              <span className="text-slate-600 text-xs">
                {section.data.startDate}
                {section.data.endDate && ` – ${section.data.endDate}`}
              </span>
            </div>
            <div className="text-slate-600 text-xs">
              {section.data.school}
              {section.data.location && `, ${section.data.location}`}
            </div>
          </div>
        </div>
      );

    case "skills":
      const items = section.data.items?.filter(Boolean) ?? [];
      return items.length > 0 ? (
        <div>
          <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Skills
          </h3>
          <p className="text-slate-700">
            {items.join(" • ")}
          </p>
        </div>
      ) : null;

    case "projects":
      return (
        <div>
          <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Projects
          </h3>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{section.data.name || "Project"}</span>
              {section.data.link && (
                <a
                  href={section.data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 text-xs hover:underline"
                >
                  Link
                </a>
              )}
            </div>
            {section.data.bullets?.filter(Boolean).length > 0 && (
              <ul className="mt-1 list-disc list-inside space-y-1 text-slate-700">
                {section.data.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
}
