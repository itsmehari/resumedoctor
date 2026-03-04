"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface TrialSession {
  id: string;
  email: string;
  verifiedAt: string | null;
  sessionExpiresAt: string | null;
  resumeId: string | null;
  createdAt: string;
}

export default function AdminTrialSessionsPage() {
  const [sessions, setSessions] = useState<TrialSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/trial-sessions", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          setError(res.status === 403 ? "Session expired. Please sign in again." : "Failed to load trial sessions.");
          return { sessions: [] };
        }
        return res.json();
      })
      .then((data) => setSessions(data.sessions ?? []))
      .catch(() => setError("Failed to load trial sessions."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Trial Sessions
      </h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Recent trial sessions and OTP verifications.
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
          {error.includes("Session") && (
            <a href="/admin/login" className="ml-2 underline font-medium">
              Sign in
            </a>
          )}
        </div>
      )}
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Verified</th>
              <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Expires</th>
              <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Created</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr
                key={s.id}
                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30"
              >
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {s.email}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {s.verifiedAt
                    ? formatDistanceToNow(new Date(s.verifiedAt), { addSuffix: true })
                    : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {s.sessionExpiresAt
                    ? formatDistanceToNow(new Date(s.sessionExpiresAt), { addSuffix: true })
                    : "—"}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sessions.length === 0 && (
        <p className="mt-6 text-slate-500 text-center">No trial sessions yet</p>
      )}
    </div>
  );
}
