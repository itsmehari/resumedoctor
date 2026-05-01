"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getActionTokenFromUrl } from "@/lib/client-action-token";

type VerifyFail = "invalid" | "expired" | "server" | null;

function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [token, setToken] = useState<string | null>(null);
  const [failReason, setFailReason] = useState<VerifyFail>(null);

  useEffect(() => {
    const t = getActionTokenFromUrl();
    setToken(t);
    if (!t) {
      setFailReason("invalid");
      setStatus("error");
      return;
    }
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: t }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { code?: string };
        if (res.ok) {
          setStatus("success");
          return;
        }
        const code = data.code;
        if (code === "expired") setFailReason("expired");
        else if (code === "invalid") setFailReason("invalid");
        else setFailReason("server");
        setStatus("error");
      })
      .catch(() => {
        setFailReason("server");
        setStatus("error");
      });
  }, []);

  if (token === null && status === "error" && failReason === "invalid") {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-600 dark:text-red-400">
          This link is missing a token. Open the link from your email, or request a new verification email after you sign
          in.
        </p>
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
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Email verified!</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          You can sign in with your email and password.
        </p>
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
      {failReason === "expired" && (
        <p className="text-red-600 dark:text-red-400">
          This verification link has expired. Sign in and use &quot;Resend verification email&quot; on the login page, or
          sign up again if you have not completed registration.
        </p>
      )}
      {failReason === "invalid" && (
        <p className="text-red-600 dark:text-red-400">
          This verification link is not valid. Request a new one from the login page after you enter your password.
        </p>
      )}
      {failReason !== "expired" && failReason !== "invalid" && (
        <p className="text-red-600 dark:text-red-400">
          Something went wrong while verifying. Try again in a moment or request a new link from sign in.
        </p>
      )}
      <Link href="/login" className="text-primary-600 hover:underline">
        Go to sign in
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <>
      <SiteHeader variant="app" />
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="text-2xl font-bold text-primary-600 block text-center">
            ResumeDoctor
          </Link>
          <Suspense fallback={<p className="text-center text-slate-500">Loading...</p>}>
            <VerifyContent />
          </Suspense>
        </div>
      </div>
    </>
  );
}
