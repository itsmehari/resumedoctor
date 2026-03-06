// WBS 4.1, 4.3 – Template styles (driven by templates config)
import { getTemplateOrFallback, resolveTemplateId } from "./templates";

export interface TemplateStyle {
  wrapper: string;
  heading: string;
  accent: string;
  sectionTitle: string;
  /** For two-column layout */
  columns?: "single" | "two-column";
}

/** Legacy style map for deprecated template IDs (fallback) */
const LEGACY_STYLES: Record<string, TemplateStyle> = {
  "trial-classic": {
    wrapper: "font-serif",
    heading: "text-slate-900 border-slate-300",
    accent: "border-l-4 border-slate-700 pl-4",
    sectionTitle:
      "font-semibold text-slate-900 border-b-2 border-slate-300 pb-1 mb-2 uppercase tracking-wide text-xs",
    columns: "single",
  },
  "trial-modern": {
    wrapper: "font-sans",
    heading: "text-slate-800 border-slate-200",
    accent: "",
    sectionTitle: "font-medium text-slate-800 border-b border-slate-200 pb-2 mb-3 text-sm",
    columns: "single",
  },
  "trial-bold": {
    wrapper: "font-sans",
    heading: "text-slate-900 border-primary-600",
    accent: "border-l-4 border-primary-600 pl-4",
    sectionTitle: "font-bold text-slate-900 border-b-2 border-primary-600 pb-1 mb-3 text-sm",
    columns: "single",
  },
  "trial-minimal": {
    wrapper: "font-sans",
    heading: "text-slate-700 border-slate-100",
    accent: "",
    sectionTitle:
      "font-medium text-slate-600 border-b border-slate-100 pb-2 mb-4 text-xs tracking-widest uppercase",
    columns: "single",
  },
  "trial-professional": {
    wrapper: "font-serif",
    heading: "text-slate-900 border-slate-600",
    accent: "border-l-2 border-slate-600 pl-3",
    sectionTitle: "font-semibold text-slate-800 border-b border-slate-600 pb-1 mb-2 text-sm",
    columns: "single",
  },
};

export function getTemplateStyle(templateId: string): TemplateStyle {
  const resolved = resolveTemplateId(templateId);
  const legacy = LEGACY_STYLES[templateId];
  if (legacy) return legacy;

  const t = getTemplateOrFallback(resolved);
  const layoutVariant = t.layoutVariant;
  const layoutType = t.layout?.layoutType;
  const columnsFromLayout = t.layout?.columns ?? "single";
  const columns =
    layoutVariant === "two-column" ||
    layoutVariant === "dark-sidebar" ||
    layoutType === "two-column" ||
    layoutType === "dark-sidebar" ||
    columnsFromLayout === "two-column"
      ? "two-column"
      : "single";
  return {
    wrapper: t.wrapperClass ?? "font-sans",
    heading: "",
    accent: t.accentClass ?? "",
    sectionTitle:
      t.sectionTitleClass ??
      "font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-2",
    columns,
  };
}

/** WBS 4.3 – Get sidebar section types from template metadata */
export function getSidebarSections(templateId: string): string[] {
  const t = getTemplateOrFallback(resolveTemplateId(templateId));
  if (t.layout?.sidebarSections) return t.layout.sidebarSections;
  // Dark sidebar default: contact + skills on left
  if (t.layoutVariant === "dark-sidebar") {
    return ["contact", "skills", "languages", "certifications"];
  }
  return ["contact", "summary", "skills"];
}
