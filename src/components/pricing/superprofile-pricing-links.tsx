"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

function OutLink(props: {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "amber";
  eventLabel: string;
}) {
  const base =
    props.variant === "primary"
      ? "bg-primary-600 text-white hover:bg-primary-700 border-transparent"
      : props.variant === "amber"
        ? "border-amber-600 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
        : "border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800";
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("superprofile_checkout_click", { label: props.eventLabel })}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border-2 px-4 py-3 font-medium w-full text-center ${base}`}
    >
      {props.label}
      <ExternalLink className="h-3.5 w-3.5 opacity-80 shrink-0" aria-hidden />
    </a>
  );
}

const hint = (
  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 text-center">
    Use the same email as your ResumeDoctor account.
  </p>
);

/** 14-day ₹1 trial — SuperProfile checkout (India). */
export function SuperprofileTrialCta() {
  const url = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_TRIAL_14;
  if (!url) return null;
  return (
    <div className="mt-4 space-y-2">
      <OutLink
        href={url}
        label="Pay on SuperProfile — ₹1 trial"
        variant="amber"
        eventLabel="trial_14"
      />
      {hint}
    </div>
  );
}

/** Pro monthly / annual on SuperProfile */
export function SuperprofileProCtas() {
  const monthly = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_MONTHLY;
  const annual = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_ANNUAL;
  if (!monthly && !annual) return null;
  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs text-center text-slate-500 dark:text-slate-400">SuperProfile</p>
      {monthly && (
        <OutLink href={monthly} label="Pro monthly" variant="primary" eventLabel="pro_monthly" />
      )}
      {annual && (
        <OutLink href={annual} label="Pro annual" variant="primary" eventLabel="pro_annual" />
      )}
      {hint}
    </div>
  );
}

/** One-time Resume Pack — SuperProfile + optional email fallback. */
export function SuperprofileResumePackCta() {
  const url = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_RESUME_PACK;
  if (!url) return null;
  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto">
      <OutLink href={url} label="Pay on SuperProfile" variant="secondary" eventLabel="resume_pack" />
      {hint}
    </div>
  );
}
