// WBS 3.8, 4.3 – Live preview (JSON-driven, per-template structural variants)
"use client";

import type { ResumeSection, ProjectEntry } from "@/types/resume";
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
  previewStyle?: React.CSSProperties;
  primaryColor?: string;
  fontFamily?: "sans" | "serif" | "mono";
  fontSize?: "small" | "normal" | "large";
  spacing?: "compact" | "normal" | "spacious";
  highlightedSectionType?: ResumeSection["type"];
  onSectionSelect?: (type: ResumeSection["type"]) => void;
}

// ─── Section icon map ─────────────────────────────────────────────────────────

const SECTION_ICON: Record<string, string> = {
  contact:        "◈",
  summary:        "◆",
  objective:      "◆",
  experience:     "◉",
  education:      "◈",
  skills:         "◇",
  projects:       "◉",
  certifications: "◈",
  languages:      "◎",
  awards:         "★",
  volunteer:      "◇",
  publications:   "◆",
  interests:      "♦",
  custom:         "◆",
};

// ─── Contact data helper ──────────────────────────────────────────────────────

interface ContactData {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

function contactItems(data: ContactData): string[] {
  return [
    data.email,
    data.phone,
    data.location,
    data.linkedin,
    data.github,
    data.portfolio ?? data.website,
  ].filter(Boolean) as string[];
}

function getInitials(name?: string): string {
  if (!name) return "YN";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Section title component ──────────────────────────────────────────────────

function SectionTitle({
  children, variant, color, isDark, icon, showIcon,
}: {
  children: string;
  variant?: TemplateSectionTitleVariant;
  color: string;
  isDark?: boolean;
  icon?: string;
  showIcon?: boolean;
}) {
  const prefix = showIcon && icon ? (
    <span className="mr-1.5 text-[10px]" style={{ color: isDark ? "rgba(255,255,255,0.5)" : color }}>{icon}</span>
  ) : null;

  if (isDark) {
    return (
      <h4 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3 mt-1 flex items-center">
        {prefix}{children}
      </h4>
    );
  }

  switch (variant) {
    case "filled-bg":
      return (
        <div className="px-3 py-1.5 -mx-1 rounded-sm mb-3" style={{ backgroundColor: color + "15" }}>
          <h3 className="font-bold text-sm flex items-center" style={{ color }}>{prefix}{children}</h3>
        </div>
      );
    case "left-border":
      return (
        <h3 className="font-bold text-sm pl-3 mb-3 border-l-4 flex items-center" style={{ color, borderColor: color }}>
          {prefix}{children}
        </h3>
      );
    case "uppercase":
      return (
        <h3 className="font-bold text-xs tracking-widest uppercase pb-1.5 mb-3 border-b flex items-center"
          style={{ color, borderColor: color + "35" }}>
          {prefix}{children}
        </h3>
      );
    case "bold":
      return (
        <h3 className="font-bold text-base text-slate-900 mb-3 mt-1 flex items-center">{prefix}{children}</h3>
      );
    case "plain":
      return (
        <h3 className="font-medium text-xs uppercase tracking-widest mb-3 flex items-center"
          style={{ color: color + "90" }}>
          {prefix}{children}
        </h3>
      );
    case "double-rule":
      return (
        <div className="mb-3">
          <div className="border-t" style={{ borderColor: color + "60" }} />
          <h3 className="font-semibold text-sm py-1 flex items-center" style={{ color }}>{prefix}{children}</h3>
          <div className="border-t" style={{ borderColor: color + "25" }} />
        </div>
      );
    case "tab":
      return (
        <div className="mb-3">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold text-white tracking-wide uppercase"
            style={{ backgroundColor: color }}>
            {prefix}{children}
          </span>
        </div>
      );
    case "dot-prefix":
      return (
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span style={{ color }}>{children}</span>
        </h3>
      );
    default: // "underline"
      return (
        <h3 className="font-semibold text-sm pb-1.5 mb-3 border-b flex items-center"
          style={{ borderColor: color + "40" }}>
          {prefix}{children}
        </h3>
      );
  }
}

// ─── Header variants ──────────────────────────────────────────────────────────

function PhotoPlaceholder({ size = 56 }: { size?: number }) {
  return (
    <div
      className="rounded-full border-2 border-dashed flex items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size,
        borderColor: "rgba(148,163,184,0.6)",
        backgroundColor: "rgba(241,245,249,0.8)",
      }}
    >
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function TopBarHeader({
  data, accentColor, fontClass, showAvatar, showPhoto,
}: { data: ContactData; accentColor: string; fontClass: string; showAvatar?: boolean; showPhoto?: boolean }) {
  const items = contactItems(data);
  return (
    <div style={{ backgroundColor: accentColor }} className={`px-8 py-6 ${fontClass}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {showAvatar && (
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm border-2 border-white/40"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}>
              {getInitials(data.name)}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-[1.6rem] font-bold text-white tracking-wide leading-tight">
              {data.name || "Your Name"}
            </h1>
            {data.title && (
              <p className="text-white/70 text-xs mt-0.5 font-medium">{data.title}</p>
            )}
            {items.length > 0 && (
              <p className="text-white/70 text-xs mt-1.5 leading-relaxed">{items.join("   ·   ")}</p>
            )}
          </div>
        </div>
        {showPhoto && <PhotoPlaceholder size={64} />}
      </div>
    </div>
  );
}

function CenteredHeader({
  data, accentColor, fontClass, showAvatar, showPhoto,
}: { data: ContactData; accentColor: string; fontClass: string; showAvatar?: boolean; showPhoto?: boolean }) {
  const items = contactItems(data);
  return (
    <div className={`text-center pt-8 px-8 pb-5 border-b-2 ${fontClass}`} style={{ borderColor: accentColor + "45" }}>
      {showPhoto && <div className="flex justify-center mb-3"><PhotoPlaceholder size={64} /></div>}
      {showAvatar && !showPhoto && (
        <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3 border-2"
          style={{ backgroundColor: accentColor + "15", color: accentColor, borderColor: accentColor + "40" }}>
          {getInitials(data.name)}
        </div>
      )}
      <h1 className="text-[1.65rem] font-bold tracking-wide" style={{ color: accentColor }}>
        {data.name || "Your Name"}
      </h1>
      {data.title && (
        <p className="text-slate-500 text-xs mt-1 font-medium">{data.title}</p>
      )}
      {items.length > 0 && (
        <p className="text-slate-500 text-xs mt-2 leading-relaxed">{items.join("   ·   ")}</p>
      )}
    </div>
  );
}

function SplitHeader({
  data, accentColor, fontClass, showAvatar, showPhoto,
}: { data: ContactData; accentColor: string; fontClass: string; showAvatar?: boolean; showPhoto?: boolean }) {
  const items = contactItems(data);
  return (
    <div className={`flex items-stretch px-8 pt-7 pb-5 border-b-2 ${fontClass}`} style={{ borderColor: accentColor + "35" }}>
      <div className="flex items-center gap-4 flex-1 pr-6 min-w-0">
        {showPhoto ? (
          <PhotoPlaceholder size={60} />
        ) : showAvatar ? (
          <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-base border-2"
            style={{ backgroundColor: accentColor + "15", color: accentColor, borderColor: accentColor + "35" }}>
            {getInitials(data.name)}
          </div>
        ) : null}
        <div>
          <h1 className="text-[1.8rem] font-bold leading-tight tracking-tight text-slate-900">
            {data.name || "Your Name"}
          </h1>
          {data.title && (
            <p className="text-xs mt-0.5 font-medium" style={{ color: accentColor }}>{data.title}</p>
          )}
        </div>
      </div>
      <div className="w-px self-stretch mx-2 flex-shrink-0" style={{ backgroundColor: accentColor + "35" }} />
      <div className="flex-shrink-0 flex flex-col justify-center gap-1 pl-6 text-right min-w-[160px]">
        {items.map((item, i) => (
          <p key={i} className="text-xs text-slate-600 leading-snug">{item}</p>
        ))}
      </div>
    </div>
  );
}

function ProfileSidebarHero({
  data,
  accentColor,
  showPhoto,
}: {
  data?: ContactData;
  accentColor: string;
  showPhoto?: boolean;
}) {
  return (
    <div className="relative -mx-5 -mt-6 mb-5 px-5 pt-8 pb-5 overflow-hidden border-b"
      style={{ borderColor: accentColor + "35", backgroundColor: "#f3f4f6" }}>
      <div className="absolute -top-12 -left-16 w-56 h-36 rotate-[-34deg]" style={{ backgroundColor: accentColor }} />
      <div className="relative z-10 flex flex-col items-center text-center">
        {showPhoto ? (
          <div className="mb-3 rounded-full p-1.5 bg-white/95 shadow-sm">
            <PhotoPlaceholder size={92} />
          </div>
        ) : (
          <div className="w-20 h-20 mb-3 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-sm"
            style={{ backgroundColor: accentColor }}>
            {getInitials(data?.name)}
          </div>
        )}
        <h1 className="text-[2rem] leading-[1.05] font-light tracking-wide" style={{ color: accentColor }}>
          {data?.name || "Your Name"}
        </h1>
        {data?.title && (
          <p className="text-sm mt-1.5 text-slate-500">{data.title}</p>
        )}
      </div>
    </div>
  );
}

// ─── Proficiency map ──────────────────────────────────────────────────────────

const PROFICIENCY_LEVELS: Record<string, number> = {
  Native: 5, Fluent: 4, Conversational: 3, Basic: 2,
};

// ─── Section renderer ─────────────────────────────────────────────────────────

interface SectionPreviewProps {
  section: ResumeSection;
  accentColor: string;
  skillsVariant?: TemplateSkillsVariant;
  experienceVariant?: TemplateExperienceVariant;
  sectionTitleVariant?: TemplateSectionTitleVariant;
  isDark?: boolean;
  showIcons?: boolean;
}

function SectionPreview({
  section,
  accentColor,
  skillsVariant = "plain",
  experienceVariant = "default",
  sectionTitleVariant = "underline",
  isDark = false,
  showIcons = false,
}: SectionPreviewProps) {
  const color = accentColor;
  const icon = SECTION_ICON[section.type] ?? "◆";

  const TitleNode = ({ label }: { label: string }) => (
    <SectionTitle variant={sectionTitleVariant} color={color} isDark={isDark} icon={icon} showIcon={showIcons}>
      {label}
    </SectionTitle>
  );

  // ── Contact (default / non-dark rendering) ────────────────────────────────
  if (section.type === "contact") {
    const c = section.data;
    if (isDark) {
      const items = contactItems(c);
      return (
        <div className="mb-1">
          <TitleNode label="Contact" />
          <div className="space-y-2">
            {items.map((item, i) => (
              <p key={i} className="text-white/80 text-xs leading-snug break-all">{item}</p>
            ))}
          </div>
        </div>
      );
    }
    const items = contactItems(c);
    return (
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-0.5">{c.name || "Your Name"}</h2>
        {c.title && <p className="text-xs font-medium mb-0.5" style={{ color }}>{c.title}</p>}
        {items.length > 0 && <p className="text-slate-500 text-xs">{items.join("   ·   ")}</p>}
      </div>
    );
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  if (section.type === "summary") {
    if (!section.data.text) return null;
    return (
      <div>
        <TitleNode label="Summary" />
        <p className={`leading-relaxed whitespace-pre-wrap text-xs ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {section.data.text}
        </p>
      </div>
    );
  }

  // ── Objective ─────────────────────────────────────────────────────────────
  if (section.type === "objective") {
    if (!section.data.text) return null;
    return (
      <div>
        <TitleNode label="Career Objective" />
        <p className={`leading-relaxed whitespace-pre-wrap text-xs ${isDark ? "text-white/85" : "text-slate-700"}`}>
          {section.data.text}
        </p>
      </div>
    );
  }

  // ── Experience ────────────────────────────────────────────────────────────
  if (section.type === "experience") {
    const raw = (section.data as { entries?: unknown[] }).entries ?? [section.data];
    const entries = (Array.isArray(raw) ? raw : [raw]) as Array<{
      title: string; company: string; location?: string;
      employmentType?: string;
      startDate: string; endDate: string; current?: boolean; bullets: string[];
    }>;

    return (
      <div>
        <TitleNode label="Experience" />
        {experienceVariant === "compact" ? (
          <div className="space-y-2">
            {entries.map((e, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
                  <span className={`font-semibold text-xs truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                    {e.title || "Job Title"}
                  </span>
                  {e.employmentType && (
                    <span className="text-[9px] px-1 py-0 rounded flex-shrink-0"
                      style={{ backgroundColor: color + "20", color }}>
                      {e.employmentType}
                    </span>
                  )}
                  <span className={`text-[10px] flex-shrink-0 ${isDark ? "text-white/50" : "text-slate-400"}`}>at</span>
                  <span className={`text-xs truncate ${isDark ? "text-white/75" : "text-slate-600"}`}>
                    {e.company}{e.location && `, ${e.location}`}
                  </span>
                </div>
                <span className={`text-[10px] whitespace-nowrap flex-shrink-0 ${isDark ? "text-white/50" : "text-slate-400"}`}>
                  {e.startDate}{(e.endDate || e.current) && ` – ${e.current ? "Present" : e.endDate}`}
                </span>
              </div>
            ))}
          </div>
        ) : experienceVariant === "timeline" ? (
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px]" style={{ backgroundColor: color + "30" }} />
            <div className="space-y-5">
              {entries.map((e, i) => (
                <div key={i} className="pl-7 relative">
                  <div className="absolute left-0 top-[5px] w-[15px] h-[15px] rounded-full border-2 bg-white"
                    style={{ borderColor: color }} />
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-900 text-xs leading-snug">{e.title || "Job Title"}</span>
                      {e.employmentType && (
                        <span className="text-[9px] px-1.5 py-0 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color + "20", color }}>
                          {e.employmentType}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[10px] whitespace-nowrap flex-shrink-0 mt-0.5">
                      {e.startDate}{(e.endDate || e.current) && ` – ${e.current ? "Present" : e.endDate}`}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px] font-medium mt-0.5">
                    {e.company}{e.location && `, ${e.location}`}
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
          <div className="space-y-4">
            {entries.map((e, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                      {e.title || "Job Title"}
                    </span>
                    {e.employmentType && (
                      <span className="text-[9px] px-1.5 py-0 rounded-full"
                        style={{ backgroundColor: isDark ? "rgba(255,255,255,0.2)" : color + "20",
                                 color: isDark ? "white" : color }}>
                        {e.employmentType}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] whitespace-nowrap flex-shrink-0 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    {e.startDate}{(e.endDate || e.current) && ` – ${e.current ? "Present" : e.endDate}`}
                  </span>
                </div>
                <p className={`text-[10px] font-medium mt-0.5 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {e.company}{e.location && `, ${e.location}`}
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
      degree: string; school: string; location?: string;
      startDate: string; endDate: string; details?: string; gpa?: string; honours?: string;
    }>;
    return (
      <div>
        <TitleNode label="Education" />
        <div className="space-y-3">
          {entries.map((e, i) => (
            <div key={i}>
              <div className="flex items-start justify-between gap-2">
                <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>{e.degree || "Degree"}</span>
                <span className={`text-[10px] whitespace-nowrap flex-shrink-0 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  {e.startDate}{e.endDate && ` – ${e.endDate}`}
                </span>
              </div>
              <p className={`text-[10px] font-medium ${isDark ? "text-white/70" : "text-slate-600"}`}>
                {e.school}{e.location && `, ${e.location}`}
              </p>
              {e.gpa && (
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/60" : "text-slate-500"}`}>GPA: {e.gpa}</p>
              )}
              {e.honours && (
                <p className={`text-[10px] mt-0.5 italic ${isDark ? "text-white/55" : "text-slate-400"}`}>{e.honours}</p>
              )}
              {e.details && (
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/60" : "text-slate-500"}`}>{e.details}</p>
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
    const levels = section.data.levels ?? {};

    const titleNode = <TitleNode label="Skills" />;

    if (isDark) {
      return (
        <div>
          {titleNode}
          <div className="space-y-2">
            {items.map((skill, i) => {
              const lvl = levels[skill] ?? (4 - (i % 2));
              return (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-white/85 text-xs">{skill}</span>
                  <span className="flex gap-0.5 ml-2">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <span key={d} className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: d <= lvl ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)" }}
                      />
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (skillsVariant === "bars") {
      return (
        <div>
          {titleNode}
          <div className="space-y-2 mt-1">
            {items.map((skill, i) => {
              const lvl = levels[skill] ?? (4 - (i % 3));
              const pct = Math.round((lvl / 5) * 100);
              return (
                <div key={i}>
                  <p className="text-slate-700 text-xs font-medium mb-0.5">{skill}</p>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (skillsVariant === "dots") {
      return (
        <div>
          {titleNode}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
            {items.map((skill, i) => {
              const lvl = levels[skill] ?? 4;
              return (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 truncate">{skill}</span>
                  <span className="flex gap-0.5 ml-1 flex-shrink-0">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: d <= lvl ? color : color + "25" }}
                      />
                    ))}
                  </span>
                </div>
              );
            })}
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
              <span key={i} className="px-2.5 py-0.5 text-xs rounded font-medium border"
                style={{ borderColor: color + "55", color, backgroundColor: color + "10" }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      );
    }

    if (skillsVariant === "categories") {
      const cats = section.data.categories ?? [];
      if (cats.length > 0) {
        return (
          <div>
            {titleNode}
            <div className="space-y-2.5">
              {cats.map((cat, i) => (
                <div key={i}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{cat.name}</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{cat.items.join("  ·  ")}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return <div>{titleNode}<p className="text-slate-700 text-xs leading-relaxed">{items.join("  ·  ")}</p></div>;
    }

    if (skillsVariant === "icon-grid") {
      return (
        <div>
          {titleNode}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-1">
            {items.map((skill, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-slate-700 truncate">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (skillsVariant === "compact") {
      return <div>{titleNode}<p className="text-slate-700 text-xs leading-relaxed">{items.join(", ")}</p></div>;
    }

    return <div>{titleNode}<p className="text-slate-700 text-xs leading-relaxed">{items.join("  ·  ")}</p></div>;
  }

  // ── Projects (multi-entry) ────────────────────────────────────────────────
  if (section.type === "projects") {
    const data = section.data;
    const entries: ProjectEntry[] = "entries" in data
      ? (data.entries as ProjectEntry[])
      : [data as unknown as ProjectEntry];

    return (
      <div>
        <TitleNode label="Projects" />
        <div className="space-y-4">
          {entries.map((proj, i) => (
            <div key={proj.id ?? i}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                  {proj.name || "Project"}
                </span>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] hover:underline flex-shrink-0"
                    style={{ color: isDark ? "rgba(255,255,255,0.6)" : color }}>
                    ↗ Link
                  </a>
                )}
              </div>
              {proj.description && (
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/70" : "text-slate-600"}`}>{proj.description}</p>
              )}
              {(proj.tech ?? []).filter(Boolean).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {(proj.tech ?? []).map((t, j) => (
                    <span key={j} className="text-[9px] px-1.5 py-0 rounded"
                      style={{ backgroundColor: isDark ? "rgba(255,255,255,0.15)" : color + "15",
                               color: isDark ? "rgba(255,255,255,0.75)" : color }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {(proj.bullets ?? []).filter(Boolean).length > 0 && (
                <ul className="mt-1.5 space-y-1">
                  {(proj.bullets ?? []).filter(Boolean).map((b, j) => (
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
      </div>
    );
  }

  // ── Certifications ────────────────────────────────────────────────────────
  if (section.type === "certifications") {
    const entries = section.data.entries ?? [];
    if (entries.length === 0) return null;
    return (
      <div>
        <TitleNode label="Certifications" />
        <div className="space-y-2.5">
          {entries.map((cert, i) => (
            <div key={i}>
              <p className={`font-semibold text-xs leading-snug ${isDark ? "text-white" : "text-slate-900"}`}>
                {cert.name || "Certification"}
              </p>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className={`text-[10px] ${isDark ? "text-white/65" : "text-slate-500"}`}>{cert.issuer}</span>
                <span className={`text-[10px] flex-shrink-0 ${isDark ? "text-white/50" : "text-slate-400"}`}>{cert.date}</span>
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
        <TitleNode label="Languages" />
        <div className="space-y-2">
          {entries.map((lang, i) => {
            const level = PROFICIENCY_LEVELS[lang.proficiency] ?? 3;
            return (
              <div key={i} className="flex items-center justify-between">
                <span className={`text-xs ${isDark ? "text-white/85" : "text-slate-700"}`}>{lang.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] ${isDark ? "text-white/50" : "text-slate-400"}`}>{lang.proficiency}</span>
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <span key={d} className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: d <= level
                            ? isDark ? "rgba(255,255,255,0.8)" : color
                            : isDark ? "rgba(255,255,255,0.15)" : color + "25",
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
        <TitleNode label="Awards" />
        <div className="space-y-2.5">
          {entries.map((award, i) => (
            <div key={i}>
              <div className="flex items-start justify-between gap-2">
                <span className={`font-semibold text-xs leading-snug ${isDark ? "text-white" : "text-slate-900"}`}>
                  {award.title || "Award"}
                </span>
                <span className={`text-[10px] flex-shrink-0 ${isDark ? "text-white/50" : "text-slate-400"}`}>{award.date}</span>
              </div>
              {award.issuer && (
                <p className={`text-[10px] ${isDark ? "text-white/60" : "text-slate-500"}`}>{award.issuer}</p>
              )}
              {award.description && (
                <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/70" : "text-slate-600"}`}>{award.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Volunteer ─────────────────────────────────────────────────────────────
  if (section.type === "volunteer") {
    const entries = section.data.entries ?? [];
    if (entries.length === 0) return null;
    return (
      <div>
        <TitleNode label="Volunteer Work" />
        <div className="space-y-4">
          {entries.map((v, i) => (
            <div key={i}>
              <div className="flex items-start justify-between gap-2">
                <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                  {v.role || "Role"}
                </span>
                <span className={`text-[10px] whitespace-nowrap flex-shrink-0 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  {v.startDate}{(v.endDate || v.current) && ` – ${v.current ? "Present" : v.endDate}`}
                </span>
              </div>
              <p className={`text-[10px] font-medium mt-0.5 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                {v.organization}{v.location && `, ${v.location}`}
              </p>
              {(v.bullets ?? []).filter(Boolean).length > 0 && (
                <ul className="mt-1.5 space-y-1">
                  {(v.bullets ?? []).filter(Boolean).map((b, j) => (
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
      </div>
    );
  }

  // ── Publications ──────────────────────────────────────────────────────────
  if (section.type === "publications") {
    const entries = section.data.entries ?? [];
    if (entries.length === 0) return null;
    return (
      <div>
        <TitleNode label="Publications" />
        <div className="space-y-3">
          {entries.map((pub, i) => (
            <div key={i}>
              <p className={`font-semibold text-xs leading-snug ${isDark ? "text-white" : "text-slate-900"}`}>
                {pub.title || "Title"}
              </p>
              {pub.authors && (
                <p className={`text-[10px] mt-0.5 italic ${isDark ? "text-white/65" : "text-slate-500"}`}>
                  {pub.authors}
                </p>
              )}
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className={`text-[10px] ${isDark ? "text-white/60" : "text-slate-500"}`}>{pub.publisher}</span>
                <span className={`text-[10px] flex-shrink-0 ${isDark ? "text-white/50" : "text-slate-400"}`}>{pub.date}</span>
              </div>
              {pub.doi && (
                <p className={`text-[9px] mt-0.5 font-mono ${isDark ? "text-white/40" : "text-slate-400"}`}>
                  DOI: {pub.doi}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Interests ─────────────────────────────────────────────────────────────
  if (section.type === "interests") {
    const items = (section.data.items ?? []).filter(Boolean);
    if (items.length === 0) return null;
    return (
      <div>
        <TitleNode label="Interests" />
        <div className="flex flex-wrap gap-1.5 mt-1">
          {items.map((item, i) => (
            <span key={i} className="px-2.5 py-0.5 text-xs rounded-full border"
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.3)" : color + "40",
                color: isDark ? "rgba(255,255,255,0.8)" : "#475569",
                backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "transparent",
              }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // ── Custom ────────────────────────────────────────────────────────────────
  if (section.type === "custom") {
    const { heading, bullets, text } = section.data;
    const hasBullets = (bullets ?? []).filter(Boolean).length > 0;
    return (
      <div>
        <TitleNode label={heading || "Additional Information"} />
        {text && (
          <p className={`text-xs leading-relaxed mb-1 ${isDark ? "text-white/85" : "text-slate-700"}`}>{text}</p>
        )}
        {hasBullets && (
          <ul className="space-y-1">
            {(bullets ?? []).filter(Boolean).map((b, i) => (
              <li key={i} className="flex gap-1.5 text-xs">
                <span className="flex-shrink-0 mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.5)" : color }}>▸</span>
                <span className={isDark ? "text-white/80" : "text-slate-700"}>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ResumePreview({
  sections, templateId = "professional-in", className = "",
  previewStyle,
  primaryColor, fontFamily: fontOverride, fontSize: fontSizeOverride, spacing: spacingOverride,
  highlightedSectionType,
  onSectionSelect,
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
  const accentStrip = template?.accentStrip ?? false;
  const showInitialsAvatar = template?.showInitialsAvatar ?? false;
  const showPhotoPlaceholder = template?.showPhotoPlaceholder ?? false;
  const sectionIcons = template?.sectionIcons ?? false;

  const fontMap = { sans: "font-sans", serif: "font-serif", mono: "font-mono" } as const;
  const wrapperFont = fontOverride && fontMap[fontOverride] ? fontMap[fontOverride] : (style.wrapper ?? "font-sans");

  const sizeMap = { small: "text-xs", normal: "text-sm", large: "text-base" } as const;
  const textSize = fontSizeOverride && sizeMap[fontSizeOverride] ? sizeMap[fontSizeOverride] : "text-sm";

  const spaceMap = { compact: "space-y-3", normal: "space-y-4", spacious: "space-y-6" } as const;
  const sectionSpacing = spacingOverride && spaceMap[spacingOverride] ? spaceMap[spacingOverride] : "space-y-4";

  const isDarkSidebar = layoutVariant === "dark-sidebar";
  const isProfileSidebar = layoutVariant === "profile-sidebar";
  const isTwoColumn = layoutVariant === "two-column" || (style.columns === "two-column" && !isDarkSidebar && !isProfileSidebar);
  const rawSidebarTypes = isDarkSidebar || isTwoColumn || isProfileSidebar ? getSidebarSections(templateId) : [];

  const contactSection = sorted.find((s) => s.type === "contact");
  const contactData: ContactData | undefined = contactSection?.type === "contact" ? contactSection.data : undefined;

  const useSeparateHeader =
    (headerVariant === "top-bar" || headerVariant === "centered" || headerVariant === "split") && contactSection;
  const nonContactSections = sorted.filter((s) => s.type !== "contact");

  const sidebarSections = isDarkSidebar || isTwoColumn || isProfileSidebar
    ? sorted.filter((s) => rawSidebarTypes.includes(s.type))
    : [];
  const mainSections = isDarkSidebar || isTwoColumn
    ? sorted.filter((s) => !rawSidebarTypes.includes(s.type) && s.type !== "contact")
    : useSeparateHeader ? nonContactSections : sorted;

  const sectionProps = { accentColor, skillsVariant, experienceVariant, sectionTitleVariant, showIcons: sectionIcons };

  function renderInteractiveSection(section: ResumeSection, isDark = false) {
    const inner = <SectionPreview section={section} {...sectionProps} isDark={isDark} />;
    if (!onSectionSelect) {
      return <div key={section.id}>{inner}</div>;
    }
    const highlighted = highlightedSectionType === section.type;
    return (
      <button
        key={section.id}
        type="button"
        onClick={() => onSectionSelect(section.type)}
        className={`mb-1 block w-full rounded-md text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 motion-reduce:transition-none ${
          highlighted ? "ring-2 ring-primary-400 ring-offset-2" : "hover:bg-slate-50/80"
        }`}
      >
        {inner}
      </button>
    );
  }

  function renderHeader() {
    if (!useSeparateHeader || !contactData) return null;
    if (headerVariant === "top-bar")
      return <TopBarHeader data={contactData} accentColor={accentColor} fontClass={wrapperFont} showAvatar={showInitialsAvatar} showPhoto={showPhotoPlaceholder} />;
    if (headerVariant === "centered")
      return <CenteredHeader data={contactData} accentColor={accentColor} fontClass={wrapperFont} showAvatar={showInitialsAvatar} showPhoto={showPhotoPlaceholder} />;
    if (headerVariant === "split")
      return <SplitHeader data={contactData} accentColor={accentColor} fontClass={wrapperFont} showAvatar={showInitialsAvatar} showPhoto={showPhotoPlaceholder} />;
    return null;
  }

  if (sorted.length === 0) {
    return (
      <div
        className={`mx-auto max-w-[21cm] overflow-hidden rounded-lg bg-white text-slate-800 shadow-lg ${wrapperFont} ${className}`}
        style={{ minHeight: "297mm", ...previewStyle }}
      >
        <div className="space-y-3 p-8">
          <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
          <div className="mt-6 h-4 w-full animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
          <p className="pt-4 text-sm text-slate-400">Add sections to see your resume take shape.</p>
        </div>
      </div>
    );
  }

  const wrapperStyle: React.CSSProperties = {
    minHeight: "297mm",
    ...previewStyle,
    ["--template-primary" as string]: accentColor,
  };

  // ── DARK SIDEBAR ─────────────────────────────────────────────────────────
  if (isDarkSidebar) {
    return (
      <div className={`bg-white text-slate-800 shadow-lg rounded-lg overflow-hidden max-w-[21cm] mx-auto ${wrapperFont} ${textSize} ${className}`}
        style={wrapperStyle}>
        <div className="flex" style={{ minHeight: "inherit" }}>
          <div className={`w-[34%] flex-shrink-0 px-6 py-8 ${sectionSpacing}`} style={{ backgroundColor: accentColor }}>
            <div className="mb-6">
              {showPhotoPlaceholder && <div className="mb-4"><PhotoPlaceholder size={64} /></div>}
              {showInitialsAvatar && !showPhotoPlaceholder && (
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base mb-4 border-2 border-white/25"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}>
                  {getInitials(contactData?.name)}
                </div>
              )}
              <h1 className="text-xl font-bold text-white leading-tight tracking-wide">
                {contactData?.name || "Your Name"}
              </h1>
              {contactData?.title && (
                <p className="text-white/60 text-xs mt-1">{contactData.title}</p>
              )}
            </div>
            {sidebarSections.map((section) => renderInteractiveSection(section, true))}
          </div>
          <div className={`flex-1 px-7 py-8 ${sectionSpacing}`}>
            {mainSections.map((section) => renderInteractiveSection(section, false))}
          </div>
        </div>
      </div>
    );
  }

  // ── PROFILE SIDEBAR (premium) ────────────────────────────────────────────
  if (isProfileSidebar) {
    const profileSidebarSections = sorted.filter((s) => rawSidebarTypes.includes(s.type));
    const profileMainSections = sorted.filter((s) => !rawSidebarTypes.includes(s.type) && s.type !== "contact");
    return (
      <div className={`bg-white text-slate-800 shadow-lg rounded-lg overflow-hidden max-w-[21cm] mx-auto ${wrapperFont} ${textSize} ${className}`}
        style={wrapperStyle}>
        <div className="flex" style={{ minHeight: "inherit" }}>
          <div className={`w-[33%] flex-shrink-0 px-5 py-6 ${sectionSpacing}`} style={{ backgroundColor: "#f3f4f6" }}>
            <ProfileSidebarHero data={contactData} accentColor={accentColor} showPhoto={showPhotoPlaceholder} />
            {profileSidebarSections.filter((s) => s.type !== "contact").map((section) => (
              renderInteractiveSection(section, false)
            ))}
            {profileSidebarSections.filter((s) => s.type === "contact").map((section) => (
              renderInteractiveSection(section, false)
            ))}
          </div>
          <div className={`flex-1 px-7 py-7 ${sectionSpacing}`}>
            {profileMainSections.map((section) => (
              renderInteractiveSection(section, false)
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── TWO-COLUMN ───────────────────────────────────────────────────────────
  if (isTwoColumn) {
    return (
      <div className={`bg-white text-slate-800 shadow-lg rounded-lg overflow-hidden max-w-[21cm] mx-auto ${wrapperFont} ${textSize} ${className}`}
        style={wrapperStyle}>
        {renderHeader()}
        <div className="flex" style={{ minHeight: "inherit" }}>
          {accentStrip && <div className="w-1 flex-shrink-0" style={{ backgroundColor: accentColor }} />}
          <div className={`w-[33%] flex-shrink-0 px-5 py-6 ${sectionSpacing}`}
            style={template?.sidebarBg
              ? { backgroundColor: accentColor + "14", borderRight: `1px solid ${accentColor}20` }
              : { borderRight: "1px solid #e2e8f0" }}>
            {sidebarSections.filter((s) => s.type !== "contact").map((section) => (
              renderInteractiveSection(section, false)
            ))}
          </div>
          <div className={`flex-1 px-6 py-6 ${sectionSpacing}`}>
            {mainSections.map((section) => renderInteractiveSection(section, false))}
          </div>
        </div>
      </div>
    );
  }

  // ── SINGLE COLUMN ────────────────────────────────────────────────────────
  return (
    <div className={`bg-white text-slate-800 shadow-lg rounded-lg overflow-hidden max-w-[21cm] mx-auto ${wrapperFont} ${textSize} ${className}`}
      style={wrapperStyle}>
      {renderHeader()}
      <div className="flex" style={{ minHeight: "inherit" }}>
        {accentStrip && (
          <div className="w-1 flex-shrink-0 self-stretch" style={{ backgroundColor: accentColor }} />
        )}
        <div className={`flex-1 px-8 py-6 ${sectionSpacing}`}>
          {(useSeparateHeader ? nonContactSections : sorted).map((section) => (
            renderInteractiveSection(section, false)
          ))}
        </div>
      </div>
    </div>
  );
}
