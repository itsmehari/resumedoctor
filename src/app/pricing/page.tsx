// WBS 10.5 – Pricing page (QR/UPI checkout)
"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    features: [
      "Unlimited resumes",
      "TXT export",
      "Print / HTML preview",
      "All section types",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹199",
    period: "/month",
    savings: "or ₹1,499/year",
    features: [
      "Everything in Free",
      "PDF export",
      "Word (DOCX) export",
      "No watermarks",
    ],
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              Dashboard
            </Link>
            <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              ← Back
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400 text-center max-w-xl mx-auto">
          Upgrade to Pro for PDF & Word export. Pay via UPI / Google Pay.
        </p>

        {/* Pricing tiers */}
        <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-xl border p-6 flex flex-col ${
                tier.highlighted
                  ? "border-primary-500 dark:border-primary-400 shadow-lg ring-1 ring-primary-500/20"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {tier.name}
                </h2>
                {tier.savings && (
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {tier.savings}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {tier.price}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {tier.period}
                </span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* QR checkout – primary payment method */}
        <div className="mt-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-8 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Prefer UPI? Scan to pay
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
        </div>
      </main>
    </div>
  );
}
