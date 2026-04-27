"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/** SuperProfile “create payment page” URLs are for sellers; buyers need the published / share link. */
export function isSuperprofileSellerSetupUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.pathname.includes("create-payment-page");
  } catch {
    return false;
  }
}

const FALLBACK_TRIAL_14_URL = "https://superprofile.bio/vp/69db33e8da78960013e814b3";
const FALLBACK_PRO_MONTHLY_URL = "https://superprofile.bio/vp/69db33e8da78960013e814b3";
const FALLBACK_PRO_ANNUAL_URL = "https://superprofile.bio/vp/69dca13af2e2e30013365462";
const FALLBACK_RESUME_PACK_URL = "https://superprofile.bio/vp/69e5caf05275a70013fc8928";

function OutLink(props: {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "amber" | "trialPrimary";
  eventLabel: string;
}) {
  const base =
    props.variant === "primary"
      ? "bg-primary-600 text-white hover:bg-primary-700 border-transparent shadow-md shadow-primary-900/10"
      : props.variant === "trialPrimary"
        ? "bg-orange-500 text-white hover:bg-orange-600 border-transparent shadow-md shadow-orange-900/15 dark:bg-orange-600 dark:hover:bg-orange-500"
        : props.variant === "amber"
          ? "border-amber-600 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          : "border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800";
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        const proceed = window.confirm(
          "Before checkout, confirm you will use the same email as your ResumeDoctor account. Continue to SuperProfile?"
        );
        if (!proceed) {
          e.preventDefault();
          trackEvent("superprofile_checkout_cancelled", { label: props.eventLabel });
          return;
        }
        trackEvent("superprofile_checkout_click", { label: props.eventLabel, precheck_confirmed: true });
      }}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold w-full text-center transition-colors ${base}`}
    >
      {props.label}
      <ExternalLink className="h-3.5 w-3.5 opacity-90 shrink-0" aria-hidden />
    </a>
  );
}

const defaultHint = (
  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 text-center">
    Use the same email as your ResumeDoctor account.
  </p>
);

/** 14-day paid trial — SuperProfile checkout (India); price set on SuperProfile (e.g. ₹49). */
export function SuperprofileTrialCta({ showEmailHint = true }: { showEmailHint?: boolean }) {
  const url = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_TRIAL_14 || FALLBACK_TRIAL_14_URL;
  if (!url) return null;
  return (
    <div className="mt-0 space-y-2">
      <OutLink
        href={url}
        label="Start 14-day trial"
        variant="trialPrimary"
        eventLabel="trial_14"
      />
      {showEmailHint ? defaultHint : null}
    </div>
  );
}

function ProCtaBlock({
  href,
  label,
  eventLabel,
  showEmailHint,
}: {
  href: string;
  label: string;
  eventLabel: string;
  showEmailHint: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-center text-xs font-medium text-primary-600 dark:text-primary-400">SuperProfile</p>
      <OutLink href={href} label={label} variant="primary" eventLabel={eventLabel} />
      {showEmailHint ? defaultHint : null}
    </div>
  );
}

/** Pro monthly only — for dedicated plan cards. */
export function SuperprofileProMonthlyCta({ showEmailHint = true }: { showEmailHint?: boolean }) {
  const url = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_MONTHLY || FALLBACK_PRO_MONTHLY_URL;
  if (!url) return null;
  return (
    <ProCtaBlock
      href={url}
      label="Choose Pro monthly plan"
      eventLabel="pro_monthly"
      showEmailHint={showEmailHint}
    />
  );
}

/** Pro annual only — for dedicated plan cards. */
export function SuperprofileProAnnualCta({ showEmailHint = true }: { showEmailHint?: boolean }) {
  const url = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_ANNUAL || FALLBACK_PRO_ANNUAL_URL;
  if (!url) return null;
  return (
    <ProCtaBlock
      href={url}
      label="Get Pro annual"
      eventLabel="pro_annual"
      showEmailHint={showEmailHint}
    />
  );
}

/** Pro monthly + annual (stacked) — settings / compact layouts. */
export function SuperprofileProCtas({ showEmailHint = true }: { showEmailHint?: boolean }) {
  const monthly = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_MONTHLY || FALLBACK_PRO_MONTHLY_URL;
  const annual = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_ANNUAL || FALLBACK_PRO_ANNUAL_URL;
  if (!monthly && !annual) return null;
  return (
    <div className="mt-4 space-y-3">
      <p className="text-center text-xs font-medium text-primary-600 dark:text-primary-400">SuperProfile</p>
      {monthly && (
        <div className="space-y-2">
          <OutLink href={monthly} label="Pro monthly" variant="primary" eventLabel="pro_monthly" />
        </div>
      )}
      {monthly && annual && <p className="text-center text-xs text-slate-500 dark:text-slate-400">or</p>}
      {annual && (
        <div className="space-y-2">
          <OutLink href={annual} label="Pro annual" variant="primary" eventLabel="pro_annual" />
        </div>
      )}
      {showEmailHint ? defaultHint : null}
    </div>
  );
}

/** One-time Resume Pack — SuperProfile + optional email fallback. */
export function SuperprofileResumePackCta({ showEmailHint = true }: { showEmailHint?: boolean }) {
  const url = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_RESUME_PACK || FALLBACK_RESUME_PACK_URL;
  if (!url) return null;
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto">
      <OutLink href={url} label="Buy resume pack" variant="secondary" eventLabel="resume_pack" />
      {showEmailHint ? defaultHint : null}
    </div>
  );
}
