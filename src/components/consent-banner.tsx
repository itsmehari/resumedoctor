"use client";

import { useConsent } from "@/contexts/consent-context";
import Link from "next/link";

export function ConsentBanner() {
  const { consent, accept, reject } = useConsent();

  if (consent !== "pending") return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg px-4 py-4 sm:px-6 sm:py-5"
      role="dialog"
      aria-labelledby="consent-heading"
      aria-describedby="consent-description"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h2 id="consent-heading" className="font-semibold text-slate-900 dark:text-slate-100">
            We use cookies for analytics
          </h2>
          <p id="consent-description" className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            We use analytics to improve your experience and measure how our product performs. You can accept or decline.{" "}
            <Link href="/privacy" className="text-primary-600 hover:underline dark:text-primary-400">
              Privacy policy
            </Link>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
