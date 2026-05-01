"use client";

// WBS 10.6 – Admin: approve trial activation requests
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Request {
  id: string;
  email: string;
  upiRef: string;
  status: string;
  createdAt: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
}

export default function AdminTrialActivationsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [history, setHistory] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});

  const fetchRequests = () => {
    fetch("/api/admin/trial-activations", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { requests: [], history: [] }))
      .then((d) => {
        setRequests(d.requests ?? []);
        setHistory(d.history ?? []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    setApproving(id);
    try {
      const res = await fetch(`/api/admin/trial-activations/${id}/approve`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        fetchRequests();
      } else {
        alert(data.error ?? "Failed to approve");
      }
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Reject this trial activation request? The user will not receive Pro trial from this UPI ref.")) {
      return;
    }
    setRejecting(id);
    try {
      const reason = rejectReason[id]?.trim();
      const res = await fetch(`/api/admin/trial-activations/${id}/reject`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reason ? { reason } : {}),
      });
      const data = await res.json();
      if (res.ok) {
        setRejectReason((prev) => {
          const n = { ...prev };
          delete n[id];
          return n;
        });
        fetchRequests();
      } else {
        alert(data.error ?? "Failed to reject");
      }
    } finally {
      setRejecting(null);
    }
  };

  return (
    <div className="p-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to admin
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Trial Activation Requests
      </h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Approve 14-day Pro trial requests (legacy UPI — new sales use SuperProfile)
      </p>

      {loading ? (
        <p className="mt-8 text-slate-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="mt-8 text-slate-500">No pending requests</p>
      ) : (
        <div className="mt-8 space-y-4">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 dark:text-slate-100">{r.email}</p>
                <p className="text-sm text-slate-500">UPI ref: {r.upiRef}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                </p>
                <input
                  type="text"
                  placeholder="Optional reject note (internal)"
                  value={rejectReason[r.id] ?? ""}
                  onChange={(e) =>
                    setRejectReason((prev) => ({ ...prev, [r.id]: e.target.value }))
                  }
                  className="mt-2 w-full max-w-sm rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-xs"
                />
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleReject(r.id)}
                  disabled={!!approving || !!rejecting}
                  className="flex items-center gap-2 rounded-lg border border-red-300 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  {rejecting === r.id ? "Rejecting..." : "Reject"}
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(r.id)}
                  disabled={!!approving || !!rejecting}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {approving === r.id ? "Activating..." : "Approve"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Recent decisions (last 50)
          </h2>
          <p className="text-sm text-slate-500 mb-4">Approved or rejected requests, newest first.</p>
          <div className="space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className="rounded-lg border border-slate-100 dark:border-slate-800 px-3 py-2 text-sm flex flex-wrap justify-between gap-2"
              >
                <span className="text-slate-800 dark:text-slate-200">{h.email}</span>
                <span
                  className={
                    h.status === "approved"
                      ? "text-green-600 dark:text-green-400"
                      : "text-amber-600 dark:text-amber-400"
                  }
                >
                  {h.status}
                </span>
                <span className="text-slate-500 text-xs">
                  {h.reviewedAt
                    ? formatDistanceToNow(new Date(h.reviewedAt), { addSuffix: true })
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
