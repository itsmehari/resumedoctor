"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Download, Trash2, Unlink } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { getSubscriptionLabel } from "@/lib/subscription-labels";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { trackEvent } from "@/lib/analytics";

interface ConnectedAccount {
  id: string;
  provider: string;
  type: string;
}

export function SettingsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { subscription, isPro } = useSubscription();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordMsg, setChangePasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [hasPassword, setHasPassword] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [unlinkLoading, setUnlinkLoading] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/user/profile", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.name) setName(data.name);
          if (data.image) setImageUrl(data.image);
        })
        .catch(console.error);
      fetch("/api/user/accounts", { credentials: "include" })
        .then((res) => (res.ok ? res.json() : { accounts: [], hasPassword: true }))
        .then((data: { accounts?: ConnectedAccount[]; hasPassword?: boolean }) => {
          setAccounts(data.accounts ?? []);
          setHasPassword(data.hasPassword ?? true);
        })
        .catch(() => {});
    }
  }, [session?.user?.email]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || null, image: imageUrl || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: typeof data.error === "string" ? data.error : data.error?.name?.[0] ?? "Update failed" });
      } else {
        setMessage({ type: "success", text: "Profile updated" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    }
    setLoading(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChangePasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setChangePasswordMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 8) {
      setChangePasswordMsg({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }
    setChangePasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChangePasswordMsg({ type: "error", text: data.error || "Failed" });
      } else {
        setChangePasswordMsg({ type: "success", text: "Password updated" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setChangePasswordMsg({ type: "error", text: "Something went wrong" });
    }
    setChangePasswordLoading(false);
  }

  function handleExportData() {
    fetch("/api/user/export-data", { credentials: "include" })
      .then((res) => {
        if (!res.ok) return;
        return res.blob();
      })
      .then((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resumedoctor-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      if (res.ok) {
        await signOut({ redirect: false });
        router.push("/");
      }
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  }

  async function handleUnlink(provider: string) {
    setUnlinkLoading(provider);
    try {
      const res = await fetch(`/api/user/accounts/${provider}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setAccounts((prev) => prev.filter((a) => a.provider.toLowerCase() !== provider.toLowerCase()));
      } else {
        alert(data.error || "Failed to unlink");
      }
    } finally {
      setUnlinkLoading(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Please sign in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">ResumeDoctor</Link>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">Dashboard</Link>
            <Link href="/settings" className="text-primary-600 font-medium">Settings</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account settings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage your profile, security, and subscription.</p>

        <section className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Profile</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {message && (
              <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}>
                {message.text}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input type="email" value={session.user?.email || ""} disabled className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-slate-500 cursor-not-allowed" />
              <p className="mt-1 text-xs text-slate-500">Email cannot be changed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Profile picture URL</label>
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100" />
            </div>
            <button type="submit" disabled={loading} className="rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white hover:bg-primary-700 disabled:opacity-50">{loading ? "Saving..." : "Save changes"}</button>
          </form>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Subscription</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Current plan: <span className="font-medium">{getSubscriptionLabel(subscription)}</span>
          </p>
          {!isPro ? (
            <div className="space-y-3">
              <Link href="/pricing" onClick={() => trackEvent("upgrade_click", { source: "settings" })} className="inline-block rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
                Upgrade to Pro
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get PDF & Word export, no watermarks. Choose monthly or annual on the pricing page.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Link href="/pricing" className="inline-block rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                Change plan
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                To cancel or change billing, visit the pricing page or contact support.
              </p>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Connected accounts</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Sign in options linked to your account.</p>
          {accounts.length === 0 ? (
            <p className="text-sm text-slate-500">No OAuth accounts linked</p>
          ) : (
            <ul className="space-y-2">
              {accounts.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="capitalize font-medium">{a.provider}</span>
                  {(accounts.length > 1 || hasPassword) && (
                    <button type="button" onClick={() => handleUnlink(a.provider)} disabled={!!unlinkLoading} className="flex items-center gap-1 text-sm text-red-600 hover:underline disabled:opacity-50">
                      <Unlink className="h-3.5 w-3.5" /> Unlink
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Security</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Change your password.</p>
          {hasPassword ? (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              {changePasswordMsg && (
                <div className={`rounded-lg px-4 py-3 text-sm ${changePasswordMsg.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}>
                  {changePasswordMsg.text}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm new password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800" />
              </div>
              <button type="submit" disabled={changePasswordLoading} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">{changePasswordLoading ? "Updating..." : "Change password"}</button>
            </form>
          ) : (
            <p className="text-sm text-slate-500">No password set. <Link href="/forgot-password" className="text-primary-600 hover:underline">Set via email reset</Link></p>
          )}
        </section>

        {isPro && (
          <section className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Billing & cancellation</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              You’re on Pro. To cancel before the next billing cycle or switch between monthly and annual, contact us at support or use the link below.
            </p>
            <Link href="/pricing" className="inline-block text-primary-600 hover:underline text-sm font-medium">Manage subscription →</Link>
          </section>
        )}

        <section className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Data & Privacy</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Download your data or delete your account.</p>
          <div className="flex flex-wrap gap-4">
            <button type="button" onClick={handleExportData} className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Download className="h-4 w-4" /> Download my data
            </button>
            <button type="button" onClick={() => setDeleteConfirmOpen(true)} className="flex items-center gap-2 rounded-lg border border-red-300 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 className="h-4 w-4" /> Delete account
            </button>
          </div>
        </section>
      </main>

      <ConfirmDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen} title="Delete account?" description="All your data will be permanently deleted. This cannot be undone." confirmLabel="Delete my account" variant="danger" onConfirm={handleDeleteAccount} loading={deleteLoading} />
    </div>
  );
}
