// WBS 5.5 – Subscription status for export gating
"use client";

import { useEffect, useState } from "react";

const PRO_SUBSCRIPTIONS = ["pro_monthly", "pro_annual"];

export function useSubscription(): {
  subscription: string;
  isPro: boolean;
  loading: boolean;
} {
  const [subscription, setSubscription] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : { subscription: "free" }))
      .then((data) => setSubscription(data.subscription ?? "free"))
      .catch(() => setSubscription("free"))
      .finally(() => setLoading(false));
  }, []);

  const isPro = PRO_SUBSCRIPTIONS.includes(subscription);

  return { subscription, isPro, loading };
}
