// WBS 4.1 – Template JSON schema definition

export type TemplateFontFamily = "sans" | "serif" | "mono";

// ─── Variant types ────────────────────────────────────────────────────────────

/** How the contact/name header block is rendered */
export type TemplateHeaderVariant =
  | "default"       // Left-aligned name + inline contact text on one line
  | "top-bar"       // Full-width colored band, white name + contact row
  | "centered"      // Centered name in accent color, centered contact below
  | "split"         // Name (large) LEFT │ vertical divider │ contact items stacked RIGHT
  | "dark-sidebar"; // Name lives inside the dark sidebar panel (no separate header block)

/** How the skills section is rendered */
export type TemplateSkillsVariant =
  | "plain"      // "skill1 · skill2 · skill3" mid-dot-separated
  | "compact"    // Comma-separated, tighter for ATS templates
  | "tags"       // Pill badges with accent color border + tint fill
  | "dots"       // 2-col grid, each skill with a 5-dot proficiency scale
  | "bars"       // Horizontal fill progress bar per skill
  | "categories" // Grouped by category sub-headings (uses data.categories)
  | "icon-grid"; // 2-col grid with small square accent-colored bullet icon

/** How each experience entry is rendered */
export type TemplateExperienceVariant =
  | "default"  // Classic: title/date row, company below, bullet list
  | "timeline" // Vertical connector line + circle dot per entry
  | "compact"; // Single row per job: Title @ Company · Dates (no bullets)

/** How section title headings are styled */
export type TemplateSectionTitleVariant =
  | "underline"    // Thin bottom border (most common, clean)
  | "left-border"  // Thick 4px left-side accent border
  | "uppercase"    // All-caps + wide letter spacing + subtle bottom rule
  | "filled-bg"    // Colored background band behind the title text
  | "bold"         // Large bold text, no decoration (executive)
  | "plain"        // No decoration, light muted uppercase text
  | "double-rule"  // Thin rule ABOVE + thin rule BELOW the title (newspaper classic)
  | "tab"          // Title inside a small rounded colored pill/badge
  | "dot-prefix";  // Small solid circle accent bullet before the title text

/** Overall structural layout of the resume */
export type TemplateLayoutVariant =
  | "single"        // One column, full width
  | "two-column"    // Left sidebar (33%) + main content (67%)
  | "dark-sidebar"  // Full dark left panel (34%) + white right panel (66%)
  | "profile-sidebar"; // Light profile sidebar with diagonal accent + right content

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
  layoutType?: "single" | "two-column" | "header-split" | "dark-sidebar";
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

  // Legacy class-based styling (used by template-styles.ts for PDF export)
  wrapperClass?: string;
  sectionTitleClass?: string;
  accentClass?: string;

  category?: "professional" | "fresher" | "creative" | "minimal" | "corporate" | "executive" | "modern" | "classic" | "ats" | "tech";
  trialAvailable?: boolean;
  thumbnailUrl?: string;

  // ── Structural / visual variant controls ──────────────────────────────────
  layoutVariant?: TemplateLayoutVariant;
  headerVariant?: TemplateHeaderVariant;
  skillsVariant?: TemplateSkillsVariant;
  experienceVariant?: TemplateExperienceVariant;
  sectionTitleVariant?: TemplateSectionTitleVariant;

  // ── Per-template decorative features ─────────────────────────────────────
  /** Render a thin 4px full-height accent strip on the left page edge */
  accentStrip?: boolean;
  /** Render a circle containing the person's initials in the header */
  showInitialsAvatar?: boolean;
  /** Tinted sidebar background in the template's primary color (two-column only) */
  sidebarBg?: boolean;
  /** Show a small Unicode icon before each section title (e.g. ◉ Experience) */
  sectionIcons?: boolean;
  /** Show a dashed photo-placeholder circle in the header area */
  showPhotoPlaceholder?: boolean;
}

export type TemplateId = string;
