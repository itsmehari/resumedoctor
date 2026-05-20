"use client";

import { useEffect, useState } from "react";

export function ReferralSection() {
  const [code, setCode] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/referral", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) {
          setError("Could not load your invite link.");
          return;
        }
        const d = await r.json();
        setCode(d.code);
        setInviteUrl(d.inviteUrl);
        setCount(d.referralsCount ?? 0);
      })
      .catch(() => setError("Could not load your invite link."));
  }, []);

  const copy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed — select the link and copy manually.");
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Invite friends</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Share ResumeDoctor with someone job hunting in India. We track signups from your link; rewards may be added later.
      </p>
      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {inviteUrl && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-slate-500">
            Referrals so far: <strong className="text-slate-800 dark:text-slate-200">{count}</strong>
            {code ? (
              <>
                {" "}
                · Code: <span className="font-mono">{code}</span>
              </>
            ) : null}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              readOnly
              value={inviteUrl}
              className="min-h-[44px] flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              aria-label="Invite link"
            />
            <button
              type="button"
              onClick={() => void copy()}
              className="min-h-[44px] rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
