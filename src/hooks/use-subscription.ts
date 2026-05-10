// WBS 5.5 – Subscription status for export gating (includes trial, pro_trial_14)
// Pro Link – also exposes the Pro Link entitlement so any client surface can
// gate "vanity URL / view analytics / footer removal" without re-fetching.
"use client";

import { useEffect, useState } from "react";

export interface ProLinkStatus {
  active: boolean;
  source: "annual" | "standalone" | "complimentary" | null;
  expiresAt: string | null;
  isImplicit: boolean;
  label: string;
}

const INACTIVE_PRO_LINK: ProLinkStatus = {
  active: false,
  source: null,
  expiresAt: null,
  isImplicit: false,
  label: "Inactive",
};

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
  proLink: ProLinkStatus;
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
  const [proLink, setProLink] = useState<ProLinkStatus>(INACTIVE_PRO_LINK);
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
        if (data.proLink && typeof data.proLink === "object") {
          setProLink({
            active: data.proLink.active === true,
            source: data.proLink.source ?? null,
            expiresAt: data.proLink.expiresAt ?? null,
            isImplicit: data.proLink.isImplicit === true,
            label: typeof data.proLink.label === "string" ? data.proLink.label : "Inactive",
          });
        } else {
          setProLink(INACTIVE_PRO_LINK);
        }

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
        setProLink(INACTIVE_PRO_LINK);
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
    proLink,
  };
}
