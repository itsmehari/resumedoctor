// Free Trial – 5-min countdown
"use client";

import { useEffect, useState } from "react";

export function useTrialTimer(isTrial: boolean): {
  secondsLeft: number;
  expired: boolean;
  sessionExpiresAt: string | null;
} {
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!isTrial) return;

    fetch("/api/auth/trial/status", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { isTrial?: boolean; sessionExpiresAt?: string } | null) => {
        if (data?.isTrial && data?.sessionExpiresAt) {
          setSessionExpiresAt(data.sessionExpiresAt);
        }
      })
      .catch(() => {});
  }, [isTrial]);

  useEffect(() => {
    if (!sessionExpiresAt) return;

    const update = () => {
      const end = new Date(sessionExpiresAt).getTime();
      const now = Date.now();
      const left = Math.max(0, Math.floor((end - now) / 1000));
      setSecondsLeft(left);
      setExpired(left <= 0);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [sessionExpiresAt]);

  return { secondsLeft, expired, sessionExpiresAt };
}
