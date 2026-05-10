"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * SuperProfile checkout audit (customer-facing “View / Share” links, host superprofile.bio, path /vp/<24-hex-id>).
 * Do not use /create-payment-page/… in production env — that is the seller editor. `resolveSuperprofileCheckoutHref`
 * rewrites editor URLs to /vp/<id> when the id is present; otherwise falls back to the published URL below.
 *
 * | productKey    | env |
 * |---------------|-----|
 * | pro_trial_14  | NEXT_PUBLIC_SUPERPROFILE_URL_TRIAL_14 |
 * | pro_monthly   | NEXT_PUBLIC_SUPERPROFILE_URL_PRO_MONTHLY |
 * | pro_annual    | NEXT_PUBLIC_SUPERPROFILE_URL_PRO_ANNUAL |
 * | resume_pack   | NEXT_PUBLIC_SUPERPROFILE_URL_RESUME_PACK |
 * | pro_link      | NEXT_PUBLIC_SUPERPROFILE_URL_PRO_LINK |
 */
const VP_HOST = "superprofile.bio";

export const SUPERPROFILE_PUBLISHED_CHECKOUT = {
  pro_trial_14: `https://${VP_HOST}/vp/69e5cabddd64680013de4395`,
  pro_monthly: `https://${VP_HOST}/vp/69db33e8da78960013e814b3`,
  pro_annual: `https://${VP_HOST}/vp/69dca13af2e2e30013365462`,
  resume_pack: `https://${VP_HOST}/vp/69e5caf05275a70013fc8928`,
  // Pro Link standalone — published 2026-05-10. ₹99/mo recurring add-on,
  // free for pro_annual subscribers (entitlement computed by getProLinkStatus).
  pro_link: `https://${VP_HOST}/vp/6a00b215e8936a0013c248a2`,
} as const;

export const FALLBACK_TRIAL_14_URL = SUPERPROFILE_PUBLISHED_CHECKOUT.pro_trial_14;
export const FALLBACK_PRO_MONTHLY_URL = SUPERPROFILE_PUBLISHED_CHECKOUT.pro_monthly;
export const FALLBACK_PRO_ANNUAL_URL = SUPERPROFILE_PUBLISHED_CHECKOUT.pro_annual;
export const FALLBACK_RESUME_PACK_URL = SUPERPROFILE_PUBLISHED_CHECKOUT.resume_pack;
export const FALLBACK_PRO_LINK_URL = SUPERPROFILE_PUBLISHED_CHECKOUT.pro_link;

/** SuperProfile “create payment page” URLs are for sellers; buyers need the published /vp/ link. */
export function isSuperprofileSellerSetupUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.pathname.includes("create-payment-page");
  } catch {
    return false;
  }
}

function canonicalVpUrl(pageId: string): string {
  const id = pageId.replace(/[^a-f0-9]/gi, "").toLowerCase();
  if (!/^[a-f0-9]{24}$/.test(id)) return "";
  return `https://${VP_HOST}/vp/${id}`;
}

function pageIdFromVpPath(pathname: string): string | null {
  if (!pathname.startsWith("/vp/")) return null;
  const raw = pathname.slice("/vp/".length).split("/")[0]?.split("?")[0] ?? "";
  return /^[a-f0-9]{24}$/i.test(raw) ? raw.toLowerCase() : null;
}

/**
 * Returns a safe customer checkout href: trims env, rewrites `…/create-payment-page/<24hex>…` to `/vp/<id>`,
 * accepts published `/vp/` URLs, and falls back if the value is missing or not a valid SuperProfile checkout shape.
 */
export function resolveSuperprofileCheckoutHref(raw: string | undefined, fallback: string): string {
  const t = raw?.trim();
  if (!t) return fallback;
  try {
    const u = new URL(t);
    const normalizedHost = u.hostname.replace(/^www\./i, "").toLowerCase();

    if (u.pathname.includes("create-payment-page")) {
      const m = u.pathname.match(/\/create-payment-page\/([a-f0-9]{24})/i);
      if (m?.[1]) {
        const href = canonicalVpUrl(m[1]);
        return href || fallback;
      }
      return fallback;
    }

    const vpId = pageIdFromVpPath(u.pathname);
    if (vpId) {
      if (normalizedHost === VP_HOST) return canonicalVpUrl(vpId) || fallback;
      return u.toString();
    }

    if (normalizedHost === VP_HOST) return fallback;
    return fallback;
  } catch {
    return fallback;
  }
}

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
  const url = resolveSuperprofileCheckoutHref(
    process.env.NEXT_PUBLIC_SUPERPROFILE_URL_TRIAL_14,
    FALLBACK_TRIAL_14_URL
  );
  if (!url) return null;
  return (
    <div className="mt-0 space-y-2">
      <OutLink
        href={url}
        label="Pay ₹49 — 14-day full Pro"
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
  const url = resolveSuperprofileCheckoutHref(
    process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_MONTHLY,
    FALLBACK_PRO_MONTHLY_URL
  );
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
  const url = resolveSuperprofileCheckoutHref(
    process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_ANNUAL,
    FALLBACK_PRO_ANNUAL_URL
  );
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
  const monthly = resolveSuperprofileCheckoutHref(
    process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_MONTHLY,
    FALLBACK_PRO_MONTHLY_URL
  );
  const annual = resolveSuperprofileCheckoutHref(
    process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_ANNUAL,
    FALLBACK_PRO_ANNUAL_URL
  );
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
  const url = resolveSuperprofileCheckoutHref(
    process.env.NEXT_PUBLIC_SUPERPROFILE_URL_RESUME_PACK,
    FALLBACK_RESUME_PACK_URL
  );
  if (!url) return null;
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto">
      <OutLink href={url} label="Buy resume pack" variant="secondary" eventLabel="resume_pack" />
      {showEmailHint ? defaultHint : null}
    </div>
  );
}

/**
 * Pro Link standalone (₹99/mo) — SuperProfile checkout.
 * Returns null when the env var is unset AND the fallback is empty: that combo means
 * the SuperProfile product page hasn't been created yet, and we'd rather show a
 * "Coming soon" hint elsewhere than render a broken button.
 */
export function SuperprofileProLinkCta({ showEmailHint = true, label = "Add Pro Link \u2014 \u20b999/mo" }: { showEmailHint?: boolean; label?: string }) {
  const env = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_LINK;
  const url = resolveSuperprofileCheckoutHref(env, FALLBACK_PRO_LINK_URL);
  if (!url) return null;
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto">
      <OutLink href={url} label={label} variant="primary" eventLabel="pro_link" />
      {showEmailHint ? defaultHint : null}
    </div>
  );
}

/** True when a Pro Link checkout URL is configured (for hiding the upsell when not yet live). */
export function isProLinkCheckoutConfigured(): boolean {
  const env = process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_LINK;
  if (env && env.trim()) return true;
  return Boolean(FALLBACK_PRO_LINK_URL);
}
