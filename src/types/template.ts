// WBS 4.1 – Template JSON schema definition
// Defines structure for sections, styling, fonts, and layout

export type TemplateFontFamily = "sans" | "serif" | "mono";

/** How the contact/name header is rendered */
export type TemplateHeaderVariant = "default" | "top-bar" | "centered";

/** How the skills section is rendered */
export type TemplateSkillsVariant = "plain" | "tags" | "dots";

export interface TemplateColors {
  /** Primary accent (headings, borders, links) */
  primary: string;
  /** Secondary accent (bullets, highlights) */
  accent?: string;
  /** Body text color */
  text: string;
  /** Muted/secondary text */
  muted?: string;
  /** Border color */
  border?: string;
}

export type TemplateLayoutType = "single" | "two-column" | "header-split";

export interface TemplateLayout {
  /** Section spacing */
  spacing?: "compact" | "normal" | "spacious";
  /** Section title style */
  sectionTitleStyle?: "underline" | "left-border" | "uppercase" | "plain" | "bold";
  /** Line height for body */
  lineHeight?: "tight" | "normal" | "relaxed";
  /** Single or two-column (sidebar) layout */
  columns?: "single" | "two-column";
  /** WBS 4.1 – Explicit layout type */
  layoutType?: TemplateLayoutType;
  /** Section types to show in sidebar (when two-column) */
  sidebarSections?: string[];
  /** Optional section display order (default: use content order) */
  sectionOrder?: string[];
}

export interface TemplateMetadata {
  /** Unique ID (e.g. professional-in, fresher-in) */
  id: string;
  /** Display name */
  name: string;
  /** Short description for selector */
  description: string;
  /** Template version for future migrations */
  version: string;
  /** Font family for body text */
  fontFamily: TemplateFontFamily;
  /** Color theme */
  colors: TemplateColors;
  /** Layout options */
  layout?: TemplateLayout;
  /** Tailwind classes for wrapper (legacy compatibility) */
  wrapperClass?: string;
  /** Tailwind classes for section titles */
  sectionTitleClass?: string;
  /** Tailwind classes for accent (e.g. left border) */
  accentClass?: string;
  /** Category for filtering */
  category?: "professional" | "fresher" | "creative" | "minimal" | "corporate" | "executive" | "modern" | "classic" | "ats" | "tech";
  /** Whether available for trial users */
  trialAvailable?: boolean;
  /** WBS 4.8 – Thumbnail URL for template selector */
  thumbnailUrl?: string;
  /** Header/name block rendering style */
  headerVariant?: TemplateHeaderVariant;
  /** Skills section rendering style */
  skillsVariant?: TemplateSkillsVariant;
  /** Two-column: give the sidebar a tinted background in the template primary color */
  sidebarBg?: boolean;
}

export type TemplateId = string;
