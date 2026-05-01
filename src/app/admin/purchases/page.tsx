"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { format } from "date-fns";

type SourceTab = "all" | "invoice" | "superprofile";

type PurchaseRow = {
  id: string;
  source: "invoice" | "superprofile";
  createdAt: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  planOrProduct: string;
  amountPaise: number | null;
  currency: string;
  status: string;
  externalRef: string | null;
  idempotencyKey: string | null;
  pdfUrl: string | null;
};

type PurchasesResponse = {
  source: SourceTab;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: PurchaseRow[];
};

function money(amountPaise: number | null, currency: string) {
  if (amountPaise == null) return "—";
  const main = amountPaise / 100;
  return `${currency} ${main.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function AdminPurchasesPage() {
  const [tab, setTab] = useState<SourceTab>("all");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [qInput, setQInput] = useState("");
  const [qApplied, setQApplied] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState<PurchasesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      setQInput(q);
      setQApplied(q);
    }
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      source: tab,
      page: String(page),
      pageSize: "25",
    });
    if (status) params.set("status", status);
    if (plan.trim()) params.set("plan", plan.trim());
    if (qApplied.trim()) params.set("q", qApplied.trim());
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    fetch(`/api/admin/purchases?${params}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, [tab, page, status, plan, qApplied, from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const exportHref = (() => {
    const params = new URLSearchParams({ type: "purchases", source: tab });
    if (status) params.set("status", status);
    if (plan.trim()) params.set("plan", plan.trim());
    if (qApplied.trim()) params.set("q", qApplied.trim());
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return `/api/admin/export?${params}`;
  })();

  return (
    <div className="p-8 max-w-[1200px]">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to admin
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Purchases</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Invoices (Stripe/manual) and SuperProfile automation events, newest first.
          </p>
        </div>
        <a
          href={exportHref}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </a>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        {(
          [
            ["all", "All"],
            ["invoice", "Invoices"],
            ["superprofile", "SuperProfile"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setTab(key);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === key
                ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Search email / name</label>
          <input
            type="search"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQApplied(qInput.trim());
                setPage(1);
              }
            }}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900 w-48"
            placeholder="Filter…"
          />
        </div>
        {(tab === "all" || tab === "invoice") && (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Invoice status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
            >
              <option value="">Any</option>
              <option value="paid">paid</option>
              <option value="pending">pending</option>
              <option value="refunded">refunded</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Plan / product</label>
          <input
            type="text"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900 w-36"
            placeholder="e.g. pro_monthly"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setQApplied(qInput.trim());
            setPage(1);
          }}
          className="rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-4 py-2 text-sm font-medium"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : !data ? (
        <p className="text-red-600">Failed to load</p>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-3">
            {data.total.toLocaleString()} row{data.total === 1 ? "" : "s"} · page {data.page} of {data.totalPages}
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-left">
                  <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">When</th>
                  <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Source</th>
                  <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">User</th>
                  <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Plan / product</th>
                  <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                  <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                  <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Ref</th>
                </tr>
              </thead>
              <tbody>
                {data.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No rows match
                    </td>
                  </tr>
                ) : (
                  data.items.map((row) => (
                    <tr
                      key={`${row.source}-${row.id}`}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                    >
                      <td className="p-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {format(new Date(row.createdAt), "yyyy-MM-dd HH:mm")}
                      </td>
                      <td className="p-3">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono">
                          {row.source}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/admin/users/${row.userId}`}
                          className="font-medium text-primary-600 hover:underline"
                        >
                          {row.userName || row.userEmail}
                        </Link>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]" title={row.userEmail}>
                          {row.userEmail}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs">{row.planOrProduct}</td>
                      <td className="p-3">{money(row.amountPaise, row.currency)}</td>
                      <td className="p-3">{row.status}</td>
                      <td className="p-3 text-xs font-mono max-w-[140px] truncate" title={row.externalRef || row.idempotencyKey || ""}>
                        {row.externalRef || row.idempotencyKey || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
