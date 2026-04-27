// WBS 10.5, 10.9 – Pricing page with geotargeted INR/USD
"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Check, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
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

const FEATURES_FREE = [
  "Unlimited resumes",
  "TXT export",
  "Print / HTML preview",
  "All section types",
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
          {["Everything in Free", "PDF & Word export", "No watermarks", "30+ templates"].map((f) => (
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
  const freePlan = region?.plans?.find((p) => p.id === "free");
  const proMonthly = region?.plans?.find((p) => p.id === "pro_monthly");
  const proAnnual = region?.plans?.find((p) => p.id === "pro_annual");

  const annualMonthlyEquiv =
    isIndia && proAnnual
      ? `or ₹${Math.round(1499 / 12)}/mo equivalent`
      : proAnnual && !isIndia
        ? "Billed once per year"
        : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader variant="app" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-14">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            {region?.currency === "USD"
              ? "Choose Free, Trial (where available), or Pro. Pay securely through SuperProfile with the same email as your ResumeDoctor account."
              : "Choose Free, 14-day Trial, or Pro. Pay securely through SuperProfile with the same email as your ResumeDoctor account."}
          </p>
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

            {/* —— India: 14-day trial —— */}
            {isIndia && (
              <section className="mt-12" id="india-trial" aria-labelledby="trial-heading">
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
                        Experience all Pro features for 14 days. One-time payment on SuperProfile with no surprise renewals.
                      </p>
                      <div className="mt-6">
                        <ProExportFeatureList accent="orange" />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-600 dark:bg-slate-900">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          14-day Pro trial
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
                    Create, export, and apply with confidence. Free for basics, Pro for full export and templates. Pay on
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

            {/* Free + account */}
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Free</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {freePlan?.price ?? (isIndia ? "₹0" : "$0")}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">forever</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {FEATURES_FREE.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Check className="h-4 w-4 flex-shrink-0 text-emerald-600" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-800/30">
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
            </div>

            {/* Comparison table */}
            <section className="mt-14 max-w-4xl mx-auto overflow-x-auto" aria-label="Compare plans">
              <h3 className="mb-4 text-center text-lg font-semibold text-slate-900 dark:text-slate-100">
                Compare plans
              </h3>
              <table className="w-full border-collapse overflow-hidden rounded-xl border border-slate-200 bg-white text-sm dark:border-slate-700 dark:bg-slate-900">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3 text-left font-medium text-slate-700 dark:text-slate-300">Feature</th>
                    <th className="p-3 font-medium text-slate-700 dark:text-slate-300">Free</th>
                    {isIndia && <th className="p-3 font-medium text-amber-700 dark:text-amber-300">14-day trial</th>}
                    <th className="p-3 font-medium text-primary-600 dark:text-primary-400">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "PDF export", free: false, trial: true, pro: true },
                    { feature: "Word (DOCX) export", free: false, trial: true, pro: true },
                    { feature: "ATS score checker", free: "1 free check/resume", trial: true, pro: true },
                    { feature: "AI bullets / day", free: "5", trial: true, pro: "50" },
                    { feature: "Templates", free: "10 base", trial: true, pro: "All 30" },
                    { feature: "Watermarks", free: "—", trial: false, pro: false },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 text-slate-700 dark:text-slate-300">{row.feature}</td>
                      <td className="p-3 text-center">
                        {typeof row.free === "boolean" ? (row.free ? <Check className="mx-auto h-4 w-4 text-green-600" /> : "—") : row.free}
                      </td>
                      {isIndia && (
                        <td className="p-3 text-center">
                          {typeof row.trial === "boolean" ? (row.trial ? <Check className="mx-auto h-4 w-4 text-green-600" /> : "—") : row.trial}
                        </td>
                      )}
                      <td className="p-3 text-center">
                        {typeof row.pro === "boolean" ? (row.pro ? <Check className="mx-auto h-4 w-4 text-green-600" /> : "—") : row.pro}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                Payments via SuperProfile · One-time purchase · No automatic renewals
              </p>
            </section>
          </>
        )}

        <section
          className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-700"
          aria-labelledby="pricing-faq-heading"
        >
          <h2
            id="pricing-faq-heading"
            className="mb-8 text-center text-xl font-bold text-slate-900 dark:text-slate-100"
          >
            Pricing FAQ
          </h2>
          <dl className="mx-auto max-w-2xl space-y-6">
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">How do I pay for Pro?</dt>
              <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {region?.currency === "INR"
                  ? "Use the SuperProfile buttons on this page. Sign in to ResumeDoctor with the same email you use on SuperProfile so your account can activate when payment completes."
                  : "Use the SuperProfile checkout for your region. Use the same email on SuperProfile and ResumeDoctor."}
              </dd>
            </div>
            {region?.currency === "INR" && (
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">How does the 14-day trial work?</dt>
                <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Use the SuperProfile trial link (₹49 one-time), then Pro unlocks for 14 days on the email you used. No
                  automatic renewal.
                </dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">What&apos;s included in the free plan?</dt>
              <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Unlimited resumes, TXT export, print/HTML preview, 10 base templates, and all section types.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">Is Pro a subscription? Can I get a refund?</dt>
              <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Pro is a one-time payment for ongoing access to Pro features (no auto-renewal). For refunds or billing
                help, use Settings → Billing or email us. We respond within 1–2 business days.
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
