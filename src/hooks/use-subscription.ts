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
  aiDailyUsed: number | null;
  aiDailyLimit: number | null;
  aiDailyRemaining: number | null;
} {
  const [subscription, setSubscription] = useState("basic");
  const [isPro, setIsPro] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [resumePackCredits, setResumePackCredits] = useState(0);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [aiDailyUsed, setAiDailyUsed] = useState<number | null>(null);
  const [aiDailyLimit, setAiDailyLimit] = useState<number | null>(null);
  const [aiDailyRemaining, setAiDailyRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/user/profile", { credentials: "include" }),
      fetch("/api/user/feature-limits", { credentials: "include" }),
    ])
      .then(async ([profileRes, limitsRes]) => {
        const data = profileRes.ok
          ? await profileRes.json()
          : { subscription: "basic", isTrial: false, isPro: false };
        const normalized = data.subscription === "free" ? "basic" : (data.subscription ?? "basic");
        setSubscription(normalized);
        setIsPro(data.isPro === true);
        setIsTrial(data.isTrial === true);
        setDisplayName(data.name || data.email || null);
        setSubscriptionExpiresAt(data.subscriptionExpiresAt ?? null);
        setIsImpersonating(data.isImpersonating === true);
        setResumePackCredits(data.resumePackCredits ?? 0);
        setEmailVerified(data.emailVerified != null);

        if (limitsRes.ok) {
          const lim = await limitsRes.json();
          if (lim.ai && typeof lim.ai.used === "number" && typeof lim.ai.limit === "number") {
            setAiDailyUsed(lim.ai.used);
            setAiDailyLimit(lim.ai.limit);
            setAiDailyRemaining(
              typeof lim.ai.remaining === "number" ? lim.ai.remaining : Math.max(0, lim.ai.limit - lim.ai.used)
            );
          } else {
            setAiDailyUsed(null);
            setAiDailyLimit(null);
            setAiDailyRemaining(null);
          }
        } else {
          setAiDailyUsed(null);
          setAiDailyLimit(null);
          setAiDailyRemaining(null);
        }
      })
      .catch(() => {
        setSubscription("basic");
        setIsPro(false);
        setIsTrial(false);
        setDisplayName(null);
        setIsImpersonating(false);
        setEmailVerified(null);
        setAiDailyUsed(null);
        setAiDailyLimit(null);
        setAiDailyRemaining(null);
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
    aiDailyUsed,
    aiDailyLimit,
    aiDailyRemaining,
  };
}
