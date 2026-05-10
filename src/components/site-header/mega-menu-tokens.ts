/**
 * Megamenu surface tokens.
 *
 * Two variants:
 *   - tokensA: glassy dark panels designed to sit under the blue marketing header.
 *   - tokensB: light panels designed to sit under the white/slate dashboard header.
 *
 * Every visual decision lives here. No other megamenu component should hard-code
 * Tailwind class strings for surfaces, text colours, dividers, or motion timing.
 *
 * See plan section 5 (Visual design system) for the rationale and the source-of-truth
 * mapping between tokens and existing site styles (hero, Resume Link section,
 * Pro Link card, dashboard header).
 */

export type MegaMenuVariant = "A" | "B";

export type MegaMenuTokens = {
  panel: {
    surface: string;
    shadow: string;
    accent: string;
    rounded: string;
    padding: string;
  };
  backdrop: string;
  column: {
    heading: string;
    divider: string;
  };
  link: {
    base: string;
    description: string;
    activeText: string;
    activeIndicator: string;
    hoverBg: string;
    focusRing: string;
    rounded: string;
  };
  trigger: {
    activeText: string;
    activeUnderline: string;
  };
  featuredRail: {
    proLinkUpsell: string;
    proLinkActive: string;
    pillEyebrow: string;
    pillEyebrowEmerald: string;
    pillEyebrowAmber: string;
    headline: string;
    body: string;
    primaryCta: string;
    ghostCta: string;
    trialWedge: string;
    templateTile: string;
    blogTile: string;
  };
  motion: {
    panel: string;
    drawer: string;
    accordion: string;
  };
};

export const tokensA: MegaMenuTokens = {
  panel: {
    surface:
      "bg-slate-950/95 backdrop-blur-xl ring-1 ring-white/10 text-white",
    shadow: "shadow-[0_30px_80px_rgba(0,0,0,0.5)]",
    accent: "border-t border-cyan-400/20",
    rounded: "rounded-b-2xl",
    padding: "p-6 sm:p-8",
  },
  backdrop: "bg-slate-950/40 backdrop-blur-[2px]",
  column: {
    heading:
      "text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/80",
    divider: "border-l border-white/10",
  },
  link: {
    base: "text-sm font-medium text-white/85 hover:text-white transition-colors",
    description: "text-xs leading-snug text-white/55",
    activeText: "text-white",
    activeIndicator: "bg-cyan-300",
    hoverBg: "hover:bg-white/5",
    focusRing:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-0",
    rounded: "rounded-lg",
  },
  trigger: {
    activeText: "text-white",
    activeUnderline: "after:bg-white",
  },
  featuredRail: {
    proLinkUpsell:
      "rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-violet-500/10 backdrop-blur-md ring-1 ring-cyan-400/20 p-5",
    proLinkActive:
      "rounded-2xl border border-emerald-400/30 bg-emerald-500/10 backdrop-blur-md ring-1 ring-emerald-400/20 p-5",
    pillEyebrow:
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200",
    pillEyebrowEmerald:
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200",
    pillEyebrowAmber:
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/40 bg-amber-500/15 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200",
    headline: "text-base font-extrabold tracking-tight text-white mt-3",
    body: "text-sm text-white/75 mt-2 leading-relaxed",
    primaryCta:
      "mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover px-4 py-2.5 text-sm font-bold text-accent-dark transition-all shadow-lg shadow-black/30",
    ghostCta:
      "mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors",
    trialWedge:
      "rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10 backdrop-blur-md ring-1 ring-amber-400/20 p-5",
    templateTile:
      "rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md ring-1 ring-white/10 p-5",
    blogTile:
      "rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md ring-1 ring-white/10 p-4",
  },
  motion: {
    panel:
      "transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
    drawer:
      "transition-transform duration-200 ease-out motion-reduce:transition-none",
    accordion:
      "transition-[max-height,opacity] duration-150 ease-out motion-reduce:transition-none",
  },
};

