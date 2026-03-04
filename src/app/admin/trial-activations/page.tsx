"use client";

// WBS 10.6 – Admin: approve trial activation requests
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Request {
  id: string;
  email: string;
  upiRef: string;
  status: string;
  createdAt: string;
}

export default function AdminTrialActivationsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  const fetchRequests = () => {
    fetch("/api/admin/trial-activations", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { requests: [] }))
      .then((d) => setRequests(d.requests ?? []))
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
        setRequests((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(data.error ?? "Failed to approve");
      }
    } finally {
      setApproving(null);
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
        Approve 14-day Pro trial requests (users paid ₹1 via UPI)
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
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{r.email}</p>
                <p className="text-sm text-slate-500">UPI ref: {r.upiRef}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleApprove(r.id)}
                disabled={!!approving}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {approving === r.id ? "Activating..." : "Approve"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
