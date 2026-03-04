"use client";

// WBS 10.6 – Self-serve 14-day trial verification (user paid ₹1 via UPI)
import { useState } from "react";
import Link from "next/link";

export default function VerifyTrialPage() {
  const [email, setEmail] = useState("");
  const [upiRef, setUpiRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !upiRef.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pricing/trial-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), upiRef: upiRef.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
      } else {
        setError(data.error ?? "Failed to submit");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <Link href="/pricing" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            ← Pricing
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Activate 14-day Pro trial
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Paid ₹1 via UPI? Enter your email and UPI transaction reference. We&apos;ll activate your trial within 24 hours.
        </p>

        {done ? (
          <div className="mt-8 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6">
            <p className="text-green-800 dark:text-green-200 font-medium">
              Request submitted successfully!
            </p>
            <p className="mt-2 text-green-700 dark:text-green-300 text-sm">
              We&apos;ll verify your payment and activate your 14-day Pro trial. You&apos;ll receive an email once it&apos;s done (usually within 24 hours).
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Go to dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email (same as your ResumeDoctor account)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                UPI transaction reference
              </label>
              <input
                type="text"
                value={upiRef}
                onChange={(e) => setUpiRef(e.target.value)}
                placeholder="e.g. 123456789012"
                required
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit request"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
