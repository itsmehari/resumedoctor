// WBS 3.8, 4.3 – Live preview (JSON-driven, per-template structural variants)
"use client";

import type { ResumeSection } from "@/types/resume";
import type {
  TemplateSkillsVariant,
  TemplateExperienceVariant,
  TemplateSectionTitleVariant,
} from "@/types/template";
import { getTemplateStyle, getSidebarSections } from "@/lib/template-styles";
import { getTemplate } from "@/lib/templates";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  sections: ResumeSection[];
  templateId?: string;
  className?: string;
  primaryColor?: string;
  fontFamily?: "sans" | "serif" | "mono";
  fontSize?: "small" | "normal" | "large";
  spacing?: "compact" | "normal" | "spacious";
}

// ─── Contact data helper ──────────────────────────────────────────────────────

interface ContactData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
}

function contactItems(data: ContactData): string[] {
  return [data.email, data.phone, data.location, data.linkedin ?? data.website].filter(
    Boolean
  ) as string[];
}

// ─── Section title component ──────────────────────────────────────────────────

function SectionTitle({
  children,
  variant,
  color,
  isDark,
}: {
  children: string;
  variant?: TemplateSectionTitleVariant;
  color: string;
  isDark?: boolean;
}) {
  if (isDark) {
    return (
      <h4 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3 mt-1">
        {children}
      </h4>
    );
  }

  switch (variant) {
    case "filled-bg":
      return (
        <div
          className="px-3 py-1.5 -mx-1 rounded-sm mb-3"
          style={{ backgroundColor: color + "15" }}
        >
          <h3 className="font-bold text-sm" style={{ color }}>
            {children}
          </h3>
        </div>
      );

    case "left-border":
      return (
        <h3
          className="font-bold text-sm pl-3 mb-3 border-l-4"
          style={{ color, borderColor: color }}
        >
          {children}
        </h3>
      );

    case "uppercase":
      return (
        <h3
          className="font-bold text-xs tracking-widest uppercase pb-1.5 mb-3 border-b"
          style={{ color, borderColor: color + "35" }}
        >
          {children}
        </h3>
      );

    case "bold":
      return (
        <h3 className="font-bold text-base text-slate-900 mb-3 mt-1">{children}</h3>
      );

    case "plain":
      return (
        <h3 className="font-medium text-xs uppercase tracking-widest mb-3" style={{ color: color + "90" }}>
          {children}
        </h3>
      );

    default: // "underline"
      return (
        <h3
          className="font-semibold text-sm pb-1.5 mb-3 border-b"
          style={{ color: "inherit", borderColor: color + "40" }}
        >
          {children}
        </h3>
      );
  }
}

// ─── Header variants ──────────────────────────────────────────────────────────

function TopBarHeader({
  data,
  accentColor,
  fontClass,
}: {
  data: ContactData;
  accentColor: string;
  fontClass: string;
}) {
  const items = contactItems(data);
  return (
    <div style={{ backgroundColor: accentColor }} className={`px-8 py-6 ${fontClass}`}>
      <h1 className="text-[1.6rem] font-bold text-white tracking-wide leading-tight">
        {data.name || "Your Name"}
      </h1>
      {items.length > 0 && (
        <p className="text-white/75 text-xs mt-2 leading-relaxed">
          {items.join("   ·   ")}
        </p>
      )}
    </div>
  );
}

function CenteredHeader({
  data,
  accentColor,
  fontClass,
}: {
  data: ContactData;
  accentColor: string;
  fontClass: string;
}) {
  const items = contactItems(data);
  return (
    <div
      className={`text-center pt-8 px-8 pb-5 border-b-2 ${fontClass}`}
      style={{ borderColor: accentColor + "45" }}
    >
      <h1 className="text-[1.65rem] font-bold tracking-wide" style={{ color: accentColor }}>
        {data.name || "Your Name"}
      </h1>
      {items.length > 0 && (
        <p className="text-slate-500 text-xs mt-2 leading-relaxed">{items.join("   ·   ")}</p>
      )}
    </div>
  );
}

// ─── Proficiency level helpers ────────────────────────────────────────────────

const PROFICIENCY_LEVELS: Record<string, number> = {
  Native: 5,
  Fluent: 4,
  Conversational: 3,
  Basic: 2,
};

// ─── Section renderer ─────────────────────────────────────────────────────────

interface SectionPreviewProps {
  section: ResumeSection;
  accentColor: string;
  skillsVariant?: TemplateSkillsVariant;
  experienceVariant?: TemplateExperienceVariant;
  sectionTitleVariant?: TemplateSectionTitleVariant;
  /** true when rendered inside the dark sidebar */
  isDark?: boolean;
}

