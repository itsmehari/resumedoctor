// WBS 3.8, 4.3 – Live preview (JSON-driven layout from template metadata)
"use client";

import type { ResumeSection } from "@/types/resume";
import { getTemplateStyle, getSidebarSections } from "@/lib/template-styles";
import { getTemplate } from "@/lib/templates";

interface Props {
  sections: ResumeSection[];
  templateId?: string;
  className?: string;
  /** Override primary/accent color (hex) */
  primaryColor?: string;
  /** Override font: sans | serif | mono */
  fontFamily?: "sans" | "serif" | "mono";
  /** Font size: small | normal | large */
  fontSize?: "small" | "normal" | "large";
  /** Section spacing: compact | normal | spacious */
  spacing?: "compact" | "normal" | "spacious";
}


export function ResumePreview({
  sections,
  templateId = "professional-in",
  className = "",
  primaryColor,
  fontFamily: fontOverride,
  fontSize: fontSizeOverride,
  spacing: spacingOverride,
}: Props) {
  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const style = getTemplateStyle(templateId);
  const template = getTemplate(templateId || "professional-in");
  const accentColor = primaryColor ?? template?.colors?.primary;
  const useTwoColumn = style.columns === "two-column";
  const sidebarTypes = useTwoColumn ? getSidebarSections(templateId || "professional-in") : [];
  const fontMap = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  };
  const wrapperFont =
    fontOverride && fontMap[fontOverride]
      ? fontMap[fontOverride]
      : style.wrapper;

  const sizeMap = { small: "text-xs", normal: "text-sm", large: "text-base" } as const;
  const textSize = fontSizeOverride && sizeMap[fontSizeOverride] ? sizeMap[fontSizeOverride] : "text-sm";

  const spaceMap = { compact: "space-y-2", normal: "space-y-4", spacious: "space-y-6" } as const;
  const sectionSpacing = spacingOverride && spaceMap[spacingOverride] ? spaceMap[spacingOverride] : "space-y-4";

  const sidebarSections = useTwoColumn
    ? sorted.filter((s) => sidebarTypes.includes(s.type))
    : [];
  const mainSections = useTwoColumn
    ? sorted.filter((s) => !sidebarTypes.includes(s.type))
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
        <div className={`grid grid-cols-[1fr_2fr] gap-8 ${textSize}`}>
          <div className={`${sectionSpacing} border-r border-slate-200 pr-6`}>
            {sidebarSections.map((section) => (
              <SectionPreview key={section.id} section={section} style={style} />
            ))}
          </div>
          <div className={sectionSpacing}>
            {mainSections.map((section) => (
              <SectionPreview key={section.id} section={section} style={style} />
            ))}
          </div>
        </div>
      ) : (
        <div className={`${sectionSpacing} ${textSize}`}>
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
    case "contact":
      const c = section.data;
      const contactParts = [c.name, c.email, c.phone, c.location, c.website].filter(Boolean);
      return contactParts.length > 0 ? (
        <div className={accentCls}>
          <h2 className="text-lg font-bold text-slate-900 mb-1">{c.name || "Your Name"}</h2>
          <p className="text-slate-600 text-xs space-x-2">
            {c.email && <span>{c.email}</span>}
            {c.phone && <span>· {c.phone}</span>}
            {c.location && <span>· {c.location}</span>}
            {c.website && (
              <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                {c.website}
              </a>
            )}
          </p>
        </div>
      ) : (
        <div className={accentCls}>
          <h2 className="text-lg font-bold text-slate-400 italic">Your Name</h2>
          <p className="text-slate-400 text-xs italic">Email · Phone · Location</p>
        </div>
      );

    case "summary":
      return section.data.text ? (
        <div className={accentCls}>
          <h3 className={titleCls}>Summary</h3>
          <p className="text-slate-700 whitespace-pre-wrap">{section.data.text}</p>
        </div>
      ) : null;

    case "experience": {
      const expData = section.data as { entries?: Array<{ title: string; company: string; location?: string; startDate: string; endDate: string; current?: boolean; bullets: string[] }> };
      const expEntries = expData.entries ?? [section.data as { title: string; company: string; location?: string; startDate: string; endDate: string; current?: boolean; bullets: string[] }];
      const entries = Array.isArray(expEntries) ? expEntries : [expEntries];
      return (
        <div className={accentCls}>
          <h3 className={titleCls}>Experience</h3>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between">
                  <span className="font-medium">{e.title || "Job Title"}</span>
                  <span className="text-slate-600 text-xs">
                    {e.startDate}
                    {e.endDate && ` – ${e.endDate}`}
                  </span>
                </div>
                <div className="text-slate-600 text-xs">
                  {e.company}
                  {e.location && `, ${e.location}`}
                </div>
                {(e.bullets ?? []).filter(Boolean).length > 0 && (
                  <ul className="mt-2 list-disc list-inside space-y-1 text-slate-700">
                    {(e.bullets ?? []).filter(Boolean).map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "education": {
      const eduData = section.data as { entries?: Array<{ degree: string; school: string; location?: string; startDate: string; endDate: string; details?: string }> };
      const eduEntries = eduData.entries ?? [section.data as { degree: string; school: string; location?: string; startDate: string; endDate: string; details?: string }];
      const eduList = Array.isArray(eduEntries) ? eduEntries : [eduEntries];
      return (
        <div className={accentCls}>
          <h3 className={titleCls}>Education</h3>
          <div className="space-y-3">
            {eduList.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between">
                  <span className="font-medium">{e.degree || "Degree"}</span>
                  <span className="text-slate-600 text-xs">
                    {e.startDate}
                    {e.endDate && ` – ${e.endDate}`}
                  </span>
                </div>
                <div className="text-slate-600 text-xs">
                  {e.school}
                  {e.location && `, ${e.location}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

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
