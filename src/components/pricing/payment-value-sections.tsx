import type { ReactNode } from "react";
import { Check, FileType2, FileText, FileStack, ShieldCheck, Users, Zap } from "lucide-react";

/** Three export-focused bullets used beside checkout cards (reference designs). */
export function ProExportFeatureList({ accent }: { accent: "blue" | "orange" }) {
  const iconWrap =
    accent === "orange"
      ? "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"
      : "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200";
  const items: { icon: ReactNode; title: string; desc: string }[] = [
    {
      icon: <FileText className="h-4 w-4" aria-hidden />,
      title: "PDF export",
      desc: "Download your resume in high-quality PDF format.",
    },
    {
      icon: <FileType2 className="h-4 w-4" aria-hidden />,
      title: "Word (DOCX) export",
      desc: "Fully editable Word files to customize your resume.",
    },
    {
      icon: <ShieldCheck className="h-4 w-4" aria-hidden />,
      title: "No watermarks",
      desc: "Download clean resumes without any watermarks.",
    },
  ];
  return (
    <ul className="space-y-0" role="list">
      {items.map((row, i) => (
        <li
          key={row.title}
          className={`flex gap-3 py-4 ${i > 0 ? "border-t border-slate-200/80 dark:border-slate-700/80" : ""}`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconWrap}`}
            aria-hidden
          >
            {row.icon}
          </span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{row.title}</p>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{row.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Extended list for Pro section (includes “Everything in Free”). */
export function ProFullFeatureList() {
  const items: { title: string; desc: string }[] = [
    {
      title: "Everything in Free",
      desc: "All the essential tools to build a professional resume.",
    },
    {
      title: "PDF export",
      desc: "Download your resume in high-quality PDF format.",
    },
    {
      title: "Word (DOCX) export",
      desc: "Fully editable Word files to customize your resume.",
    },
    {
      title: "No watermarks",
      desc: "Download clean resumes without any watermarks.",
    },
  ];
  return (
    <ul className="space-y-0" role="list">
      {items.map((row, idx) => (
        <li
          key={row.title}
          className={`flex gap-3 py-3.5 ${idx > 0 ? "border-t border-slate-200/80 dark:border-slate-700/80" : ""}`}
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-600 text-white dark:bg-primary-500">
            <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{row.title}</p>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{row.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EmailMatchNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start justify-center gap-2 text-center text-xs text-primary-800 dark:text-primary-200 ${className}`}
    >
      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary-600 dark:text-primary-400" aria-hidden />
      <span>Use the same email as your ResumeDoctor account.</span>
    </p>
  );
}

/** Product-truthful stats only (no unverified user counts or review scores). */
const STATS = [
  { icon: FileStack, k: "30+", label: "Resume templates" },
  { icon: ShieldCheck, k: "ATS", label: "Parse-friendly layouts" },
  { icon: Users, k: "India", label: "Naukri, LinkedIn & more" },
  { icon: Zap, k: "< 5 min", label: "Typical first draft" },
] as const;

export type TrustStatsBarVariant = "full" | "compact" | "inline";

/**
 * Social proof strip — `full` on /pricing; `compact` on home, templates, try; `inline` on dashboard & tools.
 */
export function PricingTrustStatsBar({
  variant = "full",
  className = "",
  id,
}: {
  variant?: TrustStatsBarVariant;
  className?: string;
  id?: string;
}) {
  const isFull = variant === "full";
  const isInline = variant === "inline";

  const iconClass = isFull ? "h-5 w-5" : "h-4 w-4";
  const numClass = isFull ? "text-lg" : "text-sm sm:text-base";
  const labelClass = isFull ? "text-[11px]" : "text-[10px] sm:text-[11px]";
  const cellPad = isFull ? "py-4" : "py-2.5 sm:py-3";

  if (isInline) {
    return (
      <div
        id={id}
        className={`overflow-hidden rounded-xl border border-primary-200/80 bg-gradient-to-br from-primary-50/90 to-white shadow-sm dark:border-primary-800/50 dark:from-primary-950/40 dark:to-slate-900 ${className}`}
        role="region"
        aria-label="ResumeDoctor usage statistics"
      >
        <p className="border-b border-primary-200/60 px-3 py-1.5 text-center text-[10px] font-medium text-primary-800 dark:text-primary-200">
          Built for Indian job seekers
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-4" role="list">
          {STATS.map((s, idx) => (
            <li
              key={s.label}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-2.5 text-center text-primary-900 dark:text-primary-50 ${
                idx > 0 ? "border-primary-200/50 sm:border-l dark:border-primary-800/50" : ""
              }`}
            >
              <s.icon className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden />
              <span className="text-sm font-bold leading-tight sm:text-base">{s.k}</span>
              <span className="text-[10px] text-primary-800/90 dark:text-primary-200/90">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`overflow-hidden rounded-2xl bg-primary-600 text-white shadow-lg ${isFull ? "mt-8" : ""} ${className}`}
      role="region"
      aria-label="ResumeDoctor usage statistics"
    >
      <p
        className={`border-b border-white/15 px-4 text-center font-medium text-white/90 ${
          isFull ? "py-2.5 text-xs" : "py-2 text-[11px]"
        }`}
      >
        Trusted by job seekers across India
      </p>
      <ul className="grid grid-cols-2 gap-0 sm:grid-cols-4" role="list">
        {STATS.map((s, idx) => (
          <li
            key={s.label}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 ${cellPad} text-center ${
              idx > 0 ? "border-slate-400/20 sm:border-l" : ""
            }`}
          >
            <s.icon className={`${iconClass} text-white/90`} aria-hidden />
            <span className={`${numClass} font-bold leading-tight`}>{s.k}</span>
            <span className={`${labelClass} text-white/75`}>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Soft gradient + dots used behind pricing / payment sections. */
export function PaymentSectionBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl"
        aria-hidden
      >
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-900/20" />
        <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-sky-200/25 blur-3xl dark:bg-slate-800/40" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, rgb(15 23 42 / 0.08) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>
      {children}
    </div>
  );
}

export function TrialSectionBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 p-1 dark:border-amber-800/40 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-orange-200/50 blur-2xl dark:bg-orange-900/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-amber-200/40 blur-2xl dark:bg-amber-900/20"
        aria-hidden
      />
      <div className="relative rounded-[1.4rem] bg-white/80 p-6 sm:p-8 dark:bg-slate-900/80 md:p-10">{children}</div>
    </div>
  );
}
