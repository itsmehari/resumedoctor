"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  Sparkles,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import {
  ProExportFeatureList,
  PricingTrustStatsBar,
  TrialSectionBackdrop,
} from "@/components/pricing/payment-value-sections";
import { reportGoogleAdsPurchaseConversion } from "@/lib/google-ads-conversion";
import { trackEvent } from "@/lib/analytics";
import { PAYMENT_SUCCESS_PATH } from "@/lib/payment-success-url";

const NEXT_STEPS = [
  {
    step: "1",
    title: "Sign in to ResumeDoctor",
    body: "Use the same email you entered on SuperProfile at checkout.",
    href: `/login?callbackUrl=${encodeURIComponent(PAYMENT_SUCCESS_PATH)}`,
    cta: "Sign in",
  },
  {
    step: "2",
    title: "Build your resume",
    body: "Pick a template and fill experience — most people finish a first draft in under 5 minutes.",
    href: "/resumes/new",
    cta: "Create resume",
  },
  {
    step: "3",
    title: "Export PDF & share your link",
    body: "Download for Naukri and LinkedIn, or publish a live resume URL for WhatsApp.",
    href: "/dashboard",
    cta: "Go to dashboard",
  },
] as const;

const PRO_UNLOCKS = [
  "All 30+ templates",
  "PDF & Word (DOCX) export — no watermarks",
  "Full AI writing & bullet improvements",
  "ATS checker with job-description match",
  "Resume link publishing",
] as const;

function transactionIdFromParams(params: URLSearchParams): string | undefined {
  return (
    params.get("order_id") ||
    params.get("transaction_id") ||
    params.get("payment_id") ||
    params.get("id") ||
    undefined
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const conversionFired = useRef(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Google Ads conversion — fire once when SuperProfile redirects here after payment
  useEffect(() => {
    if (conversionFired.current) return;
    conversionFired.current = true;

    const transactionId = transactionIdFromParams(searchParams);
    reportGoogleAdsPurchaseConversion({
      value: 49,
      currency: "INR",
      transactionId,
    });
    trackEvent("post_purchase_page_view", { plan: "pro_trial_14", source: "superprofile_redirect" });
    trackEvent("post_purchase_confirmed", { plan: "pro_trial_14", source: "payment_success_page" });
  }, [searchParams]);

  // Optional: personalize if already signed in (does not gate conversion)
  useEffect(() => {
    fetch("/api/user/profile", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { email?: string };
        setEmail(data.email ?? null);
        setIsSignedIn(true);
      })
      .catch(() => {})
      .finally(() => setProfileLoaded(true));
  }, []);

  const authReturnUrl = encodeURIComponent(PAYMENT_SUCCESS_PATH);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14 outline-none"
    >
      <TrialSectionBackdrop>
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" aria-hidden />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
            ₹49 · 14-day full Pro pass
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Payment successful — thank you!
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Your purchase on SuperProfile is complete. You now have the{" "}
            <strong className="font-semibold text-slate-800 dark:text-slate-200">14-day full Pro pass</strong> — export
            PDFs, use every template, and run the full ATS toolkit on ResumeDoctor.
          </p>
          {profileLoaded && isSignedIn && email ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              Signed in as {email}
            </p>
          ) : profileLoaded ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Sign in below with the <strong>same email you used at checkout</strong>.
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {profileLoaded && !isSignedIn ? (
            <>
              <Link
                href={`/login?callbackUrl=${authReturnUrl}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
              >
                Sign in to ResumeDoctor
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={`/signup?callbackUrl=${authReturnUrl}`}
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-orange-400 dark:border-slate-600 dark:text-slate-100"
              >
                Create account
              </Link>
            </>
          ) : (
            <Link
              href="/resumes/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Start building your resume
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-primary-400 dark:border-slate-600 dark:text-slate-100"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-orange-700 dark:text-orange-400">
              <Zap className="h-4 w-4" aria-hidden />
              Your Pro pass includes
            </h2>
            <ul className="mt-4 space-y-2.5" role="list">
              {PRO_UNLOCKS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
              Export-ready files
            </h2>
            <div className="mt-2">
              <ProExportFeatureList accent="orange" />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/80 pt-8 dark:border-slate-700/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">What to do next</h2>
          <ol className="mt-5 space-y-4" role="list">
            {NEXT_STEPS.map((item) => (
              <li
                key={item.step}
                className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
                  {item.step}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.body}</p>
                  <Link
                    href={item.href}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                  >
                    {item.cta}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-900/40">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Need help?</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Use the same email on ResumeDoctor as on SuperProfile. Questions about your purchase? Email{" "}
            <a href="mailto:support@resumedoctor.in" className="font-semibold text-primary-600 underline underline-offset-2 dark:text-primary-400">
              support@resumedoctor.in
            </a>{" "}
            with your SuperProfile receipt.
          </p>
        </div>

        <div className="mt-8">
          <PricingTrustStatsBar variant="compact" />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          One-time ₹49 · 14 days · No auto-renew ·{" "}
          <Link href="/pricing" className="text-primary-600 hover:underline dark:text-primary-400">
            View all plans
          </Link>
        </p>
      </TrialSectionBackdrop>
    </main>
  );
}

function PaymentSuccessFallback() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 items-center justify-center px-4 py-20">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" aria-label="Loading" />
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader variant="app" maxWidth="xl" />
      <Suspense fallback={<PaymentSuccessFallback />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
