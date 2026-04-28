// WBS 10.5, 10.9 – Pricing page with geotargeted INR/USD
"use client";

import { useState, useEffect, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Check, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  FALLBACK_TRIAL_14_URL,
  resolveSuperprofileCheckoutHref,
  SuperprofileProAnnualCta,
  SuperprofileProMonthlyCta,
  SuperprofileResumePackCta,
  SuperprofileTrialCta,
} from "@/components/pricing/superprofile-pricing-links";
import {
  EmailMatchNote,
  PaymentSectionBackdrop,
  PricingTrustStatsBar,
  ProExportFeatureList,
  ProFullFeatureList,
  TrialSectionBackdrop,
} from "@/components/pricing/payment-value-sections";
import { PricingFaqAccordion, type PricingFaqItem } from "@/components/pricing/pricing-faq-accordion";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  priceValue: number;
  savings?: string;
}

interface Region {
  country: string;
  currency: string;
  plans: Plan[];
}

type CompareCellValue = boolean | string;

function CompareCell({ value }: { value: CompareCellValue }) {
  if (typeof value === "boolean") {
    return value ? (
      <span
        className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/[0.12] ring-1 ring-emerald-500/25 dark:bg-emerald-400/10 dark:ring-emerald-400/20"
        title="Included"
        aria-label="Included"
      >
        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} aria-hidden />
      </span>
    ) : (
      <span
        className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/70 ring-1 ring-slate-300/60 dark:bg-slate-700/50 dark:ring-slate-600/50"
        title="Not included"
        aria-label="Not included"
      >
        <X className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" strokeWidth={2.5} aria-hidden />
      </span>
    );
  }
  const words = value.trim().split(/\s+/).length;
  const compact =
    value.length <= 22 && !value.includes("(") && words <= 3 && !value.includes("—");
  return (
    <span
      className={cn(
        "mx-auto block max-w-[13rem] text-center text-xs leading-snug sm:text-sm",
        compact
          ? "rounded-lg border border-slate-200/90 bg-white/90 px-2.5 py-1.5 font-semibold text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-100"
          : "font-medium text-slate-700 dark:text-slate-200"
      )}
    >
      {value}
    </span>
  );
}

