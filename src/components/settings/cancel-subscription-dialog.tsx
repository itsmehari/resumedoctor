"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

const REASONS = [
  { value: "", label: "Prefer not to say" },
  { value: "too_expensive", label: "Too expensive" },
  { value: "not_using", label: "Not using it enough" },
  { value: "switching_plan", label: "Switching to another plan / tool" },
  { value: "other", label: "Other" },
];

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelSubscriptionDialog({ open, onOpenChange }: CancelSubscriptionDialogProps) {
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    try {
      trackEvent("churn_initiated", { source: "cancel_subscription" });
      await fetch("/api/user/churn-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reason: reason.trim() ? reason : "prefer_not_to_say",
          detail: detail.trim() || undefined,
          source: "cancel_subscription",
        }),
      }).catch(() => {});
      onOpenChange(false);
      window.location.href = "/pricing";
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setReason("");
          setDetail("");
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Refund, billing, or feedback?
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Pro is a one-time purchase (no self-serve cancel). Share optional feedback, then we&apos;ll send you to Pricing
            for support. For a refund, contact us with your registered email and SuperProfile order details.
          </Dialog.Description>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Why are you cancelling? (optional)
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800"
              >
                {REASONS.map((r) => (
                  <option key={r.value || "none"} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Details (optional)
              </label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Keep Pro
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleContinue}
              disabled={loading}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "…" : "Continue to pricing & support"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
