// Free Trial – Template-specific styles for ResumePreview

export const TEMPLATE_STYLES: Record<
  string,
  {
    wrapper: string;
    heading: string;
    accent: string;
    sectionTitle: string;
  }
> = {
  "trial-classic": {
    wrapper: "font-serif",
    heading: "text-slate-900 border-slate-300",
    accent: "border-l-4 border-slate-700 pl-4",
    sectionTitle: "font-semibold text-slate-900 border-b-2 border-slate-300 pb-1 mb-2 uppercase tracking-wide text-xs",
  },
  "trial-modern": {
    wrapper: "font-sans",
    heading: "text-slate-800 border-slate-200",
    accent: "",
    sectionTitle: "font-medium text-slate-800 border-b border-slate-200 pb-2 mb-3 text-sm",
  },
  "trial-bold": {
    wrapper: "font-sans",
    heading: "text-slate-900 border-primary-600",
    accent: "border-l-4 border-primary-600 pl-4",
    sectionTitle: "font-bold text-slate-900 border-b-2 border-primary-600 pb-1 mb-3 text-sm",
  },
  "trial-minimal": {
    wrapper: "font-sans",
    heading: "text-slate-700 border-slate-100",
    accent: "",
    sectionTitle: "font-medium text-slate-600 border-b border-slate-100 pb-2 mb-4 text-xs tracking-widest uppercase",
  },
  "trial-professional": {
    wrapper: "font-serif",
    heading: "text-slate-900 border-slate-600",
    accent: "border-l-2 border-slate-600 pl-3",
    sectionTitle: "font-semibold text-slate-800 border-b border-slate-600 pb-1 mb-2 text-sm",
  },
  "professional-v1": {
    wrapper: "font-sans",
    heading: "text-slate-900 border-slate-200",
    accent: "",
    sectionTitle: "font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-2",
  },
};

export function getTemplateStyle(templateId: string) {
  return TEMPLATE_STYLES[templateId] ?? TEMPLATE_STYLES["trial-modern"];
}
