"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Promo {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiresAt: string | null;
  usageLimit: number | null;
  usageCount: number;
  createdAt: string;
}

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: "percent" as "percent" | "fixed",
    discountValue: "",
    expiresAt: "",
    usageLimit: "",
  });

  const load = () => {
    fetch("/api/admin/promos", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { promos: [] }))
      .then((d) => setPromos(d.promos ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const discountValue = parseInt(form.discountValue, 10);
      if (Number.isNaN(discountValue) || discountValue <= 0) {
        alert("Discount value must be a positive integer");
        return;
      }
      const body: Record<string, unknown> = {
        code: form.code.trim(),
        discountType: form.discountType,
        discountValue,
      };
      if (form.expiresAt.trim()) {
        body.expiresAt = new Date(form.expiresAt).toISOString();
      } else {
        body.expiresAt = null;
      }
      if (form.usageLimit.trim()) {
        const lim = parseInt(form.usageLimit, 10);
        if (!Number.isNaN(lim) && lim > 0) body.usageLimit = lim;
      }
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({
          code: "",
          discountType: "percent",
          discountValue: "",
          expiresAt: "",
          usageLimit: "",
        });
        load();
      } else {
        alert(data.error ? JSON.stringify(data.error) : data.error ?? "Failed");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Delete promo ${code}?`)) return;
    const res = await fetch(`/api/admin/promos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) load();
    else alert("Delete failed");
  };

  return (
    <div className="p-8 max-w-5xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to admin
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Promo codes</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Codes are stored uppercase. <strong>Percent:</strong> e.g. 20 means 20% off.{" "}
        <strong>Fixed:</strong> amount in <strong>paise</strong> (₹100 off = 10000) — same as checkout
        validation.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
      >
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Create promo</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Code</label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
            <select
              value={form.discountType}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  discountType: e.target.value as "percent" | "fixed",
                }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800 text-sm"
            >
              <option value="percent">percent</option>
              <option value="fixed">fixed (paise)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Discount value</label>
            <input
              required
              type="number"
              min={1}
              value={form.discountValue}
              onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Expires (optional)</label>
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Usage limit (optional)</label>
            <input
              type="number"
              min={1}
              value={form.usageLimit}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={creating}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create"}
        </button>
      </form>

      {loading ? (
        <p className="mt-8 text-slate-500">Loading…</p>
      ) : (
        <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Value</th>
                <th className="text-left p-3">Uses</th>
                <th className="text-left p-3">Expires</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3" />
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="p-3 font-mono">{p.code}</td>
                  <td className="p-3">{p.discountType}</td>
                  <td className="p-3">{p.discountValue}</td>
                  <td className="p-3">
                    {p.usageCount}
                    {p.usageLimit != null ? ` / ${p.usageLimit}` : ""}
                  </td>
                  <td className="p-3 text-slate-500">
                    {p.expiresAt
                      ? formatDistanceToNow(new Date(p.expiresAt), { addSuffix: true })
                      : "—"}
                  </td>
                  <td className="p-3 text-slate-500 text-xs">
                    {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.code)}
                      className="text-red-600 dark:text-red-400 p-1"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
