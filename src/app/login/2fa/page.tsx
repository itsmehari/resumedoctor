"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

const TWOFA_STORAGE_KEY = "2fa_pending_token";

function TwoFactorForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let t: string | null = null;
    try {
      t = sessionStorage.getItem(TWOFA_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (!t) t = searchParams.get("token");
    setToken(t ?? null);
  }, [searchParams]);

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
        if (res.error === "2FA_SESSION_EXPIRED") {
          try {
            sessionStorage.removeItem(TWOFA_STORAGE_KEY);
          } catch {
            /* ignore */
          }
          setToken(null);
          setError(
            "That sign-in step expired. Please go back to login and enter your password again to get a new code."
          );
          setLoading(false);
          return;
        }
        setError(
          "That code did not work. Try again, use a backup code if you saved one, or sign in again from the login page."
        );
        setLoading(false);
        return;
      }
      try {
        sessionStorage.removeItem(TWOFA_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      window.location.href = callbackUrl;
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  if (token === undefined) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-slate-500 outline-none">
        Loading...
      </main>
    );
  }

  if (!token) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 max-w-md mx-auto text-center outline-none">
        <p className="text-red-600 dark:text-red-400 mb-4 text-sm">
          {error || "Invalid or expired session. Please sign in again."}
        </p>
        <Link href="/login" className="text-primary-600 hover:underline font-medium">
          Back to login
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 outline-none">
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
    </main>
  );
}

export default function TwoFactorPage() {
  return (
    <>
      <SiteHeader variant="app" />
      <Suspense fallback={<main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)] flex items-center justify-center outline-none"><p className="text-slate-500">Loading...</p></main>}>
        <TwoFactorForm />
      </Suspense>
    </>
  );
}
