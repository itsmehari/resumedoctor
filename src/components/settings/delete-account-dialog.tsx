"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const REASONS = [
  { value: "", label: "Prefer not to say" },
  { value: "too_expensive", label: "Too expensive" },
  { value: "not_using", label: "Not using it enough" },
  { value: "missing_features", label: "Missing features I need" },
  { value: "found_alternative", label: "Found another tool" },
  { value: "privacy", label: "Privacy / data concerns" },
  { value: "other", label: "Other" },
];

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountEmail: string;
  onDeleted: () => void | Promise<void>;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  accountEmail,
  onDeleted,
}: DeleteAccountDialogProps) {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) trackEvent("churn_initiated");
  }, [open]);

  async function handleConfirm() {
    setError(null);
    if (!email.trim()) {
      setError("Enter your email to confirm.");
      return;
    }
    if (email.trim().toLowerCase() !== accountEmail.toLowerCase()) {
      setError("Email must match your account.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          confirm: true,
          email: email.trim(),
          churnReason: reason || undefined,
          churnDetail: detail.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Could not delete account.");
        return;
      }
      trackEvent("churn_completed", reason ? { reason_code: reason } : undefined);
      await onDeleted();
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
          setEmail("");
          setReason("");
          setDetail("");
          setError(null);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Delete account?
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            This permanently removes your resumes and data. Optional feedback helps us improve.
          </Dialog.Description>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Type your email to confirm
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800"
                placeholder={accountEmail}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Why are you leaving? (optional)
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
                Anything else? (optional)
              </label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800"
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "…" : "Delete my account"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
