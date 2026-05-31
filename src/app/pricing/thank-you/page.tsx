"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
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

type PageState = "loading" | "guest" | "pending" | "active" | "active_other";

const NEXT_STEPS = [
  {
    step: "1",
    title: "Build or open your resume",
    body: "Pick a template and fill experience — most people finish a first draft in under 5 minutes.",
    href: "/resumes/new",
    cta: "Create resume",
  },
  {
    step: "2",
    title: "Export PDF for Naukri & LinkedIn",
    body: "Your Pro pass unlocks watermark-free PDF and Word exports for every application.",
    href: "/dashboard",
    cta: "Go to dashboard",
  },
  {
    step: "3",
    title: "Share as a live link on WhatsApp",
    body: "Publish a resume URL recruiters can open in one tap — always shows your latest version.",
    href: "/resume-link",
    cta: "Resume link guide",
  },
] as const;

const PRO_UNLOCKS = [
  "All 30+ templates",
  "PDF & Word (DOCX) export — no watermarks",
  "Full AI writing & bullet improvements",
  "ATS checker with job-description match",
  "Resume link publishing (free URL included)",
] as const;

function formatExpiry(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeZone: "Asia/Kolkata",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

function ThankYouContent() {
  const [state, setState] = useState<PageState>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const conversionFired = useRef(false);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile", { credentials: "include" });
      if (res.status === 401) {
        setState("guest");
        return;
      }
      if (!res.ok) {
        setState("guest");
        return;
      }
      const data = (await res.json()) as {
        email?: string;
        subscription?: string;
        subscriptionExpiresAt?: string | null;
        isPro?: boolean;
      };
      setEmail(data.email ?? null);
      setExpiresAt(data.subscriptionExpiresAt ?? null);

      if (data.isPro && data.subscription === "pro_trial_14") {
        setState("active");
        if (!conversionFired.current) {
          conversionFired.current = true;
          reportGoogleAdsPurchaseConversion({ value: 49, currency: "INR" });
          trackEvent("post_purchase_confirmed", { plan: "pro_trial_14", source: "thank_you_page" });
        }
      } else if (data.isPro) {
        setState("active_other");
      } else {
        setState("pending");
      }
    } catch {
      setState("guest");
    }
  }, []);

  useEffect(() => {
    trackEvent("post_purchase_page_view", { plan: "pro_trial_14" });
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    if (state !== "pending" || pollCount >= 24) return;
    const timer = window.setInterval(() => {
      setPollCount((c) => c + 1);
      void checkStatus();
    }, 5000);
    return () => window.clearInterval(timer);
  }, [state, pollCount, checkStatus]);

  const expiryLabel = formatExpiry(expiresAt);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14 outline-none"
    >
      <TrialSectionBackdrop>
        {/* Hero */}
        <div className="text-center">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              state === "active" || state === "active_other"
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                : "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400"
            }`}
          >
            {state === "loading" || state === "pending" ? (
              <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
            ) : (
              <CheckCircle2 className="h-8 w-8" aria-hidden />
            )}
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
            ₹49 · 14-day full Pro pass
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            {state === "active" || state === "active_other"
              ? "You're in — full Pro is unlocked"
              : state === "pending"
                ? "Payment received — activating your Pro pass"
                : state === "guest"
                  ? "Payment received — sign in to unlock"
                  : "Checking your account…"}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {state === "active" ? (
              <>
                Your 14-day Pro pass is live
                {expiryLabel ? (
                  <>
                    {" "}
                    until <span className="font-semibold text-slate-800 dark:text-slate-200">{expiryLabel}</span>
                  </>
                ) : null}
                . Export PDFs, use every template, and run the full ATS toolkit.
              </>
            ) : state === "pending" ? (
              <>
                We&apos;re syncing your ₹49 purchase — this usually takes under a minute. Keep this tab open or come
                back after signing in with the <strong>same email you used on SuperProfile</strong>.
              </>
            ) : state === "guest" ? (
              <>
                Sign in with the <strong>same email you used at checkout</strong> so we can attach your Pro pass to
                your account.
              </>
            ) : (
              "One moment while we confirm your Pro access…"
            )}
          </p>
          {email ? (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              {email}
            </p>
          ) : null}
        </div>

        {/* Status-specific actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {state === "guest" ? (
            <>
              <Link
                href="/login?callbackUrl=/pricing/thank-you"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
              >
                Sign in to activate Pro
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/signup?callbackUrl=/pricing/thank-you"
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

        {/* What's unlocked */}
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-orange-700 dark:text-orange-400">
              <Zap className="h-4 w-4" aria-hidden />
              Unlocked for 14 days
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

        {/* Next steps */}
        <div className="mt-10 border-t border-slate-200/80 pt-8 dark:border-slate-700/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Your next 3 steps</h2>
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

        {/* Help — email mismatch */}
        {(state === "pending" || state === "guest") && (
          <div className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
            <h2 className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200">
              <Mail className="h-4 w-4" aria-hidden />
              Pro not showing yet?
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-amber-950/90 dark:text-amber-100/90">
              <li>
                Use the <strong>exact same email</strong> on ResumeDoctor as you entered on SuperProfile at checkout.
              </li>
              <li>
                New here?{" "}
                <Link href="/signup" className="font-semibold underline underline-offset-2">
                  Create an account
                </Link>{" "}
                with that checkout email — Pro attaches automatically once our payment webhook runs.
              </li>
              <li>
                Still stuck after 5 minutes? Email{" "}
                <a href="mailto:support@resumedoctor.in" className="font-semibold underline underline-offset-2">
                  support@resumedoctor.in
                </a>{" "}
                with your SuperProfile receipt.
              </li>
            </ul>
          </div>
        )}

        <div className="mt-8">
          <PricingTrustStatsBar variant="compact" />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          One-time ₹49 pass · No auto-renew ·{" "}
          <Link href="/pricing" className="text-primary-600 hover:underline dark:text-primary-400">
            View all plans
          </Link>
        </p>
      </TrialSectionBackdrop>
    </main>
  );
}

function ThankYouFallback() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 items-center justify-center px-4 py-20">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" aria-label="Loading" />
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader variant="app" maxWidth="xl" />
      <Suspense fallback={<ThankYouFallback />}>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
