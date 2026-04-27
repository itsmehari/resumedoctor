"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import {
  PricingTrustStatsBar,
  ProExportFeatureList,
  TrialSectionBackdrop,
} from "@/components/pricing/payment-value-sections";

export default function VerifyTrialPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader variant="app" maxWidth="xl" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14">
        <TrialSectionBackdrop>
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                14-day trial activation
              </h1>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                We no longer activate trials from this page. For the India{" "}
                <span className="font-medium text-slate-800 dark:text-slate-200">₹49</span> 14-day{" "}
                <span className="font-medium text-slate-800 dark:text-slate-200">full Pro</span> pass, use our pricing page
                and checkout on{" "}
                <span className="font-medium text-slate-800 dark:text-slate-200">SuperProfile</span>. Use the same email
                as your ResumeDoctor account so Pro unlocks automatically after payment.
              </p>
              <div className="mt-5 flex items-start gap-2 text-sm text-amber-900/90 dark:text-amber-200/90">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>Full Pro features for 14 days · One-time on SuperProfile</span>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-400">
                Included in the trial
              </p>
              <ProExportFeatureList accent="orange" />
              <Link
                href="/pricing#trial"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500"
              >
                Go to pricing
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <PricingTrustStatsBar variant="compact" />
          </div>
        </TrialSectionBackdrop>
      </main>
    </div>
  );
}