function SectionPreview({
  section,
  accentColor,
  skillsVariant = "plain",
  experienceVariant = "default",
  sectionTitleVariant = "underline",
  isDark = false,
}: SectionPreviewProps) {
  const color = accentColor;

  // ── Contact ──────────────────────────────────────────────────────────────
  if (section.type === "contact") {
    const c = section.data;
    if (isDark) {
      const items = contactItems(c);
      return (
        <div className="mb-1">
          <SectionTitle variant={sectionTitleVariant} color={color} isDark>
            Contact
          </SectionTitle>
          <div className="space-y-2">
            {items.map((item, i) => (
              <p key={i} className="text-white/80 text-xs leading-snug break-all">
                {item}
              </p>
            ))}
          </div>
        </div>
      );
    }
    const items = contactItems(c);
    return (
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-0.5">{c.name || "Your Name"}</h2>
        {items.length > 0 && (
          <p className="text-slate-500 text-xs">{items.join("   ·   ")}</p>
        )}
      </div>
    );
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  if (section.type === "summary") {
    if (!section.data.text) return null;
    return (
      <div>
        <SectionTitle variant={sectionTitleVariant} color={color} isDark={isDark}>
          Summary
        </SectionTitle>
        <p
          className={`leading-relaxed whitespace-pre-wrap text-xs ${
            isDark ? "text-white/85" : "text-slate-700"
          }`}
        >
          {section.data.text}
        </p>
      </div>
    );
  }

  // ── Experience ────────────────────────────────────────────────────────────
  if (section.type === "experience") {
    const raw = (section.data as { entries?: unknown[] }).entries ?? [section.data];
    const entries = (Array.isArray(raw) ? raw : [raw]) as Array<{
      title: string;
      company: string;
      location?: string;
      startDate: string;
      endDate: string;
      current?: boolean;
      bullets: string[];
    }>;

    return (
      <div>
        <SectionTitle variant={sectionTitleVariant} color={color} isDark={isDark}>
          Experience
        </SectionTitle>

        {experienceVariant === "timeline" ? (
          /* ── Timeline variant ── */
          <div className="relative">
            <div
              className="absolute left-[7px] top-2 bottom-2 w-[1.5px]"
              style={{ backgroundColor: color + "30" }}
            />
            <div className="space-y-5">
              {entries.map((e, i) => (
                <div key={i} className="pl-7 relative">
                  <div
                    className="absolute left-0 top-[5px] w-[15px] h-[15px] rounded-full border-2 bg-white"
                    style={{ borderColor: color }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-900 text-xs leading-snug">
                      {e.title || "Job Title"}
                    </span>
                    <span className="text-slate-400 text-[10px] whitespace-nowrap flex-shrink-0 mt-0.5">
                      {e.startDate}
                      {(e.endDate || e.current) && ` – ${e.current ? "Present" : e.endDate}`}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px] font-medium mt-0.5">
                    {e.company}
                    {e.location && `, ${e.location}`}
                  </p>
                  {(e.bullets ?? []).filter(Boolean).length > 0 && (
                    <ul className="mt-1.5 space-y-1">
                      {(e.bullets ?? []).filter(Boolean).map((b, j) => (
                        <li key={j} className="flex gap-1.5 text-xs text-slate-700">
                          <span className="flex-shrink-0 mt-0.5" style={{ color }}>▸</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Default variant ── */
          <div className="space-y-4">
            {entries.map((e, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-2">
                  <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                    {e.title || "Job Title"}
                  </span>
                  <span className={`text-[10px] whitespace-nowrap flex-shrink-0 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    {e.startDate}
                    {(e.endDate || e.current) && ` – ${e.current ? "Present" : e.endDate}`}
                  </span>
                </div>
                <p className={`text-[10px] font-medium mt-0.5 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {e.company}
                  {e.location && `, ${e.location}`}
                </p>
                {(e.bullets ?? []).filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {(e.bullets ?? []).filter(Boolean).map((b, j) => (
                      <li key={j} className="flex gap-1.5 text-xs">
                        <span className="flex-shrink-0 mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.5)" : color }}>▸</span>
                        <span className={isDark ? "text-white/80" : "text-slate-700"}>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Education ─────────────────────────────────────────────────────────────
  if (section.type === "education") {
    const raw = (section.data as { entries?: unknown[] }).entries ?? [section.data];
    const entries = (Array.isArray(raw) ? raw : [raw]) as Array<{
      degree: string;
      school: string;
      location?: string;
      startDate: string;
      endDate: string;
      details?: string;
      gpa?: string;
    }>;

    return (
      <div>
        <SectionTitle variant={sectionTitleVariant} color={color} isDark={isDark}>
          Education
        </SectionTitle>
        <div className="space-y-3">
          {entries.map((e, i) => (
            <div key={i}>
              <div className="flex items-start justify-between gap-2">
                <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                  {e.degree || "Degree"}
                </span>
                <span className={`text-[10px] whitespace-nowrap flex-shrink-0 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  {e.startDate}{e.endDate && ` – ${e.endDate}`}
                </span>
              </div>
              <p className={`text-[10px] font-medium ${isDark ? "text-white/70" : "text-slate-600"}`}>
                {e.school}{e.location && `, ${e.location}`}
              </p>
              {e.gpa && (
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  GPA: {e.gpa}
                </p>
              )}
              {e.details && (
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  {e.details}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Skills ────────────────────────────────────────────────────────────────
  if (section.type === "skills") {
    const items = (section.data.items ?? []).filter(Boolean);
    if (items.length === 0) return null;

    const titleNode = (
      <SectionTitle variant={sectionTitleVariant} color={color} isDark={isDark}>
        Skills
      </SectionTitle>
    );

    if (isDark) {
      // Dark sidebar: always render as dots on dark
      return (
        <div>
          {titleNode}
          <div className="space-y-2">
            {items.map((skill, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-white/85 text-xs">{skill}</span>
                <span className="flex gap-0.5 ml-2">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <span
                      key={d}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: d <= 4 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (skillsVariant === "bars") {
      return (
        <div>
          {titleNode}
          <div className="space-y-2 mt-1">
            {items.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-slate-700 font-medium">{skill}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${65 + (i % 4) * 8}%`,
                      backgroundColor: color,
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (skillsVariant === "dots") {
      return (
        <div>
          {titleNode}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
            {items.map((skill, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 truncate">{skill}</span>
                <span className="flex gap-0.5 ml-1 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: d <= 4 ? color : color + "25" }}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (skillsVariant === "tags") {
      return (
        <div>
          {titleNode}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {items.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 text-xs rounded font-medium border"
                style={{
                  borderColor: color + "55",
                  color: color,
                  backgroundColor: color + "10",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      );
    }

    if (skillsVariant === "compact") {
      return (
        <div>
          {titleNode}
          <p className="text-slate-700 text-xs leading-relaxed">{items.join(", ")}</p>
        </div>
      );
    }

    // plain
    return (
      <div>
        {titleNode}
        <p className="text-slate-700 text-xs leading-relaxed">{items.join("  ·  ")}</p>
      </div>
    );
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  if (section.type === "projects") {
    const proj = section.data;
    return (
      <div>
        <SectionTitle variant={sectionTitleVariant} color={color} isDark={isDark}>
          Projects
        </SectionTitle>
        <div>
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
              {proj.name || "Project"}
            </span>
            {proj.link && (
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] hover:underline"
                style={{ color: isDark ? "rgba(255,255,255,0.6)" : color }}
              >
                ↗ Link
              </a>
            )}
          </div>
          {proj.description && (
            <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/70" : "text-slate-600"}`}>
              {proj.description}
            </p>
          )}
          {(proj.bullets ?? []).filter(Boolean).length > 0 && (
            <ul className="mt-1.5 space-y-1">
              {proj.bullets.filter(Boolean).map((b, i) => (
                <li key={i} className="flex gap-1.5 text-xs">
                  <span className="flex-shrink-0 mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.5)" : color }}>▸</span>
                  <span className={isDark ? "text-white/80" : "text-slate-700"}>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // ── Certifications ────────────────────────────────────────────────────────
  if (section.type === "certifications") {
    const entries = section.data.entries ?? [];
    if (entries.length === 0) return null;
    return (
      <div>
        <SectionTitle variant={sectionTitleVariant} color={color} isDark={isDark}>
          Certifications
        </SectionTitle>
        <div className="space-y-2.5">
          {entries.map((cert, i) => (
            <div key={i}>
              <p className={`font-semibold text-xs leading-snug ${isDark ? "text-white" : "text-slate-900"}`}>
                {cert.name || "Certification"}
              </p>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className={`text-[10px] ${isDark ? "text-white/65" : "text-slate-500"}`}>
                  {cert.issuer}
                </span>
                <span className={`text-[10px] flex-shrink-0 ${isDark ? "text-white/50" : "text-slate-400"}`}>
                  {cert.date}
                </span>
              </div>
              {cert.credentialId && (
                <p className={`text-[9px] mt-0.5 font-mono ${isDark ? "text-white/40" : "text-slate-400"}`}>
                  ID: {cert.credentialId}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Languages ─────────────────────────────────────────────────────────────
  if (section.type === "languages") {
    const entries = section.data.entries ?? [];
    if (entries.length === 0) return null;
    return (
      <div>
        <SectionTitle variant={sectionTitleVariant} color={color} isDark={isDark}>
          Languages
        </SectionTitle>
        <div className="space-y-2">
          {entries.map((lang, i) => {
            const level = PROFICIENCY_LEVELS[lang.proficiency] ?? 3;
            return (
              <div key={i} className="flex items-center justify-between">
                <span className={`text-xs ${isDark ? "text-white/85" : "text-slate-700"}`}>
                  {lang.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] ${isDark ? "text-white/50" : "text-slate-400"}`}>
                    {lang.proficiency}
                  </span>
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <span
                        key={d}
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            d <= level
                              ? isDark
                                ? "rgba(255,255,255,0.8)"
                                : color
                              : isDark
                              ? "rgba(255,255,255,0.15)"
                              : color + "25",
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Awards ────────────────────────────────────────────────────────────────
  if (section.type === "awards") {
    const entries = section.data.entries ?? [];
    if (entries.length === 0) return null;
    return (
      <div>
        <SectionTitle variant={sectionTitleVariant} color={color} isDark={isDark}>
          Awards
        </SectionTitle>
        <div className="space-y-2.5">
          {entries.map((award, i) => (
            <div key={i}>
              <div className="flex items-start justify-between gap-2">
                <span className={`font-semibold text-xs leading-snug ${isDark ? "text-white" : "text-slate-900"}`}>
                  {award.title || "Award"}
                </span>
                <span className={`text-[10px] flex-shrink-0 ${isDark ? "text-white/50" : "text-slate-400"}`}>
                  {award.date}
                </span>
              </div>
              {award.issuer && (
                <p className={`text-[10px] ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  {award.issuer}
                </p>
              )}
              {award.description && (
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {award.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
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
  const template = getTemplate(templateId);

  const accentColor = primaryColor ?? template?.colors?.primary ?? "#334155";
  const layoutVariant = template?.layoutVariant ?? "single";
  const headerVariant = template?.headerVariant ?? "default";
  const skillsVariant = template?.skillsVariant ?? "plain";
  const experienceVariant = template?.experienceVariant ?? "default";
  const sectionTitleVariant = template?.sectionTitleVariant ?? "underline";

  const fontMap = { sans: "font-sans", serif: "font-serif", mono: "font-mono" } as const;
  const wrapperFont =
    fontOverride && fontMap[fontOverride] ? fontMap[fontOverride] : (style.wrapper ?? "font-sans");

  const sizeMap = { small: "text-xs", normal: "text-sm", large: "text-base" } as const;
  const textSize =
    fontSizeOverride && sizeMap[fontSizeOverride] ? sizeMap[fontSizeOverride] : "text-sm";

  const spaceMap = { compact: "space-y-3", normal: "space-y-4", spacious: "space-y-6" } as const;
  const sectionSpacing =
    spacingOverride && spaceMap[spacingOverride] ? spaceMap[spacingOverride] : "space-y-4";

  const isDarkSidebar = layoutVariant === "dark-sidebar";
  const isTwoColumn = layoutVariant === "two-column" || (style.columns === "two-column" && !isDarkSidebar);

  // Sections for sidebar (dark or light two-column)
  const rawSidebarTypes =
    isDarkSidebar || isTwoColumn
      ? getSidebarSections(templateId)
      : [];

  // For top-bar / centered / dark-sidebar headers: pull contact out of body
  const contactSection = sorted.find((s) => s.type === "contact");
  const contactData: ContactData | undefined =
    contactSection?.type === "contact" ? contactSection.data : undefined;

  const useSeparateHeader =
    (headerVariant === "top-bar" || headerVariant === "centered") && contactSection;

  // Remove contact from sections if it's shown in the header or dark sidebar
  const nonContactSections = sorted.filter((s) => s.type !== "contact");

  // For dark sidebar: contact goes into the sidebar block (rendered separately)
  // For two-column with top-bar: contact rendered as header, sidebar gets filtered sections
  const sidebarSections = (isDarkSidebar || isTwoColumn)
    ? sorted.filter((s) => rawSidebarTypes.includes(s.type))
    : [];

  const mainSections = (isDarkSidebar || isTwoColumn)
    ? sorted.filter((s) => !rawSidebarTypes.includes(s.type) && s.type !== "contact")
    : useSeparateHeader
    ? nonContactSections
    : sorted;

  const sectionProps = { accentColor, skillsVariant, experienceVariant, sectionTitleVariant };

  if (sorted.length === 0) {
    return (
      <div
        className={`bg-white text-slate-800 shadow-lg rounded-lg overflow-hidden max-w-[21cm] mx-auto ${wrapperFont} ${className}`}
        style={{ minHeight: "297mm" }}
      >
        <div className="p-8">
          <p className="text-slate-400 text-sm italic">Add sections to see preview</p>
        </div>
      </div>
    );
  }

  // ── DARK SIDEBAR LAYOUT ───────────────────────────────────────────────────
  if (isDarkSidebar) {
    return (
      <div
        className={`bg-white text-slate-800 shadow-lg rounded-lg overflow-hidden max-w-[21cm] mx-auto ${wrapperFont} ${textSize} ${className}`}
        style={{ minHeight: "297mm", ["--template-primary" as string]: accentColor }}
      >
        <div className="flex" style={{ minHeight: "inherit" }}>
          {/* ── Dark left panel ── */}
          <div
            className={`w-[34%] flex-shrink-0 px-6 py-8 ${sectionSpacing}`}
            style={{ backgroundColor: accentColor }}
          >
            {/* Name block at top of sidebar */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white leading-tight tracking-wide">
                {contactData?.name || "Your Name"}
              </h1>
            </div>
            {/* Sidebar sections (contact details, skills, languages, etc.) */}
            {sidebarSections.map((section) => (
              <SectionPreview
                key={section.id}
                section={section}
                {...sectionProps}
                isDark
              />
            ))}
          </div>

          {/* ── White right panel ── */}
          <div className={`flex-1 px-7 py-8 ${sectionSpacing}`}>
            {/* If there's a summary or other lead-in section, put it at top */}
            {mainSections.map((section) => (
              <SectionPreview
                key={section.id}
                section={section}
                {...sectionProps}
                isDark={false}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── TWO-COLUMN LAYOUT ─────────────────────────────────────────────────────
  if (isTwoColumn) {
    return (
      <div
        className={`bg-white text-slate-800 shadow-lg rounded-lg overflow-hidden max-w-[21cm] mx-auto ${wrapperFont} ${textSize} ${className}`}
        style={{ minHeight: "297mm", ["--template-primary" as string]: accentColor }}
      >
        {/* Top header (top-bar or centered) */}
        {useSeparateHeader && contactData && headerVariant === "top-bar" && (
          <TopBarHeader data={contactData} accentColor={accentColor} fontClass={wrapperFont} />
        )}
        {useSeparateHeader && contactData && headerVariant === "centered" && (
          <CenteredHeader data={contactData} accentColor={accentColor} fontClass={wrapperFont} />
        )}

        <div className="flex" style={{ minHeight: "inherit" }}>
          {/* Left sidebar */}
          <div
            className={`w-[33%] flex-shrink-0 px-5 py-6 ${sectionSpacing}`}
            style={
              template?.sidebarBg
                ? {
                    backgroundColor: accentColor + "14",
                    borderRight: `1px solid ${accentColor}20`,
                  }
                : { borderRight: "1px solid #e2e8f0" }
            }
          >
            {sidebarSections
              .filter((s) => s.type !== "contact")
              .map((section) => (
                <SectionPreview
                  key={section.id}
                  section={section}
                  {...sectionProps}
                  isDark={false}
                />
              ))}
          </div>

          {/* Main content */}
          <div className={`flex-1 px-6 py-6 ${sectionSpacing}`}>
            {mainSections.map((section) => (
              <SectionPreview
                key={section.id}
                section={section}
                {...sectionProps}
                isDark={false}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── SINGLE COLUMN LAYOUT ──────────────────────────────────────────────────
  return (
    <div
      className={`bg-white text-slate-800 shadow-lg rounded-lg overflow-hidden max-w-[21cm] mx-auto ${wrapperFont} ${textSize} ${className}`}
      style={{ minHeight: "297mm", ["--template-primary" as string]: accentColor }}
    >
      {/* Header */}
      {useSeparateHeader && contactData && headerVariant === "top-bar" && (
        <TopBarHeader data={contactData} accentColor={accentColor} fontClass={wrapperFont} />
      )}
      {useSeparateHeader && contactData && headerVariant === "centered" && (
        <CenteredHeader data={contactData} accentColor={accentColor} fontClass={wrapperFont} />
      )}

      {/* Body */}
      <div className={`px-8 py-6 ${sectionSpacing}`}>
        {(useSeparateHeader ? nonContactSections : sorted).map((section) => (
          <SectionPreview
            key={section.id}
            section={section}
            {...sectionProps}
            isDark={false}
          />
        ))}
      </div>
    </div>
  );
}
