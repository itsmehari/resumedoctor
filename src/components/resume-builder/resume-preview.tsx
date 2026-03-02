// WBS 3.8, 4.3 – Live preview (template-aware, two-column, font/color customization)
"use client";

import type { ResumeSection } from "@/types/resume";
import { getTemplateStyle } from "@/lib/template-styles";
import { getTemplate } from "@/lib/templates";

interface Props {
  sections: ResumeSection[];
  templateId?: string;
  className?: string;
  /** Override primary/accent color (hex) */
  primaryColor?: string;
  /** Override font: sans | serif | mono */
  fontFamily?: "sans" | "serif" | "mono";
}

const SIDEBAR_TYPES = ["summary", "skills"] as const;
const MAIN_TYPES = ["experience", "education", "projects"] as const;

export function ResumePreview({
  sections,
  templateId = "professional-in",
  className = "",
  primaryColor,
  fontFamily: fontOverride,
}: Props) {
  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const style = getTemplateStyle(templateId);
  const template = getTemplate(templateId || "professional-in");
  const accentColor = primaryColor ?? template?.colors?.primary;
  const useTwoColumn = style.columns === "two-column";
  const fontMap = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  };
  const wrapperFont =
    fontOverride && fontMap[fontOverride]
      ? fontMap[fontOverride]
      : style.wrapper;

  const sidebarSections = useTwoColumn
    ? sorted.filter((s) => SIDEBAR_TYPES.includes(s.type as (typeof SIDEBAR_TYPES)[number]))
    : [];
  const mainSections = useTwoColumn
    ? sorted.filter((s) => MAIN_TYPES.includes(s.type as (typeof MAIN_TYPES)[number]))
    : sorted;

  return (
    <div
      className={`bg-white text-slate-800 shadow-lg rounded-lg p-8 max-w-[21cm] mx-auto ${wrapperFont} ${className}`}
      style={{
        minHeight: "297mm",
        ...(accentColor && {
          ["--template-primary" as string]: accentColor,
        }),
      }}
    >
      {sorted.length === 0 ? (
        <p className="text-slate-400 text-sm italic">Add sections to see preview</p>
      ) : useTwoColumn && (sidebarSections.length > 0 || mainSections.length > 0) ? (
        <div className="grid grid-cols-[1fr_2fr] gap-8 text-sm">
          <div className="space-y-4 border-r border-slate-200 pr-6">
            {sidebarSections.map((section) => (
              <SectionPreview key={section.id} section={section} style={style} />
            ))}
          </div>
          <div className="space-y-4">
            {mainSections.map((section) => (
              <SectionPreview key={section.id} section={section} style={style} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-sm">
          {sorted.map((section) => (
            <SectionPreview key={section.id} section={section} style={style} />
          ))}
        </div>
      )}
    </div>
  );
}

const defaultStyle = {
  sectionTitle: "font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-2",
  accent: "",
};

function SectionPreview({
  section,
  style,
}: {
  section: ResumeSection;
  style?: { sectionTitle: string; accent: string };
}) {
  const s = style ?? defaultStyle;
  const titleCls = s.sectionTitle;
  const accentCls = s.accent;

  switch (section.type) {
    case "summary":
      return section.data.text ? (
        <div className={accentCls}>
          <h3 className={titleCls}>Summary</h3>
          <p className="text-slate-700 whitespace-pre-wrap">{section.data.text}</p>
        </div>
      ) : null;

    case "experience":
      return (
        <div className={accentCls}>
          <h3 className={titleCls}>Experience</h3>
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
        <div className={accentCls}>
          <h3 className={titleCls}>Education</h3>
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
          <h3 className={titleCls}>Skills</h3>
          <p className="text-slate-700">
            {items.join(" • ")}
          </p>
        </div>
      ) : null;

    case "projects":
      return (
        <div className={accentCls}>
          <h3 className={titleCls}>Projects</h3>
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
