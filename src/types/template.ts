// WBS 4.1 – Template JSON schema definition

export type TemplateFontFamily = "sans" | "serif" | "mono";

// ─── Variant types ────────────────────────────────────────────────────────────

/** How the contact/name header block is rendered */
export type TemplateHeaderVariant =
  | "default"       // Left-aligned name + inline contact text
  | "top-bar"       // Full-width colored band, white name + contact
  | "centered"      // Centered name in accent color, centered contact below
  | "split"         // Name left, contact icon-grid right (two-zone header)
  | "dark-sidebar"; // Name lives inside the dark sidebar (no separate header)

/** How the skills section is rendered */
export type TemplateSkillsVariant =
  | "plain"    // "skill1 · skill2 · skill3"
  | "tags"     // Pill badges with accent color border + tint
  | "dots"     // 2-col grid with 5-dot proficiency scale
  | "bars"     // Horizontal progress bars
  | "compact"; // Comma-separated, tighter

/** How each experience entry is rendered */
export type TemplateExperienceVariant =
  | "default"   // Classic: title/date row, company below, bullet list
  | "timeline"; // Vertical line + circle dot per entry

/** How section title headings are styled */
export type TemplateSectionTitleVariant =
  | "underline"    // Thin bottom border (most common)
  | "left-border"  // Thick left border accent before text
  | "uppercase"    // All-caps + letter spacing + subtle bottom line
  | "filled-bg"    // Colored background band behind title
  | "bold"         // Large bold, no decoration (executive style)
  | "plain";       // No decoration, light muted text

/** Overall structural layout of the resume */
export type TemplateLayoutVariant =
  | "single"       // One column, full width
  | "two-column"   // Sidebar (left 33%) + main (right 67%)
  | "dark-sidebar";// Full dark left panel (left 35%) + white right (65%)

// ─── Color / layout sub-types ─────────────────────────────────────────────────

export interface TemplateColors {
  primary: string;
  accent?: string;
  text: string;
  muted?: string;
  border?: string;
}

export interface TemplateLayout {
  spacing?: "compact" | "normal" | "spacious";
  sectionTitleStyle?: "underline" | "left-border" | "uppercase" | "plain" | "bold";
  lineHeight?: "tight" | "normal" | "relaxed";
  columns?: "single" | "two-column";
  /** Explicit layout type – supersedes columns if set */
  layoutType?: "single" | "two-column" | "header-split" | "dark-sidebar";
  /** Section types to show in sidebar (two-column / dark-sidebar) */
  sidebarSections?: string[];
  sectionOrder?: string[];
}

// ─── Main metadata interface ──────────────────────────────────────────────────

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  fontFamily: TemplateFontFamily;
  colors: TemplateColors;
  layout?: TemplateLayout;

  // Legacy class-based styling (still used by template-styles.ts for PDF export)
  wrapperClass?: string;
  sectionTitleClass?: string;
  accentClass?: string;

  /** Category for filtering in the UI */
  category?: "professional" | "fresher" | "creative" | "minimal" | "corporate" | "executive" | "modern" | "classic" | "ats" | "tech";

  trialAvailable?: boolean;
  thumbnailUrl?: string;

  // ── NEW: structural + visual variant controls ──────────────────────────────
  /** Overall page layout */
  layoutVariant?: TemplateLayoutVariant;
  /** Header/contact block style */
  headerVariant?: TemplateHeaderVariant;
  /** Skills rendering style */
  skillsVariant?: TemplateSkillsVariant;
  /** Experience entry rendering style */
  experienceVariant?: TemplateExperienceVariant;
  /** Section title heading style */
  sectionTitleVariant?: TemplateSectionTitleVariant;
  /** Tinted sidebar bg (two-column layouts) */
  sidebarBg?: boolean;
}

export type TemplateId = string;
