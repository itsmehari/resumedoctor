"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

function ChangeEmailVerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification link.");
      return;
    }
    fetch("/api/user/change-email/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage(data.message ?? "Email changed successfully. Please sign in with your new email.");
          // Force sign out so user signs in with new email
          fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
        } else {
          setStatus("error");
          setMessage(data.error ?? "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong.");
      });
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      {status === "loading" && <p className="text-slate-600">Verifying...</p>}
      {status === "success" && (
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">Email updated</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
          <Link href="/login" className="text-primary-600 hover:underline font-medium">Sign in with your new email</Link>
        </div>
      )}
      {status === "error" && (
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Verification failed</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
          <Link href="/settings" className="text-primary-600 hover:underline font-medium">Back to settings</Link>
        </div>
      )}
    </div>
  );
}

export default function ChangeEmailVerifyPage() {
  return (
    <>
      <SiteHeader variant="app" navVariant="dashboard" />
      <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>}>
        <ChangeEmailVerifyContent />
      </Suspense>
    </>
  );
}
