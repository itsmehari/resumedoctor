"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent, trackMetaEvent, trackMetaCustom, trackLinkedInConversion } from "@/lib/analytics";
import { SiteHeader } from "@/components/site-header";
import { TrustBadges } from "@/components/trust-badges";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json();

      if (res.status >= 400) {
        const err = data.error;
        const normalized: Record<string, string[]> =
          typeof err === "string"
            ? { _: [err] }
            : err && typeof err === "object"
              ? Object.fromEntries(
                  Object.entries(err).map(([k, v]) => [
                    k,
                    Array.isArray(v) ? v : [String(v)],
                  ])
                )
              : { _: ["Something went wrong"] };
        setError(normalized);
        setLoading(false);
        return;
      }
      setSuccess(true);
      // 202 from API means account created but verification email did not send
      setEmailSent(data?.emailSent !== false);
      trackEvent("sign_up");
      trackMetaEvent("Lead");
      trackMetaCustom("SignUp");
      trackLinkedInConversion();
    } catch {
      setError({ _: ["Something went wrong"] });
    }
    setLoading(false);
  }

  async function handleResendVerification() {
    if (!email) return;
    setResendStatus("sending");
    setResendMessage(null);
    try {
      const res = await fetch("/api/auth/request-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResendStatus("error");
        setResendMessage(data?.error ?? "Could not send the verification email. Please try again.");
        return;
      }
      setResendStatus("sent");
      setResendMessage(
        data?.message ?? "If that email is registered, we sent a fresh verification link."
      );
    } catch {
      setResendStatus("error");
      setResendMessage("Network error. Please try again.");
    }
  }

  if (success) {
    return (
      <>
        <SiteHeader variant="app" />
        <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 outline-none">
          <div className="w-full max-w-md text-center space-y-4">
            <div
              className={`rounded-full ${
                emailSent
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-amber-100 dark:bg-amber-900/30"
              } w-16 h-16 mx-auto flex items-center justify-center`}
            >
              {emailSent ? (
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 3h.01M10.29 3.86l-7.7 13.34A2 2 0 0 0 4.27 20h15.46a2 2 0 0 0 1.73-2.8l-7.7-13.34a2 2 0 0 0-3.46 0z"
                  />
                </svg>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {emailSent ? "Account created!" : "Account created — email pending"}
            </h1>
            {emailSent ? (
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mx-auto">
                We sent a verification link to <strong>{email}</strong>. Open it to confirm your address, then sign in. Email
                verification is required before you can log in with your password.
              </p>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mx-auto">
                Your account for <strong>{email}</strong> is ready, but we could not deliver the verification email
                just now. Tap below to retry — you must verify before you can sign in.
              </p>
            )}

            {!emailSent && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendStatus === "sending" || resendStatus === "sent"}
                  className="inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
                >
                  {resendStatus === "sending"
                    ? "Sending..."
                    : resendStatus === "sent"
                      ? "Sent — check your inbox"
                      : "Resend verification email"}
                </button>
                {resendMessage && (
                  <p
                    className={`text-xs ${
                      resendStatus === "error"
                        ? "text-red-600 dark:text-red-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {resendMessage}
                  </p>
                )}
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verification email not arriving? Check Spam/Promotions, or{" "}
              <a href="mailto:support@resumedoctor.in" className="text-primary-600 hover:underline">
                contact support
              </a>
              .
            </p>

            <Link
              href="/login"
              className="inline-block rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Go to sign in
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader variant="app" />
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 outline-none">
        <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Create your account
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Save unlimited resumes in the cloud, sync upgrades with the same email you use on SuperProfile, and pick up
            where OTP Try left off.
          </p>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
          <div className="mt-6 flex justify-center">
            <TrustBadges />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.keys(error).length > 0 && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 space-y-1">
                {Object.entries(error).map(([key, val]) => {
                  const msgs = Array.isArray(val) ? val : [val];
                  return msgs.map((msg) => (
                    <p key={`${key}-${String(msg)}`}>{String(msg)}</p>
                  ));
                })}
              </div>
            )}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                At least 8 characters
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center">
          <Link
            href="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            ← Back to home
          </Link>
        </p>
        </div>
      </main>
    </>
  );
}