export const tokensB: MegaMenuTokens = {
  panel: {
    surface:
      "bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl ring-1 ring-slate-900/[0.04] dark:ring-white/[0.06] text-slate-900 dark:text-slate-100",
    shadow:
      "shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)]",
    accent: "",
    rounded: "rounded-b-2xl",
    padding: "p-6 sm:p-8",
  },
  backdrop: "bg-slate-950/30 backdrop-blur-[2px]",
  column: {
    heading:
      "text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400",
    divider: "border-l border-slate-200/80 dark:border-slate-800",
  },
  link: {
    base: "text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors",
    description: "text-xs leading-snug text-slate-500 dark:text-slate-400",
    activeText: "text-primary-600 dark:text-primary-400",
    activeIndicator: "bg-primary-600 dark:bg-primary-400",
    hoverBg: "hover:bg-primary-50/60 dark:hover:bg-primary-950/30",
    focusRing:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950",
    rounded: "rounded-lg",
  },
  trigger: {
    activeText: "text-primary-600 dark:text-primary-400",
    activeUnderline: "after:bg-primary-600",
  },
  featuredRail: {
    proLinkUpsell:
      "rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50/80 via-white to-primary-50/40 dark:border-primary-800 dark:from-primary-950/30 dark:via-slate-900/40 dark:to-primary-950/15 p-5",
    proLinkActive:
      "rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20 p-5",
    pillEyebrow:
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-300 bg-primary-100 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-800 dark:border-primary-700 dark:bg-primary-900/40 dark:text-primary-200",
    pillEyebrowEmerald:
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-300 bg-emerald-100 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
    pillEyebrowAmber:
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-300 bg-amber-100 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
    headline:
      "text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-3",
    body: "text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed",
    primaryCta:
      "mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 px-4 py-2.5 text-sm font-bold text-white transition-all shadow-lg shadow-primary-600/20",
    ghostCta:
      "mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors",
    trialWedge:
      "rounded-2xl border border-amber-300/90 bg-gradient-to-b from-amber-100 to-amber-50/90 dark:border-amber-700/50 dark:from-amber-950/50 dark:to-amber-950/30 p-5",
    templateTile:
      "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm",
    blogTile:
      "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm",
  },
  motion: {
    panel:
      "transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
    drawer:
      "transition-transform duration-200 ease-out motion-reduce:transition-none",
    accordion:
      "transition-[max-height,opacity] duration-150 ease-out motion-reduce:transition-none",
  },
};

export function pickTokens(variant: MegaMenuVariant): MegaMenuTokens {
  return variant === "A" ? tokensA : tokensB;
}

/**
 * Mobile drawer tokens. The mobile drawer is a single visual surface
 * regardless of which header it was triggered from (light/solid drawer with
 * a hero-gradient strip at top per plan section 5.5).
 */
export const mobileDrawerTokens = {
  scrim: "bg-slate-950/60 backdrop-blur-sm",
  shell: "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100",
  headerStrip:
    "bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-900 text-white",
  sectionBorder: "border-b border-slate-200 dark:border-slate-800",
  sectionHeading:
    "flex items-center justify-between w-full text-base font-semibold text-slate-700 dark:text-slate-200 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-900",
  sectionHeadingActive:
    "text-primary-600 dark:text-primary-400 bg-primary-50/60 dark:bg-primary-950/30",
  sublinkGroup: "pl-4 pb-3 space-y-1",
  sublink:
    "block text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 border-l border-slate-200 dark:border-slate-800",
  sublinkColumnHeading:
    "block px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400",
  pinnedFooter:
    "border-t-2 border-primary-100 dark:border-primary-900/40 bg-white dark:bg-slate-950 px-4 py-4 space-y-3",
  pinnedAuthRow: "flex items-center justify-between gap-3",
  pinnedAuthLink:
    "text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400",
  pinnedPrimaryCta:
    "block w-full rounded-xl bg-accent hover:bg-accent-hover px-4 py-3 text-base font-bold text-accent-dark text-center transition-all shadow-lg shadow-black/10",
  motion:
    "transition-transform duration-200 ease-out motion-reduce:transition-none",
};
