import Link from "next/link";
import { FREE_LINK_SLUG_EXAMPLE, PRO_LINK_SLUG_EXAMPLE } from "@/lib/resume-link-utils";

type Variant = "dark" | "light";

export function ResumeLinkUrlTiers({ variant = "dark" }: { variant?: Variant }) {
  const isDark = variant === "dark";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div
        className={`rounded-xl border p-4 ${
          isDark
            ? "border-white/15 bg-white/[0.04] ring-1 ring-white/5"
            : "border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
        }`}
      >
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${
            isDark ? "text-emerald-300" : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          Free — publish today
        </p>
        <p
          className={`mt-2 font-mono text-sm sm:text-base ${
            isDark ? "text-white/90" : "text-slate-800 dark:text-slate-100"
          }`}
        >
          resumedoctor.in/r/
          <span className={isDark ? "font-bold text-cyan-300" : "font-bold text-primary-600 dark:text-primary-400"}>
            {FREE_LINK_SLUG_EXAMPLE}
          </span>
        </p>
        <p className={`mt-1.5 text-xs ${isDark ? "text-white/60" : "text-slate-500 dark:text-slate-400"}`}>
          Auto-generated link. Always shows your latest resume.
        </p>
      </div>

      <div
        className={`rounded-xl border p-4 ${
          isDark
            ? "border-amber-400/25 bg-amber-500/[0.07] ring-1 ring-amber-400/15"
            : "border-amber-200 bg-amber-50/80 dark:border-amber-800/50 dark:bg-amber-950/30"
        }`}
      >
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${
            isDark ? "text-amber-300" : "text-amber-700 dark:text-amber-400"
          }`}
        >
          Pro Link — ₹99/mo
        </p>
        <p
          className={`mt-2 font-mono text-sm sm:text-base ${
            isDark ? "text-white/90" : "text-slate-800 dark:text-slate-100"
          }`}
        >
          resumedoctor.in/r/
          <span className={isDark ? "font-bold text-amber-200" : "font-bold text-amber-700 dark:text-amber-300"}>
            {PRO_LINK_SLUG_EXAMPLE}
          </span>
        </p>
        <p className={`mt-1.5 text-xs ${isDark ? "text-white/60" : "text-slate-500 dark:text-slate-400"}`}>
          Custom URL, view analytics, no footer.{" "}
          <Link
            href="/pricing#pro-link"
            className={`font-semibold underline-offset-2 hover:underline ${
              isDark ? "text-amber-200" : "text-amber-800 dark:text-amber-300"
            }`}
          >
            See Pro Link
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Compact single-line URL pill for hero mocks (shows free tier). */
export function ResumeLinkUrlPill({
  slug = FREE_LINK_SLUG_EXAMPLE,
  className = "",
}: {
  slug?: string;
  className?: string;
}) {
  return (
    <span className={`font-mono ${className}`}>
      resumedoctor.in/r/
      <span className="font-bold text-cyan-300">{slug}</span>
    </span>
  );
}
