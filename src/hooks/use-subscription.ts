// WBS 5.5 – Subscription status for export gating (includes trial)
"use client";

import { useEffect, useState } from "react";

const PRO_SUBSCRIPTIONS = ["pro_monthly", "pro_annual"];

export function useSubscription(): {
  subscription: string;
  isPro: boolean;
  isTrial: boolean;
  loading: boolean;
  displayName: string | null;
} {
  const [subscription, setSubscription] = useState("free");
  const [isTrial, setIsTrial] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { subscription: "free", isTrial: false }))
      .then((data) => {
        setSubscription(data.subscription ?? "free");
        setIsTrial(data.isTrial === true);
        setDisplayName(data.name || data.email || null);
      })
      .catch(() => {
        setSubscription("free");
        setIsTrial(false);
        setDisplayName(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const isPro = PRO_SUBSCRIPTIONS.includes(subscription);

  return { subscription, isPro, isTrial, loading, displayName };
}
