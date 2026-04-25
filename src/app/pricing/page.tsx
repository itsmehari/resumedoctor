// WBS 10.5, 10.9 – Pricing page with geotargeted INR/USD
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  SuperprofileProCtas,
  SuperprofileResumePackCta,
  SuperprofileTrialCta,
} from "@/components/pricing/superprofile-pricing-links";

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

const FEATURES_PRO = [
  "Everything in Free",
  "PDF export",
  "Word (DOCX) export",
  "No watermarks",
];

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

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader variant="app" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400 text-center max-w-xl mx-auto">
          {region?.currency === "USD"
            ? "Pro is a one-time purchase (lifetime access for that tier)—PDF & Word export, no auto-renewal. USD pricing where applicable."
            : "Pro is a one-time purchase (no subscription renewals). Pay through SuperProfile using the links below with the same email as your account."}
        </p>
        {region && (
          <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
            Prices in {region.currency}
            {region.country && region.country !== "unknown" && ` (${region.country})`}
          </p>
        )}

        {loading ? (
          <div className="mt-12 text-center text-slate-500">Loading pricing...</div>
        ) : (
          <>
          <div className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoValid(null); }}
              placeholder="Promo code"
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                  setPromoValid(data.valid ? { valid: true, label: data.label } : { valid: false, error: data.error });
                } catch {
                  setPromoValid({ valid: false, error: "Failed to validate" });
                }
                setPromoLoading(false);
              }}
              disabled={promoLoading || !promoCode.trim()}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 disabled:opacity-50"
            >
              {promoLoading ? "..." : "Apply"}
            </button>
          </div>
          {promoValid && (
            <p className={`mt-2 text-center text-sm ${promoValid.valid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {promoValid.valid ? `Valid: ${promoValid.label}` : promoValid.error}
            </p>
          )}
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Free</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {freePlan?.price ?? (isIndia ? "₹0" : "$0")}
                </span>
                <span className="text-slate-500 dark:text-slate-400">forever</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {FEATURES_FREE.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {isIndia && (
              <div
                id="india-trial"
                className="rounded-xl border border-amber-500/60 dark:border-amber-400/60 bg-amber-50/30 dark:bg-amber-900/10 p-6 flex flex-col"
              >
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wide">Try first</span>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">14-day Pro trial</h2>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹1</span>
                  <span className="text-slate-500 dark:text-slate-400">one-time</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Full Pro for 14 days · Pay on SuperProfile
                </p>
                <ul className="mt-6 space-y-3 flex-1">
                  {FEATURES_PRO.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <SuperprofileTrialCta />
                {!process.env.NEXT_PUBLIC_SUPERPROFILE_URL_TRIAL_14 && (
                  <p className="mt-4 text-center text-xs text-amber-800 dark:text-amber-200">
                    SuperProfile trial link is not configured yet. Check back soon or contact support.
                  </p>
                )}
              </div>
            )}
            <div
              id="pro-superprofile"
              className="rounded-xl border border-primary-500 dark:border-primary-400 shadow-lg ring-1 ring-primary-500/20 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pro</h2>
                {proAnnual?.savings && (
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {proAnnual.savings}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {proMonthly?.price ?? (isIndia ? "₹199" : "$4.99")}
                </span>
                <span className="text-slate-500 dark:text-slate-400">/month</span>
              </div>
              {proAnnual && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  or {proAnnual.price}/year
                </p>
              )}
              <ul className="mt-6 space-y-3 flex-1">
                {FEATURES_PRO.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <SuperprofileProCtas />
              <Link
                href="/settings"
                onClick={() => trackEvent("upgrade_click", { source: "pricing" })}
                className="mt-6 block text-center rounded-lg bg-primary-600 px-4 py-3 font-medium text-white hover:bg-primary-700"
              >
                Account & billing (signed in)
              </Link>
              {!(
                process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_MONTHLY ||
                process.env.NEXT_PUBLIC_SUPERPROFILE_URL_PRO_ANNUAL
              ) && (
                <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                  SuperProfile Pro links are not configured yet. Contact support to purchase.
                </p>
              )}
            </div>
          </div>

          {/* Comparison table */}
          <section className="mt-12 max-w-4xl mx-auto overflow-x-auto">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-4">
              Compare plans
            </h2>
            <table className="w-full border-collapse rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">Feature</th>
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
                      {typeof row.free === "boolean" ? (row.free ? <Check className="h-4 w-4 text-green-600 mx-auto" /> : "—") : row.free}
                    </td>
                    {isIndia && (
                      <td className="p-3 text-center">
                        {typeof row.trial === "boolean" ? (row.trial ? <Check className="h-4 w-4 text-green-600 mx-auto" /> : "—") : row.trial}
                      </td>
                    )}
                    <td className="p-3 text-center">
                      {typeof row.pro === "boolean" ? (row.pro ? <Check className="h-4 w-4 text-green-600 mx-auto" /> : "—") : row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
              Payments via SuperProfile · One-time purchase · No automatic renewals
            </p>
          </section>

          {/* WBS 10.7 – One-time Resume Pack */}
          <section className="mt-12 max-w-2xl mx-auto">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resume Pack</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  5 PDF or Word exports · One-time purchase · No subscription
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {isIndia ? "₹99" : "$2.99"}
                </p>
              </div>
              <div className="shrink-0 flex flex-col sm:items-end gap-3">
                <SuperprofileResumePackCta />
                {!process.env.NEXT_PUBLIC_SUPERPROFILE_URL_RESUME_PACK && (
                  <p className="text-center sm:text-right text-xs text-slate-500">Resume pack checkout on SuperProfile is not configured yet.</p>
                )}
              </div>
            </div>
          </section>
          </>
        )}

        <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-700" aria-labelledby="pricing-faq-heading">
          <h2 id="pricing-faq-heading" className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center mb-8">
            Pricing FAQ
          </h2>
          <dl className="max-w-2xl mx-auto space-y-6">
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">How do I pay for Pro?</dt>
              <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {region?.currency === "INR"
                  ? "Use the SuperProfile buttons on this page. Sign in to ResumeDoctor with the same email you use for SuperProfile so your account can be activated automatically when payment completes."
                  : "Use the SuperProfile checkout for your region. Use the same email on SuperProfile and ResumeDoctor."}
              </dd>
            </div>
            {region?.currency === "INR" && (
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">How does the 14-day trial work?</dt>
                <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Use the SuperProfile ₹1 trial link, then Pro unlocks for 14 days on the email you used. No automatic renewal.
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
                Pro is a one-time payment for ongoing access to Pro features (no auto-renewal). For refunds
                or billing help, use Settings → Billing or email us from the pricing page. We respond within 1–2 business days.
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
