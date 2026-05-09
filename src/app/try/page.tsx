"use client";

import { useState, Suspense, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { PricingTrustStatsBar } from "@/components/pricing/payment-value-sections";
import { trackEvent, trackMetaEvent, trackMetaCustom, trackLinkedInConversion } from "@/lib/analytics";

const RESEND_COOLDOWN_SEC = 60;

function TryPageContent() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);
  const searchParams = useSearchParams();
  const isExpired = searchParams.get("expired") === "1";
  const reason = searchParams.get("reason");
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setInterval(() => {
      setResendSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [resendSeconds]);

  const sendOtpToEmail = useCallback(
    async (trimmed: string, options?: { isResend?: boolean }) => {
      setLoading(true);
      setError(null);
      if (!options?.isResend) setMessage(null);
      try {
        const res = await fetch("/api/auth/trial/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || "Failed to send code");
          return false;
        }
        setEmail(trimmed);
        setStep("otp");
        setMessage("Verification code sent! Check your email.");
        if (options?.isResend) setResendSeconds(RESEND_COOLDOWN_SEC);
        return true;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }
    await sendOtpToEmail(trimmed);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const body: { email: string; otp: string; returnTo?: string } = { email, otp };
      if (returnTo && returnTo.startsWith("/resumes/")) {
        body.returnTo = returnTo;
      }
      const res = await fetch("/api/auth/trial/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Invalid or expired code");
        return;
      }
      trackEvent("trial_start");
      trackMetaEvent("CompleteRegistration");
      trackMetaCustom("TrialStart");
      trackLinkedInConversion();
      router.push(data.redirectTo || "/try/templates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
      <SiteHeader variant="app" maxWidth="2xl" />

      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col items-center justify-center px-4 py-12 outline-none">
        <div className="w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
            Try the builder — no card
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-center max-w-md mx-auto text-sm">
            {step === "email"
              ? "In about fifteen minutes you can pick a template, sketch sections, and preview. Enter your email for a code—we never ask for a card on this step."
              : "Enter the 6-digit code we sent to your email"}
          </p>

          {isExpired && (
            <p className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-sm text-center">
              Your trial session expired. Enter your email to start a new trial.
            </p>
          )}

          {reason === "resume" && (
            <p className="mt-4 p-3 rounded-lg border border-primary-200/60 dark:border-primary-800/50 bg-primary-50/50 dark:bg-primary-950/30 text-primary-900 dark:text-primary-100 text-sm text-center">
              To open that resume, start a quick try (email code below) or{" "}
              <Link href="/login" className="font-semibold underline">
                sign in
              </Link>{" "}
              if you already have an account.
            </p>
          )}

          <div className="mt-8">
            {step === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                {message && (
                  <p className="text-sm text-success">{message}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-accent hover:bg-accent-hover py-3 text-base font-semibold text-accent-dark transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send verification code"}
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Editing and preview in-session. Create a free account to save your work; PDF and Word need Pro (see{" "}
                  <Link href="/pricing" className="text-primary-600 hover:underline dark:text-primary-400">
                    pricing
                  </Link>
                  ).
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Code sent to <strong className="text-slate-900 dark:text-slate-100">{email}</strong>
                </p>
                <div>
                  <label htmlFor="otp" className="sr-only">
                    Verification code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    autoComplete="one-time-code"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-center text-2xl tracking-[0.5em] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full rounded-xl bg-accent hover:bg-accent-hover py-3 text-base font-semibold text-accent-dark transition-colors disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify and start 15-min trial"}
                </button>
                <button
                  type="button"
                  disabled={loading || resendSeconds > 0}
                  onClick={() => void sendOtpToEmail(email, { isResend: true })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  {resendSeconds > 0
                    ? `Resend code (${resendSeconds}s)`
                    : "Resend code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setResendSeconds(0);
                    setMessage(null);
                    setError(null);
                  }}
                  className="w-full text-sm text-slate-500 hover:text-primary-600 dark:hover:text-slate-400"
                >
                  Use a different email
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 w-full max-w-lg mx-auto">
            <PricingTrustStatsBar variant="compact" />
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Fifteen-minute session after verification. No credit card here. Sign up to keep your resume; Pro on SuperProfile
            unlocks PDF and Word for real applications.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function TryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <p className="text-slate-500">Loading...</p>
      </div>
    }>
      <TryPageContent />
    </Suspense>
  );
}
