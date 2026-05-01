"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Save } from "lucide-react";

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  subscription: string;
  subscriptionId: string | null;
  billingProvider?: string | null;
  stripeCustomerId?: string | null;
  subscriptionExpiresAt?: string | null;
  onboardingCompletedAt?: string | null;
  resumePackCredits?: number;
  createdAt: string;
  emailVerified: string | null;
  accounts: Array<{ id: string; provider: string; type: string }>;
  sessions: Array<{ id: string; expires: string }>;
  invoices: Array<{
    id: string;
    plan: string;
    amount: number;
    currency: string;
    status: string;
    externalRef: string | null;
    pdfUrl: string | null;
    createdAt: string;
  }>;
  superprofilePurchases: Array<{
    id: string;
    productKey: string;
    email: string;
    idempotencyKey: string;
    createdAt: string;
  }>;
  resumes: Array<{
    id: string;
    title: string;
    templateId: string;
    updatedAt: string;
    _count: { exportLogs: number };
  }>;
  exportLogs: Array<{
    id: string;
    format: string;
    createdAt: string;
    resumeId: string;
  }>;
}

type ActivityItem = {
  at: string;
  kind: string;
  label: string;
  detail?: Record<string, unknown>;
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editRole, setEditRole] = useState("");
  const [editSubscription, setEditSubscription] = useState("");
  const [editName, setEditName] = useState("");
  const [editPackCredits, setEditPackCredits] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityItem[] | null>(null);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((u) => {
        setUser(u);
        if (u) {
          setEditRole(u.role);
          setEditSubscription(u.subscription === "free" ? "basic" : u.subscription);
          setEditName(u.name ?? "");
          setEditPackCredits(u.resumePackCredits ?? 0);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch(`/api/admin/users/${id}/activity`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items) setActivity(data.items as ActivityItem[]);
      });
  }, [id]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: editRole,
          subscription: editSubscription,
          name: editName || null,
          resumePackCredits: editPackCredits,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser({ ...user, ...updated });
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error || "Failed to save changes");
      }
    } catch {
      setSaveError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const reloadUser = () => {
    fetch(`/api/admin/users/${id}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((u) => {
        if (u) setUser(u);
      });
  };

  const handleRevokeSessions = async () => {
    if (user?.role === "admin") {
      alert("Cannot revoke sessions for admin accounts from here.");
      return;
    }
    if (
      !window.confirm(
        "Delete all server sessions for this user? They must sign in again on every device."
      )
    ) {
      return;
    }
    setRevoking(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/revoke-sessions`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert(`Sessions revoked (${data.deletedCount ?? 0} removed).`);
        reloadUser();
      } else {
        alert(data.error ?? "Failed");
      }
    } finally {
      setRevoking(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="p-8">
        <p className="text-slate-500">{loading ? "Loading..." : "User not found"}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to users
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {user.name || user.email}
          </h1>
          <p className="text-slate-500 mt-1">{user.email}</p>
          <p className="text-sm text-slate-400 mt-1">
            Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {user.role !== "admin" && (
            <button
              type="button"
              onClick={handleRevokeSessions}
              disabled={revoking}
              className="flex items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-800 px-4 py-2 text-sm font-medium text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50"
            >
              {revoking ? "Revoking…" : "Revoke all sessions"}
            </button>
          )}
          <button
            type="button"
            onClick={async () => {
              const res = await fetch(`/api/admin/impersonate?userId=${id}`, {
                method: "POST",
                credentials: "include",
              });
              if (res.ok) window.location.href = "/dashboard";
              else alert("Failed to impersonate");
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Impersonate (View as user)
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Edit User
          </h2>
          {saveError && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {saveError}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Role
              </label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Plan
              </label>
              <select
                value={editSubscription}
                onChange={(e) => setEditSubscription(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="basic">Basic</option>
                <option value="trial">Trial</option>
                <option value="pro_trial_14">Pro Trial (14-day, SuperProfile)</option>
                <option value="pro_monthly">Pro Monthly</option>
                <option value="pro_annual">Pro Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Resume Pack credits (PDF/DOCX for basic users)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={editPackCredits}
                onChange={(e) => setEditPackCredits(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Connected Accounts
          </h2>
          {user.accounts.length === 0 ? (
            <p className="text-sm text-slate-500">No OAuth accounts linked</p>
          ) : (
            <ul className="space-y-2">
              {user.accounts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <span className="capitalize font-medium">{a.provider}</span>
                  <span className="text-slate-500">({a.type})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Billing</h2>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Billing provider</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {user.billingProvider ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Stripe customer</dt>
              <dd className="font-mono text-xs break-all text-slate-800 dark:text-slate-200">
                {user.stripeCustomerId ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Subscription expires</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {user.subscriptionExpiresAt
                  ? formatDistanceToNow(new Date(user.subscriptionExpiresAt), { addSuffix: true })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Onboarding completed</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {user.onboardingCompletedAt
                  ? formatDistanceToNow(new Date(user.onboardingCompletedAt), { addSuffix: true })
                  : "—"}
              </dd>
            </div>
          </dl>
          <div className="mt-4">
            <Link
              href={`/admin/purchases?q=${encodeURIComponent(user.email)}`}
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              View in Purchases ledger →
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Invoices ({user.invoices?.length ?? 0})
          </h2>
          {!(user.invoices ?? []).length ? (
            <p className="text-sm text-slate-500">No invoices</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-500">
                    <th className="pb-2 pr-3">When</th>
                    <th className="pb-2 pr-3">Plan</th>
                    <th className="pb-2 pr-3">Amount</th>
                    <th className="pb-2 pr-3">Status</th>
                    <th className="pb-2">Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {(user.invoices ?? []).map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 pr-3 text-slate-600">
                        {formatDistanceToNow(new Date(inv.createdAt), { addSuffix: true })}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs">{inv.plan}</td>
                      <td className="py-2 pr-3">
                        {(inv.amount / 100).toLocaleString()} {inv.currency}
                      </td>
                      <td className="py-2 pr-3">{inv.status}</td>
                      <td className="py-2 font-mono text-xs truncate max-w-[120px]" title={inv.externalRef ?? ""}>
                        {inv.externalRef ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            SuperProfile purchase events ({user.superprofilePurchases?.length ?? 0})
          </h2>
          {!(user.superprofilePurchases ?? []).length ? (
            <p className="text-sm text-slate-500">No automation purchase rows</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-500">
                    <th className="pb-2 pr-3">When</th>
                    <th className="pb-2 pr-3">Product</th>
                    <th className="pb-2 pr-3">Email (payload)</th>
                    <th className="pb-2">Idempotency</th>
                  </tr>
                </thead>
                <tbody>
                  {(user.superprofilePurchases ?? []).map((ev) => (
                    <tr key={ev.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 pr-3 text-slate-600">
                        {formatDistanceToNow(new Date(ev.createdAt), { addSuffix: true })}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs">{ev.productKey}</td>
                      <td className="py-2 pr-3 text-xs">{ev.email}</td>
                      <td className="py-2 font-mono text-xs truncate max-w-[140px]" title={ev.idempotencyKey}>
                        {ev.idempotencyKey}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Resumes ({user.resumes.length})
          </h2>
          {user.resumes.length === 0 ? (
            <p className="text-sm text-slate-500">No resumes</p>
          ) : (
            <div className="space-y-2">
              {user.resumes.map((r) => (
                <Link
                  key={r.id}
                  href={`/resumes/${r.id}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {r.title}
                  </span>
                  <span className="text-sm text-slate-500">
                    {r._count.exportLogs} exports • Updated{" "}
                    {formatDistanceToNow(new Date(r.updatedAt), { addSuffix: true })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Activity timeline
          </h2>
          {activity === null ? (
            <p className="text-sm text-slate-500">Loading activity…</p>
          ) : activity.length === 0 ? (
            <p className="text-sm text-slate-500">No tracked activity yet</p>
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto text-sm">
              {activity.slice(0, 40).map((row, i) => (
                <li
                  key={`${row.at}-${row.kind}-${row.label}-${i}`}
                  className="flex flex-wrap gap-x-3 gap-y-1 border-b border-slate-100 dark:border-slate-800 pb-2"
                >
                  <span className="text-slate-500 shrink-0">
                    {formatDistanceToNow(new Date(row.at), { addSuffix: true })}
                  </span>
                  <span className="font-mono text-xs text-slate-500">{row.kind}</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{row.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Recent Exports ({user.exportLogs.length})
          </h2>
          {user.exportLogs.length === 0 ? (
            <p className="text-sm text-slate-500">No exports</p>
          ) : (
            <div className="space-y-2">
              {user.exportLogs.slice(0, 20).map((e) => (
                <div
                  key={e.id}
                  className="flex justify-between items-center py-2 px-3 text-sm"
                >
                  <span className="text-slate-700 dark:text-slate-300 uppercase">
                    {e.format}
                  </span>
                  <span className="text-slate-500">
                    {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
