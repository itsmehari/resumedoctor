// WBS 10.5, 10.9 – Pricing page with geotargeted INR/USD
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Check, Copy } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

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
            ? "Upgrade to Pro for PDF & Word export. No hidden fees. Pricing in USD."
            : "Upgrade to Pro for PDF & Word export. No hidden fees. Pay via UPI / Google Pay."}
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
              <div className="rounded-xl border border-amber-500/60 dark:border-amber-400/60 bg-amber-50/30 dark:bg-amber-900/10 p-6 flex flex-col">
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wide">Try first</span>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">14-day Pro trial</h2>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹1</span>
                  <span className="text-slate-500 dark:text-slate-400">one-time</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Full Pro for 14 days · Pay via UPI
                </p>
                <ul className="mt-6 space-y-3 flex-1">
                  {FEATURES_PRO.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="#trial-qr"
                  onClick={() => trackEvent("trial_click", { source: "pricing" })}
                  className="mt-6 block text-center rounded-lg border-2 border-amber-600 text-amber-700 dark:text-amber-400 px-4 py-3 font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  Pay ₹1 & start trial
                </Link>
              </div>
            )}
            <div className="rounded-xl border border-primary-500 dark:border-primary-400 shadow-lg ring-1 ring-primary-500/20 p-6 flex flex-col">
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
              <Link
                href="/settings"
                onClick={() => trackEvent("upgrade_click", { source: "pricing" })}
                className="mt-6 block text-center rounded-lg bg-primary-600 px-4 py-3 font-medium text-white hover:bg-primary-700"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
          </>
        )}

        {/* QR checkout – India / UPI */}
        {region?.currency === "INR" && (
          <div className="mt-16 space-y-12">
            <section id="trial-qr" className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-8 flex flex-col items-center">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                14-day trial for ₹1 – Scan to pay
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center">
                Pay ₹1 via Google Pay, PhonePe, or any UPI app · Full Pro for 14 days
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">Google Pay</span>
                <span className="rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">PhonePe</span>
                <span className="rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">Paytm</span>
              </div>
              <div className="mt-6 w-48 h-48 rounded-lg border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center bg-white dark:bg-slate-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/checkout-trial-qr.png"
                  alt="Scan to pay ₹1 – 14-day trial"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove("hidden");
                  }}
                />
                <span className="hidden text-slate-400 dark:text-slate-500 text-sm text-center px-4">
                  Add checkout-trial-qr.png (₹1 UPI QR) to /public
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Sign up first, then pay ₹1 via UPI.{" "}
                <Link href="/pricing/verify-trial" className="text-primary-600 hover:underline font-medium">
                  Submit your UPI ref to activate
                </Link> within 24 hours.
              </p>
              {process.env.NEXT_PUBLIC_UPI_ID && (
                <div className="mt-4 flex items-center gap-2">
                  <input type="text" readOnly value={process.env.NEXT_PUBLIC_UPI_ID} className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800" />
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(process.env.NEXT_PUBLIC_UPI_ID || ""); }}
                    className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Copy className="h-4 w-4" /> Copy UPI
                  </button>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-8 flex flex-col items-center">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Pro plan – Scan to pay
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center">
                Pay via Google Pay, PhonePe, or any UPI app
              </p>
              <div className="mt-6 w-48 h-48 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/checkout-qr.png"
                  alt="Scan to pay – UPI / Google Pay"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove("hidden");
                  }}
                />
                <span className="hidden text-slate-400 dark:text-slate-500 text-sm text-center px-4">
                  Add checkout-qr.png to /public
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                Pro plan — PDF & Word export. Email us after payment to activate.
              </p>
            </section>
          </div>
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
                  ? "Pay via UPI (Google Pay, PhonePe, or any UPI app) by scanning the QR code. Sign up first if you haven&apos;t. Email us your registered email after payment to activate."
                  : "Pay with card or other methods. Contact us for activation after payment."}
              </dd>
            </div>
            {region?.currency === "INR" && (
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">How does the 14-day trial work?</dt>
                <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Pay ₹1 via UPI, email us your registered email, and we&apos;ll activate 14 days of full Pro (PDF & Word export, ATS checker). No automatic renewal.
                </dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">What&apos;s included in the free plan?</dt>
              <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Unlimited resumes, TXT export, print/HTML preview, and all section types.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">Can I cancel Pro anytime?</dt>
              <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Yes. You can cancel before the next billing cycle from Settings → Billing. Contact us for refund requests.
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