/** Visual break between major plan blocks on the page */
function SectionRule({ label, pillClassName }: { label: string; pillClassName: string }) {
  return (
    <div className="my-10 flex items-center gap-3 sm:my-12" role="presentation">
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      <span
        className={cn(
          "shrink-0 rounded-full border px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest shadow-sm",
          pillClassName
        )}
      >
        {label}
      </span>
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

const compareThFeature =
  "min-w-[10rem] bg-gradient-to-b from-slate-50 to-white p-4 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:from-slate-950 dark:to-slate-900 dark:text-slate-400";
const compareThPass =
  "border-l border-amber-300/90 bg-gradient-to-b from-amber-100 to-amber-50/90 p-4 text-center text-xs font-bold uppercase tracking-wide text-amber-950 dark:border-amber-700/50 dark:from-amber-950/50 dark:to-amber-950/30 dark:text-amber-50";
const compareThPro =
  "relative border-l border-primary-300/90 bg-gradient-to-b from-primary-100 to-primary-50/90 p-4 pb-5 text-center text-xs font-bold uppercase tracking-wide text-primary-950 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] dark:border-primary-700/40 dark:from-primary-950/55 dark:to-primary-950/25 dark:text-primary-50 dark:shadow-none";

const compareTdFeature =
  "border-r border-slate-100 bg-white/80 p-3.5 text-left align-top dark:border-slate-800/80 dark:bg-slate-950/50";
const compareTdPass =
  "border-l border-amber-200/80 bg-amber-50/85 p-3.5 text-center align-middle dark:border-amber-800/35 dark:bg-amber-950/22";
const compareTdPro =
  "border-l border-primary-200/80 bg-primary-50/75 p-3.5 text-center align-middle dark:border-primary-800/35 dark:bg-primary-950/18";

function PlansAtGlance({
  isIndia,
  proMonthlyDisplay,
}: {
  isIndia: boolean;
  proMonthlyDisplay: string;
}) {
  return (
    <section className="mt-10" aria-labelledby="plans-glance-heading">
      <h2
        id="plans-glance-heading"
        className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
      >
        Plans at a glance
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-400">
        {isIndia
          ? "Use Try for a quick OTP preview, then choose the optional ₹49 pass or Pro plans on SuperProfile."
          : "Use Try to explore quickly, then choose Pro on SuperProfile when you need full exports and templates."}
      </p>
      <div
        className={cn(
          "mx-auto mt-6 grid max-w-5xl gap-4",
          isIndia ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2"
        )}
      >
        <article className="flex flex-col rounded-2xl border-2 border-violet-300 bg-violet-50/80 p-5 shadow-sm dark:border-violet-700 dark:bg-violet-950/35">
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
            Explore · Try
          </span>
          <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">Try (OTP)</h3>
          <p className="mt-1 text-2xl font-extrabold text-violet-800 dark:text-violet-200">No card</p>
          <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            Short OTP session on <span className="font-medium">/try</span> to click around — not billed, not a subscription.
          </p>
          <Link
            href="/try"
            className="mt-4 text-xs font-semibold text-violet-800 underline-offset-2 hover:underline dark:text-violet-200"
          >
            Open Try →
          </Link>
        </article>

        {isIndia ? (
          <article className="flex flex-col rounded-2xl border-2 border-orange-400 bg-orange-50/90 p-5 shadow-sm dark:border-orange-600 dark:bg-orange-950/40">
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-700 dark:text-orange-300">
              India · Pass
            </span>
            <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">14-day full Pro</h3>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-orange-600 dark:text-orange-400">₹49</p>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              One-time SuperProfile checkout. Every Pro feature for 14 calendar days — no auto-renew.
            </p>
            <Link
              href="#trial"
              className="mt-4 text-xs font-semibold text-orange-700 underline-offset-2 hover:underline dark:text-orange-300"
            >
              Pass checkout →
            </Link>
          </article>
        ) : null}

        <article className="flex flex-col rounded-2xl border-2 border-primary-400 bg-primary-50/85 p-5 shadow-sm dark:border-primary-600 dark:bg-primary-950/35">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-800 dark:text-primary-300">
            Paid · Pro
          </span>
          <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">Pro</h3>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
            <span className="text-2xl font-extrabold tabular-nums text-primary-700 dark:text-primary-300">
              {proMonthlyDisplay}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">/ month from</span>
          </div>
          <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            PDF &amp; Word, watermark-free exports, all templates, higher ATS &amp; AI limits — billed on SuperProfile.
          </p>
          <Link
            href="#pro-superprofile"
            className="mt-4 text-xs font-semibold text-primary-800 underline-offset-2 hover:underline dark:text-primary-200"
          >
            Pro checkout →
          </Link>
        </article>
      </div>
    </section>
  );
}

/** India: third column is the ₹49 pass — same Pro capabilities, fixed 14-day window. */
const COMPARE_PLAN_ROWS: {
  feature: string;
  featureNote?: string;
  trial: CompareCellValue;
  pro: CompareCellValue;
}[] = [
  {
    feature: "How long it lasts",
    featureNote: "After checkout, access lines up with the term you picked.",
    trial: "14 calendar days from activation",
    pro: "1 month or 1 year from activation",
  },
  {
    feature: "PDF export",
    featureNote: "Download a print-ready file.",
    trial: true,
    pro: true,
  },
  {
    feature: "Word (DOCX) export",
    featureNote: "Edit offline in Microsoft Word or Google Docs.",
    trial: true,
    pro: true,
  },
  {
    feature: "TXT export",
    featureNote: "Plain text for forms or parsers.",
    trial: true,
    pro: true,
  },
  {
    feature: "Print & HTML preview",
    featureNote: "Browser preview and printing.",
    trial: true,
    pro: true,
  },
  {
    feature: "Templates",
    featureNote: "Layouts and styles included in the builder.",
    trial: "All 30",
    pro: "All 30",
  },
  {
    feature: "ATS score checker",
    featureNote: "How well your resume matches a job description.",
    trial: "Unlimited during the pass",
    pro: "Unlimited",
  },
  {
    feature: "AI bullet suggestions",
    featureNote: "Per calendar day; count resets at midnight (UTC).",
    trial: "50 per day during the pass",
    pro: "50 per day",
  },
  {
    feature: "Watermark on PDF & Word",
    featureNote: "Only applies when that export type is available.",
    trial: "None — full-quality files",
    pro: "None — full-quality files",
  },
];

function PlanCardPro({
  badge,
  extraBadge,
  priceLine,
  subLine,
  footnote,
  children,
}: {
  badge: string;
  extraBadge?: string;
  priceLine: React.ReactNode;
  subLine?: string;
  footnote?: React.ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900/90 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-primary-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          {badge}
        </span>
        {extraBadge ? (
          <span className="rounded-full border border-emerald-500/50 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-300">
            {extraBadge}
          </span>
        ) : null}
      </div>
      <div className="mb-1">{priceLine}</div>
      {subLine ? <p className="text-sm text-slate-500 dark:text-slate-400">{subLine}</p> : null}
      {footnote ? <div className="mt-3">{footnote}</div> : null}
      <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
        <ul className="mb-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {["PDF & Word export", "No watermarks", "30+ templates", "Higher ATS & AI limits"].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
        {children}
        <div className="mt-3">
          <EmailMatchNote />
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoValid, setPromoValid] = useState<{ valid: boolean; label?: string; error?: string } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => {
    fetch("/api/pricing/region", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.plans) setRegion(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isIndia = region?.currency === "INR";
  const proMonthly = region?.plans?.find((p) => p.id === "pro_monthly");
  const proAnnual = region?.plans?.find((p) => p.id === "pro_annual");

  const annualMonthlyEquiv =
    isIndia && proAnnual
      ? `or ₹${Math.round(1499 / 12)}/mo equivalent`
      : proAnnual && !isIndia
        ? "Billed once per year"
        : undefined;

  const faqItems = useMemo((): PricingFaqItem[] => {
    const base: PricingFaqItem[] = [
      {
        id: "try-vs-pro",
        question: "What is the difference between the Try page and paying for Pro?",
        answer: (
          <>
            <strong className="text-slate-800 dark:text-slate-100">Try</strong> — Use{" "}
            <Link href="/try" className="text-primary-600 underline hover:text-primary-700 dark:text-primary-400">
              /try
            </Link>{" "}
            with a quick OTP: you get a short, time-limited session to explore templates and editing. No card, no
            checkout.
            <br />
            <br />
            <strong className="text-slate-800 dark:text-slate-100">Pro (paid)</strong> — When you need PDF &amp; Word
            export, every template, and higher limits, pay once on{" "}
            <span className="font-medium text-slate-800 dark:text-slate-200">SuperProfile</span> using the{" "}
            <strong className="text-slate-800 dark:text-slate-100">same email</strong> as your ResumeDoctor account.
            Fulfillment runs automatically after payment.
          </>
        ),
      },
      {
        id: "how-pay",
        question: "How do I pay for Pro or add-ons?",
        answer:
          region?.currency === "INR" ? (
            <>
              Use the SuperProfile buttons on this page (monthly, annual, optional 14-day pass, or resume pack). Sign
              in here with the <strong className="text-slate-800 dark:text-slate-100">same email</strong> you enter at
              checkout so your access activates without support tickets.
            </>
          ) : (
            <>
              Use the SuperProfile checkout buttons for your region. Always use the same email on SuperProfile and
              ResumeDoctor.
            </>
          ),
      },
      {
        id: "subscription",
        question: "Will my plan auto-renew? How do refunds work?",
        answer:
          "Checkout happens on SuperProfile; ResumeDoctor does not keep your card on file for automatic renewals. Pick monthly or annual access at checkout depending on what you buy. For refunds or billing help, use Settings → Billing or email us — we typically reply within one to two business days.",
      },
    ];

    if (region?.currency === "INR") {
      base.splice(2, 0, {
        id: "inr-49",
        question: "What is the ₹49 India option?",
        answer: (
          <>
            It is an optional <strong className="text-slate-800 dark:text-slate-100">paid</strong> add-on: after
            checkout on SuperProfile, your account gets <strong className="text-slate-800 dark:text-slate-100">full Pro</strong>{" "}
            features for <strong className="text-slate-800 dark:text-slate-100">14 calendar days</strong>. It is separate
            from the Try page — useful when you already know you want every export and template for a short burst
            of applications. No automatic renewal.
          </>
        ),
      });
    }

    return base;
  }, [region?.currency]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader variant="home" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-14">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            {region?.currency === "USD"
              ? "Explore quickly with the OTP Try flow, then unlock Pro on SuperProfile when you need exports and full templates — use the same email at checkout as on your account."
              : region?.currency === "INR"
                ? "Explore with the OTP Try page (no card). When you want PDF & Word, every template, and higher limits, upgrade on SuperProfile — same email as this account."
                : "Explore quickly with the OTP Try flow, then unlock Pro on SuperProfile when you need exports and full templates — use the same email at checkout as on your account."}
          </p>
          {isIndia && (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">India checkout:</span> Pro monthly{" "}
              <span className="font-medium">₹199</span>, annual <span className="font-medium">₹1,499</span>, optional{" "}
              <span className="font-semibold text-orange-600 dark:text-orange-400">14-day full Pro pass ₹49</span>{" "}
              (one-time on{" "}
              <a
                href={resolveSuperprofileCheckoutHref(
                  process.env.NEXT_PUBLIC_SUPERPROFILE_URL_TRIAL_14,
                  FALLBACK_TRIAL_14_URL
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 underline decoration-primary-400/60 underline-offset-2 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                SuperProfile
              </a>
              ), plus a resume export pack. All are one-time purchases — no auto-renew from us.
            </p>
          )}
          {region && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Prices in {region.currency}
              {region.country && region.country !== "unknown" && ` · ${region.country}`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="mt-14 text-center text-slate-500">Loading pricing…</div>
        ) : (
          <>
            <div className="mt-8 flex max-w-md mx-auto flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase());
                  setPromoValid(null);
                }}
                placeholder="Promo code"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!promoCode.trim()) return;
                  setPromoLoading(true);
                  setPromoValid(null);
                  try {
                    const res = await fetch("/api/pricing/validate-promo", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ code: promoCode.trim() }),
                    });
                    const data = await res.json();
                    setPromoValid(
                      data.valid ? { valid: true, label: data.label } : { valid: false, error: data.error }
                    );
                  } catch {
                    setPromoValid({ valid: false, error: "Failed to validate" });
                  }
                  setPromoLoading(false);
                }}
                disabled={promoLoading || !promoCode.trim()}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 disabled:opacity-50"
              >
                {promoLoading ? "…" : "Apply"}
              </button>
            </div>
            {promoValid && (
              <p
                className={`mt-2 text-center text-sm ${
                  promoValid.valid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {promoValid.valid ? `Valid: ${promoValid.label}` : promoValid.error}
              </p>
            )}

            <PlansAtGlance
              isIndia={!!isIndia}
              proMonthlyDisplay={proMonthly?.price ?? (isIndia ? "₹199" : "$4.99")}
            />

            {isIndia ? (
              <SectionRule
                label="India · optional 14-day pass"
                pillClassName="border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-600 dark:bg-orange-950/60 dark:text-orange-100"
              />
            ) : null}

            {/* —— India: 14-day trial —— */}
            {isIndia && (
              <section className="mt-12" id="trial" aria-labelledby="trial-heading">
                <TrialSectionBackdrop>
                  <div className="grid items-start gap-10 lg:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                        Try first
                      </p>
                      <h2
                        id="trial-heading"
                        className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl"
                      >
                        Try Pro risk-free for{" "}
                        <span className="text-orange-600 dark:text-orange-400">14 days</span>
                      </h2>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">
                        This checkout is different from the{" "}
                        <Link href="/try" className="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400">
                          Try
                        </Link>{" "}
                        page: you pay once on SuperProfile and get every Pro feature—including exports—for 14 calendar
                        days on the email you pay with. No automatic renewal.
                      </p>
                      <div className="mt-6">
                        <ProExportFeatureList accent="orange" />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-600 dark:bg-slate-900">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          14-day full Pro
                        </span>
                        <span className="rounded-full border border-emerald-500/50 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                          ₹49 one-time
                        </span>
                      </div>
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-orange-600 dark:text-orange-400">₹49</span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ one-time</span>
                      </div>
                      <p className="mt-3 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden />
                        Full Pro access for 14 days. Use the same email as ResumeDoctor so access unlocks automatically.
                      </p>
                      <div className="mt-5">
                        <SuperprofileTrialCta showEmailHint={false} />
                        <EmailMatchNote className="!mt-3 !justify-start !text-left" />
                      </div>
                    </div>
                  </div>
                </TrialSectionBackdrop>
              </section>
            )}

            <SectionRule
              label="Pro · SuperProfile checkout"
              pillClassName="border-primary-300 bg-primary-50 text-primary-900 dark:border-primary-700 dark:bg-primary-950/50 dark:text-primary-100"
            />

            {/* —— Pro plans —— */}
            <section className="mt-14" id="pro-superprofile" aria-labelledby="pro-plans-heading">
              <PaymentSectionBackdrop>
                <div>
                  <h2
                    id="pro-plans-heading"
                    className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl"
                  >
                    Everything you need to get hired
                  </h2>
                  <p className="mx-auto mt-2 max-w-xl text-center text-slate-600 dark:text-slate-400">
                    Create, export, and apply with confidence. Choose the Pro plan that fits your timeline and pay on
                    SuperProfile with the same ResumeDoctor email.
                  </p>

                  <div className="mt-10 grid gap-10 lg:grid-cols-2">
                    <div>
                      <ProFullFeatureList />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      <PlanCardPro
                        badge="Pro monthly"
                        priceLine={
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                              {proMonthly?.price ?? (isIndia ? "₹199" : "$4.99")}
                            </span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ month</span>
                          </div>
                        }
                        subLine={
                          proAnnual
                            ? isIndia
                              ? `or ${proAnnual.price}/year if you prefer annual`
                              : `or ${proAnnual.price}/year`
                            : undefined
                        }
                        footnote={
                          <div className="rounded-lg border border-primary-100 bg-primary-50/80 px-3 py-2 text-xs text-primary-900 dark:border-primary-900/50 dark:bg-primary-950/30 dark:text-primary-100">
                            Best when you want flexibility month to month.
                          </div>
                        }
                      >
                        <SuperprofileProMonthlyCta showEmailHint={false} />
                      </PlanCardPro>

                      <PlanCardPro
                        badge="Pro annual"
                        extraBadge={proAnnual?.savings}
                        priceLine={
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                              {proAnnual?.price ?? (isIndia ? "₹1,499" : "$39")}
                            </span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ year</span>
                          </div>
                        }
                        subLine={annualMonthlyEquiv}
                        footnote={
                          <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/90 px-3 py-2 text-xs text-emerald-900 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                            Lowest total cost for long-term use.
                          </div>
                        }
                      >
                        <SuperprofileProAnnualCta showEmailHint={false} />
                      </PlanCardPro>
                    </div>
                  </div>

                  <PricingTrustStatsBar />
                </div>
              </PaymentSectionBackdrop>
            </section>

            {!isIndia && (
              <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-800/30">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pay on SuperProfile</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Use the buttons above for your region. If links are missing, contact support—we’ll share the correct
                  checkout.
                </p>
              </section>
            )}

            <SectionRule
              label="Account & add-ons"
              pillClassName="border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            />

            <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-800/30">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Account & resume pack</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Manage billing in Settings, or add a one-time pack of exports.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/settings"
                  onClick={() => trackEvent("upgrade_click", { source: "pricing" })}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                >
                  Account & billing
                </Link>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs text-slate-500">Resume pack · {isIndia ? "₹99" : "$2.99"} one-time</p>
                  <div className="mt-2">
                    <SuperprofileResumePackCta />
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison table */}
            <SectionRule
              label="Feature comparison"
              pillClassName="border-slate-400 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
            />
            <section
              id="compare-plans"
              className="mt-2 mx-auto max-w-5xl scroll-mt-24 overflow-x-auto px-0 sm:px-1"
              aria-label="Compare plans"
            >
              <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/60 to-primary-50/30 p-5 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04] dark:border-slate-700/90 dark:from-slate-950 dark:via-slate-900/90 dark:to-primary-950/20 dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] dark:ring-white/[0.06] sm:p-8">
                <h3 className="text-center text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
                  Compare plans
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {isIndia ? (
                    <>
                      The <Link href="/try" className="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400">Try</Link> page
                      (OTP) is for exploring the editor — it is{" "}
                      <strong className="font-medium text-slate-800 dark:text-slate-200">not</strong> a billing tier in
                      this table. The <strong className="font-medium text-slate-800 dark:text-slate-200">14-day pass</strong>{" "}
                      matches Pro features for two weeks; monthly and annual Pro differ only in{" "}
                      <strong className="font-medium text-slate-800 dark:text-slate-200">how long</strong> access lasts.
                    </>
                  ) : (
                    <>
                      The <Link href="/try" className="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400">Try</Link>{" "}
                      page is a short OTP preview — not a billing tier.{" "}
                      <strong className="font-medium text-slate-800 dark:text-slate-200">Pro</strong> plans are paid via
                      SuperProfile.
                    </>
                  )}
                </p>
                <div
                  className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400"
                  aria-hidden
                >
                  {isIndia ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-5 shrink-0 rounded border border-amber-400 bg-amber-100 dark:border-amber-600 dark:bg-amber-950/60" />
                      14-day pass
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-5 shrink-0 rounded border border-primary-400 bg-primary-100 dark:border-primary-700 dark:bg-primary-950/50" />
                    Pro
                  </span>
                </div>
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 shadow-inner dark:border-slate-700/80">
                  <table className="w-full min-w-[320px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th scope="col" className={cn(compareThFeature, "rounded-tl-2xl")}>
                          What you get
                        </th>
                        {isIndia && (
                          <th scope="col" className={compareThPass}>
                            <span className="block">14-day pass</span>
                            <span className="mt-1.5 block text-[10px] font-semibold normal-case leading-snug text-amber-950/90 dark:text-amber-100/95">
                              ₹49 · every Pro feature, 14 days
                            </span>
                          </th>
                        )}
                        <th scope="col" className={cn(compareThPro, "rounded-tr-2xl")}>
                          <span className="mb-1.5 inline-flex rounded-full bg-primary-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm dark:bg-primary-500">
                            Best value
                          </span>
                          <span className="block">Pro</span>
                          <span className="mt-1.5 block text-[10px] font-semibold normal-case leading-snug text-primary-950/95 dark:text-primary-100/95">
                            Monthly or annual on SuperProfile
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARE_PLAN_ROWS.map((row) => (
                        <tr
                          key={row.feature}
                          className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/90 dark:border-slate-800/90 dark:hover:bg-slate-800/35"
                        >
                          <th scope="row" className={compareTdFeature}>
                            <span className="block font-semibold text-slate-900 dark:text-slate-100">{row.feature}</span>
                            {row.featureNote ? (
                              <span className="mt-1 block text-[11px] font-normal leading-snug text-slate-500 dark:text-slate-400">
                                {row.featureNote}
                              </span>
                            ) : null}
                          </th>
                          {isIndia && (
                            <td className={compareTdPass}>
                              <CompareCell value={row.trial} />
                            </td>
                          )}
                          <td className={compareTdPro}>
                            <CompareCell value={row.pro} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-5 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Paid upgrades use SuperProfile (same email as ResumeDoctor). Checkout is one-time per purchase — we do
                  not store your card for automatic renewals.
                </p>
              </div>
            </section>
          </>
        )}

        <section
          className="relative mt-20 border-t border-slate-200/80 pt-16 dark:border-slate-800"
          aria-labelledby="pricing-faq-heading"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
              Answers
            </p>
            <h2
              id="pricing-faq-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl"
            >
              Pricing questions, cleared up
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600 dark:text-slate-400">
              How Try differs from checkout and what happens after you pay.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <PricingFaqAccordion items={faqItems} />
          </div>
        </section>
      </main>
    </div>
  );
}
