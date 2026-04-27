"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

function TwoFactorForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("Invalid session. Please sign in again.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await signIn("2fa", {
        token,
        code: code.replace(/\s/g, ""),
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError("Invalid code");
        setLoading(false);
        return;
      }
      window.location.href = callbackUrl;
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <p className="text-red-600 dark:text-red-400 mb-4">Invalid or expired session. Please sign in again.</p>
        <Link href="/login" className="text-primary-600 hover:underline">Back to login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">ResumeDoctor</Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Two-factor authentication</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Enter the 6-digit code from your authenticator app.</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">{error}</div>
            )}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Verification code</label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 text-center text-lg tracking-widest focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          <Link href="/login" className="text-primary-600 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default function TwoFactorPage() {
  return (
    <>
      <SiteHeader variant="app" />
      <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>}>
        <TwoFactorForm />
      </Suspense>
    </>
  );
}
