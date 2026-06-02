import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { TrustBadges } from "@/components/trust-badges";

export const metadata: Metadata = {
  title: "Free Resume Review (OTP) — Unlock Export for ₹49 | ResumeDoctor",
  description:
    "Start with a free resume review via OTP. Get top fixes + a sample rewrite, then unlock PDF/DOCX export and the full improvement report for ₹49 when you're ready.",
  alternates: { canonical: `${siteUrl}/lp/ads-trial-first` },
  robots: { index: false, follow: false },
};

export default function AdsTrialFirstLp() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-14 sm:py-20 outline-none">
        <div className="flex justify-center">
          <TrustBadges />
        </div>

        <p className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Free preview first · Pay only when you export
        </p>
        <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
          Get a free resume review in minutes
        </h1>
        <p className="mt-4 text-center text-lg text-slate-600 dark:text-slate-400">
          OTP Try shows you top fixes + a sample rewrite. When you’re ready to apply, unlock portal-ready PDF/DOCX and the full report for ₹49 (India).
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { t: "Top fixes", d: "3–5 improvements you can apply immediately." },
            { t: "Sample rewrite", d: "One example bullet rewritten with more impact." },
            { t: "Export-ready", d: "Unlock PDF/DOCX only when you download." },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-900">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{c.t}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/try"
            className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-center text-base font-bold text-white shadow-lg transition hover:bg-primary-700"
          >
            Start free review (OTP)
          </Link>
          <Link
            href="/pricing#trial"
            className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-center text-base font-semibold text-slate-800 transition hover:border-primary-400 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-primary-500"
          >
            See ₹49 unlock details
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          No credit card on OTP Try. Unlock export when you’re ready to download.
        </p>
      </main>
    </div>
  );
}

