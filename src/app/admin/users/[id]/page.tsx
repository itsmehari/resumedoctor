"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  resumePackCredits?: number;
  createdAt: string;
  emailVerified: string | null;
  accounts: Array<{ id: string; provider: string; type: string }>;
  sessions: Array<{ id: string; expires: string }>;
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

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editRole, setEditRole] = useState("");
  const [editSubscription, setEditSubscription] = useState("");
  const [editName, setEditName] = useState("");
  const [editPackCredits, setEditPackCredits] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);

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
        <div className="flex items-center gap-3">
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
