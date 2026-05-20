"use client";

import Link from "next/link";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { PricingTrustStatsBar } from "@/components/pricing/payment-value-sections";

type Props = {
  isImpersonating: boolean;
  showTrustBar: boolean;
  emailVerified: boolean | null | undefined;
  subLoading: boolean;
  resendVerifyBusy: boolean;
  resendVerifyMsg: string | null;
  onResendVerify: () => void;
  upgraded: boolean;
  isTrial: boolean;
  expired: boolean;
  secondsLeft: number;
  firstResumeId: string | null;
  showOnboarding: boolean;
};

export function DashboardAlerts({
  isImpersonating,
  showTrustBar,
  emailVerified,
  subLoading,
  resendVerifyBusy,
  resendVerifyMsg,
  onResendVerify,
  upgraded,
  isTrial,
  expired,
  secondsLeft,
  firstResumeId,
  showOnboarding,
}: Props) {
  return (
    <div className="space-y-6">
      {showTrustBar && (
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <PricingTrustStatsBar variant="inline" />
        </div>
      )}

      {isImpersonating && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm dark:border-amber-800 dark:bg-amber-900/20">
          <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Viewing as user (impersonation mode)
          </span>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/admin/impersonate/end", { method: "POST", credentials: "include" });
              window.location.href = "/admin/users";
            }}
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
          >
            Stop impersonating
          </button>
        </div>
      )}

      {showOnboarding && <OnboardingChecklist firstResumeId={firstResumeId} />}

      {!isImpersonating && !subLoading && emailVerified === false && (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm dark:border-amber-800 dark:bg-amber-900/20"
          role="status"
        >
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Verify your email to export your data, change your account email, or delete your account.
          </p>
          <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-200/90">
            Open the link in your inbox, or request a new one below.
          </p>
          {resendVerifyMsg && (
            <p className="mt-2 text-xs text-slate-700 dark:text-slate-300">{resendVerifyMsg}</p>
          )}
          <button
            type="button"
            disabled={resendVerifyBusy}
            onClick={onResendVerify}
            className="mt-3 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {resendVerifyBusy ? "Sending…" : "Resend verification email"}
          </button>
        </div>
      )}

      {upgraded && !isImpersonating && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
          You&apos;re now a Pro member. PDF &amp; Word export are unlocked.
        </div>
      )}

      {isTrial && !expired && secondsLeft > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")} left in your Try session ·
            Sign up to save; PDF and Word need Pro — see{" "}
            <Link href="/pricing" className="font-semibold text-amber-900 underline dark:text-amber-100">
              pricing
            </Link>
            .
          </p>
          <Link
            href="/signup"
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
          >
            Sign up to save
          </Link>
        </div>
      )}
    </div>
  );
}
