"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        return res.json().then((data) => ({ ok: res.ok, data }));
      })
      .then(({ ok }) => {
        setStatus(ok ? "success" : "error");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-600 dark:text-red-400">Invalid verification link.</p>
        <Link href="/login" className="text-primary-600 hover:underline">
          Go to sign in
        </Link>
      </div>
    );
  }

  if (status === "loading") {
    return <p className="text-slate-600">Verifying your email...</p>;
  }

  if (status === "success") {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 w-16 h-16 mx-auto flex items-center justify-center">
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
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Email verified!
        </h1>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-red-600 dark:text-red-400">
        Verification failed. The link may be expired.
      </p>
      <Link href="/login" className="text-primary-600 hover:underline">
        Go to sign in
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <Link href="/" className="text-2xl font-bold text-primary-600 block text-center">
          ResumeDoctor
        </Link>
        <Suspense fallback={<p className="text-center text-slate-500">Loading...</p>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
