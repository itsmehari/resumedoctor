// WBS 3.8, 4.3 – Live preview (JSON-driven layout from template metadata)
"use client";

import type { ResumeSection } from "@/types/resume";
import type { TemplateSkillsVariant } from "@/types/template";
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

// ─── Header sub-components ────────────────────────────────────────────────────

interface ContactData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
}

function contactLine(data: ContactData) {
  return [data.email, data.phone, data.location, data.website]
    .filter(Boolean)
    .join("   ·   ");
}

/** Full-width colored band: name in white, contact below */
function TopBarHeader({
  data,
  accentColor,
  fontClass,
}: {
  data: ContactData;
  accentColor: string;
  fontClass: string;
}) {
  const line = contactLine(data);
  return (
    <div style={{ backgroundColor: accentColor }} className={`px-8 py-7 ${fontClass}`}>
      <h1 className="text-2xl font-bold text-white tracking-wide leading-tight">
        {data.name || "Your Name"}
      </h1>
      {line && (
        <p className="text-white/80 text-xs mt-2 leading-relaxed">{line}</p>
      )}
    </div>
  );
}

/** Centered name with accent color, contact row below, bottom divider */
function CenteredHeader({
  data,
  accentColor,
  fontClass,
}: {
  data: ContactData;
  accentColor: string;
  fontClass: string;
}) {
  const line = contactLine(data);
  return (
    <div className={`text-center pt-8 px-8 pb-5 border-b-2 mb-0 ${fontClass}`}
         style={{ borderColor: accentColor + "50" }}>
      <h1 className="text-2xl font-bold tracking-wide" style={{ color: accentColor }}>
        {data.name || "Your Name"}
      </h1>
      {line && (
        <p className="text-slate-500 text-xs mt-2 leading-relaxed">{line}</p>
      )}
    </div>
  );
}

// ─── Section renderer ─────────────────────────────────────────────────────────

const defaultStyle = {
  sectionTitle: "font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-2",
  accent: "",
};

