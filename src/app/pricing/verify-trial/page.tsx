"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function VerifyTrialPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader variant="app" maxWidth="xl" />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">14-day trial activation</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          We no longer activate trials from this page. All paid plans—including the ₹1, 14-day trial—are purchased
          through <span className="font-medium text-slate-800 dark:text-slate-200">SuperProfile</span> on the pricing
          page. Use the same email as your ResumeDoctor account so we can unlock Pro automatically after payment.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-block rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Go to pricing
        </Link>
      </main>
    </div>
  );
}
