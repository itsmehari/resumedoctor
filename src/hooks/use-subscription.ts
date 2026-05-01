// WBS 5.5 – Subscription status for export gating (includes trial, pro_trial_14)
"use client";

import { useEffect, useState } from "react";

export function useSubscription(): {
  subscription: string;
  isPro: boolean;
  isTrial: boolean;
  loading: boolean;
  displayName: string | null;
  subscriptionExpiresAt: string | null;
  isImpersonating: boolean;
  resumePackCredits: number;
  emailVerified: boolean | null;
} {
  const [subscription, setSubscription] = useState("basic");
  const [isPro, setIsPro] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [resumePackCredits, setResumePackCredits] = useState(0);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { subscription: "basic", isTrial: false, isPro: false }))
      .then((data) => {
        const normalized = data.subscription === "free" ? "basic" : (data.subscription ?? "basic");
        setSubscription(normalized);
        setIsPro(data.isPro === true);
        setIsTrial(data.isTrial === true);
        setDisplayName(data.name || data.email || null);
        setSubscriptionExpiresAt(data.subscriptionExpiresAt ?? null);
        setIsImpersonating(data.isImpersonating === true);
        setResumePackCredits(data.resumePackCredits ?? 0);
        setEmailVerified(data.emailVerified != null);
      })
      .catch(() => {
        setSubscription("basic");
        setIsPro(false);
        setIsTrial(false);
        setDisplayName(null);
        setIsImpersonating(false);
        setEmailVerified(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    subscription,
    isPro,
    isTrial,
    loading,
    displayName,
    subscriptionExpiresAt,
    isImpersonating,
    resumePackCredits,
    emailVerified,
  };
}