function SectionPreview({
  section,
  style,
  accentColor,
  skillsVariant,
}: {
  section: ResumeSection;
  style?: { sectionTitle: string; accent: string };
  accentColor?: string;
  skillsVariant?: TemplateSkillsVariant;
}) {
  const s = style ?? defaultStyle;
  const titleCls = s.sectionTitle;
  const accentCls = s.accent;
  const color = accentColor ?? "#334155";

  switch (section.type) {
    case "contact": {
      const c = section.data;
      const line = contactLine(c);
      return (
        <div className={accentCls}>
          <h2 className="text-lg font-bold text-slate-900 mb-0.5">{c.name || "Your Name"}</h2>
          {line && <p className="text-slate-500 text-xs">{line}</p>}
        </div>
      );
    }

    case "summary":
      return section.data.text ? (
        <div className={accentCls}>
          <h3 className={titleCls}>Summary</h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{section.data.text}</p>
        </div>
      ) : null;

    case "experience": {
      const expData = section.data as {
        entries?: Array<{
          title: string;
          company: string;
          location?: string;
          startDate: string;
          endDate: string;
          current?: boolean;
          bullets: string[];
        }>;
      };
      const raw = expData.entries ?? [
        section.data as {
          title: string;
          company: string;
          location?: string;
          startDate: string;
          endDate: string;
          current?: boolean;
          bullets: string[];
        },
      ];
      const entries = Array.isArray(raw) ? raw : [raw];
      return (
        <div className={accentCls}>
          <h3 className={titleCls}>Experience</h3>
          <div className="space-y-4">
            {entries.map((e, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-slate-900">{e.title || "Job Title"}</span>
                  <span className="text-slate-500 text-xs whitespace-nowrap flex-shrink-0">
                    {e.startDate}
                    {(e.endDate || e.current) && ` – ${e.current ? "Present" : e.endDate}`}
                  </span>
                </div>
                <div className="text-slate-600 text-xs font-medium mb-1">
                  {e.company}
                  {e.location && `, ${e.location}`}
                </div>
                {(e.bullets ?? []).filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-1 text-slate-700">
                    {(e.bullets ?? []).filter(Boolean).map((b, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-0.5 flex-shrink-0" style={{ color }}>▸</span>
                        <span>{b}</span>
                      </li>
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
      const eduData = section.data as {
        entries?: Array<{
          degree: string;
          school: string;
          location?: string;
          startDate: string;
          endDate: string;
          details?: string;
        }>;
      };
      const rawEdu = eduData.entries ?? [
        section.data as {
          degree: string;
          school: string;
          location?: string;
          startDate: string;
          endDate: string;
          details?: string;
        },
      ];
      const eduList = Array.isArray(rawEdu) ? rawEdu : [rawEdu];
      return (
        <div className={accentCls}>
          <h3 className={titleCls}>Education</h3>
          <div className="space-y-3">
            {eduList.map((e, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-slate-900">{e.degree || "Degree"}</span>
                  <span className="text-slate-500 text-xs whitespace-nowrap flex-shrink-0">
                    {e.startDate}
                    {e.endDate && ` – ${e.endDate}`}
                  </span>
                </div>
                <div className="text-slate-600 text-xs font-medium">
                  {e.school}
                  {e.location && `, ${e.location}`}
                </div>
                {e.details && (
                  <p className="text-slate-600 text-xs mt-0.5">{e.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "skills": {
      const items = (section.data.items ?? []).filter(Boolean);
      if (items.length === 0) return null;

      if (skillsVariant === "tags") {
        return (
          <div>
            <h3 className={titleCls}>Skills</h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {items.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 text-xs rounded font-medium border"
                  style={{
                    borderColor: color + "60",
                    color: color,
                    backgroundColor: color + "12",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      }

      if (skillsVariant === "dots") {
        return (
          <div>
            <h3 className={titleCls}>Skills</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
              {items.map((skill, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 truncate">{skill}</span>
                  <span className="flex gap-0.5 ml-2 flex-shrink-0">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <span
                        key={d}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: d <= 4 ? color : color + "30" }}
                      />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      return (
        <div>
          <h3 className={titleCls}>Skills</h3>
          <p className="text-slate-700 leading-relaxed">{items.join("  ·  ")}</p>
        </div>
      );
    }

    case "projects": {
      const proj = section.data;
      return (
        <div className={accentCls}>
          <h3 className={titleCls}>Projects</h3>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{proj.name || "Project"}</span>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:underline"
                  style={{ color }}
                >
                  ↗ Link
                </a>
              )}
            </div>
            {proj.description && (
              <p className="text-slate-600 text-xs mt-0.5">{proj.description}</p>
            )}
            {(proj.bullets ?? []).filter(Boolean).length > 0 && (
              <ul className="mt-1.5 space-y-1 text-slate-700">
                {proj.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 flex-shrink-0" style={{ color }}>▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

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

  const accentColor = primaryColor ?? template?.colors?.primary ?? "#334155";
  const headerVariant = template?.headerVariant ?? "default";
  const skillsVariant = template?.skillsVariant ?? "plain";
  const useTwoColumn = style.columns === "two-column";
  const sidebarTypes = useTwoColumn ? getSidebarSections(templateId || "professional-in") : [];

  const fontMap = { sans: "font-sans", serif: "font-serif", mono: "font-mono" } as const;
  const wrapperFont =
    fontOverride && fontMap[fontOverride] ? fontMap[fontOverride] : style.wrapper;

  const sizeMap = { small: "text-xs", normal: "text-sm", large: "text-base" } as const;
  const textSize =
    fontSizeOverride && sizeMap[fontSizeOverride] ? sizeMap[fontSizeOverride] : "text-sm";

  const spaceMap = { compact: "space-y-2", normal: "space-y-4", spacious: "space-y-6" } as const;
  const sectionSpacing =
    spacingOverride && spaceMap[spacingOverride] ? spaceMap[spacingOverride] : "space-y-4";

  // For top-bar / centered headers, extract contact section to render separately
  const contactSection = sorted.find((s) => s.type === "contact");
  const contactData = contactSection?.type === "contact" ? contactSection.data : undefined;
  const useSeparateHeader = headerVariant !== "default" && contactSection;
  const bodySections = useSeparateHeader
    ? sorted.filter((s) => s.type !== "contact")
    : sorted;

  const sidebarSections = useTwoColumn
    ? bodySections.filter((s) => sidebarTypes.includes(s.type) && s.type !== "contact")
    : [];
  const mainSections = useTwoColumn
    ? bodySections.filter((s) => !sidebarTypes.includes(s.type) || s.type === "contact")
    : bodySections;

  const sectionProps = { style, accentColor, skillsVariant };

  return (
    <div
      className={`bg-white text-slate-800 shadow-lg rounded-lg overflow-hidden max-w-[21cm] mx-auto ${wrapperFont} ${className}`}
      style={{
        minHeight: "297mm",
        ["--template-primary" as string]: accentColor,
      }}
    >
      {/* ── Separate header (top-bar or centered) ── */}
      {useSeparateHeader && contactData && headerVariant === "top-bar" && (
        <TopBarHeader data={contactData} accentColor={accentColor} fontClass={wrapperFont} />
      )}
      {useSeparateHeader && contactData && headerVariant === "centered" && (
        <CenteredHeader data={contactData} accentColor={accentColor} fontClass={wrapperFont} />
      )}

      {/* ── Body ── */}
      {sorted.length === 0 ? (
        <div className="p-8">
          <p className="text-slate-400 text-sm italic">Add sections to see preview</p>
        </div>
      ) : useTwoColumn ? (
        /* Two-column layout (e.g. Enfold) */
        <div className={`flex ${textSize}`} style={{ minHeight: "inherit" }}>
          <div
            className={`w-[33%] flex-shrink-0 p-6 ${sectionSpacing}`}
            style={
              template?.sidebarBg
                ? { backgroundColor: accentColor + "18", borderRight: `1px solid ${accentColor}25` }
                : { borderRight: "1px solid #e2e8f0" }
            }
          >
            {sidebarSections.map((section) => (
              <SectionPreview key={section.id} section={section} {...sectionProps} />
            ))}
          </div>
          <div className={`flex-1 p-6 ${sectionSpacing}`}>
            {mainSections.map((section) => (
              <SectionPreview key={section.id} section={section} {...sectionProps} />
            ))}
          </div>
        </div>
      ) : (
        /* Single-column layout */
        <div className={`p-8 ${sectionSpacing} ${textSize}`}>
          {bodySections.map((section) => (
            <SectionPreview key={section.id} section={section} {...sectionProps} />
          ))}
        </div>
      )}
    </div>
  );
}
