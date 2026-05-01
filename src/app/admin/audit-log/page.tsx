"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Row {
  id: string;
  action: string;
  userId: string | null;
  ip: string | null;
  meta: unknown;
  success: boolean;
  createdAt: string;
}

export default function AdminAuditLogPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = (p: number, action: string) => {
    setLoading(true);
    const q = new URLSearchParams({ page: String(p), limit: "30" });
    if (action.trim()) q.set("action", action.trim());
    fetch(`/api/admin/security-audit?${q}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setItems(d.items ?? []);
          setTotalPages(d.pagination?.totalPages ?? 1);
          setPage(d.pagination?.page ?? p);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1, actionFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload on filter submit only via button
  }, []);

  return (
    <div className="p-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to admin
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Security audit log</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">
        Server-side security and admin actions (may include PII in meta—keep admin access restricted).
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Filter by action (contains)</label>
          <input
            type="text"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            placeholder="e.g. admin_ or delete"
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm w-64"
          />
        </div>
        <button
          type="button"
          onClick={() => load(1, actionFilter)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Apply
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-slate-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-slate-500">No rows</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="text-left p-3 font-medium">When</th>
                <th className="text-left p-3 font-medium">Action</th>
                <th className="text-left p-3 font-medium">User id</th>
                <th className="text-left p-3 font-medium">IP</th>
                <th className="text-left p-3 font-medium">OK</th>
                <th className="text-left p-3 font-medium">Meta</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 dark:border-slate-800 align-top"
                >
                  <td className="p-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    <span title={new Date(row.createdAt).toISOString()}>
                      {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs">{row.action}</td>
                  <td className="p-3 font-mono text-xs max-w-[120px] truncate" title={row.userId ?? ""}>
                    {row.userId ?? "—"}
                  </td>
                  <td className="p-3 font-mono text-xs">{row.ip ?? "—"}</td>
                  <td className="p-3">{row.success ? "yes" : "no"}</td>
                  <td className="p-3 max-w-md">
                    <button
                      type="button"
                      className="text-primary-600 dark:text-primary-400 text-xs underline"
                      onClick={() =>
                        setExpanded((e) => ({ ...e, [row.id]: !e[row.id] }))
                      }
                    >
                      {expanded[row.id] ? "Hide" : "Show"} JSON
                    </button>
                    {expanded[row.id] && (
                      <pre className="mt-2 text-xs bg-slate-100 dark:bg-slate-900 p-2 rounded overflow-x-auto max-h-48">
                        {JSON.stringify(row.meta, null, 2)}
                      </pre>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => load(page - 1, actionFilter)}
            className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => load(page + 1, actionFilter)}
            className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
