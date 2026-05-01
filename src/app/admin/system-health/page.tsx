"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Metrics {
  generatedAt: string;
  otp: {
    last24h: {
      send: { success: number; fail: number };
      verify: { success: number; fail: number };
      sendSuccessRatePct: number | null;
      verifySuccessRatePct: number | null;
    };
    totalAttemptsLast7d: number;
  };
  ipRateLimit: { activeWindowRows: number };
}

export default function AdminSystemHealthPage() {
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/system-metrics", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to admin
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">System health</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Read-only counters for OTP abuse signals and active IP rate-limit windows.
      </p>

      {loading ? (
        <p className="mt-8 text-slate-500">Loading…</p>
      ) : !data ? (
        <p className="mt-8 text-red-600">Failed to load</p>
      ) : (
        <div className="mt-8 space-y-6">
          <p className="text-xs text-slate-500">Snapshot: {new Date(data.generatedAt).toLocaleString()}</p>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">OTP attempts (last 24h)</h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>
                Send — success: {data.otp.last24h.send.success}, fail:{" "}
                {data.otp.last24h.send.fail}
              </li>
              <li>
                Verify — success: {data.otp.last24h.verify.success}, fail:{" "}
                {data.otp.last24h.verify.fail}
              </li>
              <li>
                Success rates — send:{" "}
                {data.otp.last24h.sendSuccessRatePct != null
                  ? `${data.otp.last24h.sendSuccessRatePct}%`
                  : "—"}
                , verify:{" "}
                {data.otp.last24h.verifySuccessRatePct != null
                  ? `${data.otp.last24h.verifySuccessRatePct}%`
                  : "—"}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">OTP (7 days)</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total rows (send + verify): {data.otp.totalAttemptsLast7d}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">IP rate limit</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Active window rows (window end in future): {data.ipRateLimit.activeWindowRows}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
