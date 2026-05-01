"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Download, Trash2, Unlink, FileText, CreditCard, ShieldCheck } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { getSubscriptionLabel } from "@/lib/subscription-labels";
import { UserDashboardLayout } from "@/components/user-dashboard-layout";
import { DeleteAccountDialog } from "@/components/settings/delete-account-dialog";
import { CancelSubscriptionDialog } from "@/components/settings/cancel-subscription-dialog";
import { trackEvent } from "@/lib/analytics";

interface ConnectedAccount {
  id: string;
  provider: string;
  type: string;
}

export function SettingsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subscription, isPro, resumePackCredits, subscriptionExpiresAt } = useSubscription();
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
  const [unlinkLoading, setUnlinkLoading] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<Array<{ id: string; resumeId: string; resumeTitle: string; format: string; createdAt: string }>>([]);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [notificationMarketing, setNotificationMarketing] = useState(true);
  const [notificationProduct, setNotificationProduct] = useState(true);
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [emailChangeMsg, setEmailChangeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [emailChangePassword, setEmailChangePassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSetupOpen, setTwoFactorSetupOpen] = useState(false);
  const [twoFactorVerifyCode, setTwoFactorVerifyCode] = useState("");
  const [twoFactorVerifyLoading, setTwoFactorVerifyLoading] = useState(false);
  const [twoFactorQrCode, setTwoFactorQrCode] = useState<string | null>(null);
  const [twoFactorBackupCodes, setTwoFactorBackupCodes] = useState<string[] | null>(null);
  const [twoFactorDisableOpen, setTwoFactorDisableOpen] = useState(false);
  const [twoFactorDisablePassword, setTwoFactorDisablePassword] = useState("");
  const [twoFactorDisableCode, setTwoFactorDisableCode] = useState("");
  const [twoFactorDisableLoading, setTwoFactorDisableLoading] = useState(false);
  const [invoices, setInvoices] = useState<Array<{ id: string; amount: number; currency: string; plan: string; status: string; pdfUrl?: string; createdAt: string }>>([]);
  const [cancelSubscriptionOpen, setCancelSubscriptionOpen] = useState(false);
  const paymentActivated = searchParams.get("upgraded") === "1" || searchParams.get("payment") === "success";

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/user/profile", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.name) setName(data.name);
          if (data.image) setImageUrl(data.image);
          if (data.notificationPrefs) {
            setNotificationMarketing(data.notificationPrefs?.marketing !== false);
            setNotificationProduct(data.notificationPrefs?.productUpdates !== false);
          }
        })
        .catch(console.error);
      fetch("/api/user/2fa/status", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : { enabled: false }))
        .then((d) => setTwoFactorEnabled(d.enabled ?? false))
        .catch(() => setTwoFactorEnabled(false));
      fetch("/api/user/invoices", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : { invoices: [] }))
        .then((d) => setInvoices(d.invoices ?? []))
        .catch(() => setInvoices([]));
      fetch("/api/user/accounts", { credentials: "include" })
        .then((res) => (res.ok ? res.json() : { accounts: [], hasPassword: true }))
        .then((data: { accounts?: ConnectedAccount[]; hasPassword?: boolean }) => {
          setAccounts(data.accounts ?? []);
          setHasPassword(data.hasPassword ?? true);
        })
        .catch(() => {});
      fetch("/api/user/export-history", { credentials: "include" })
        .then((res) => (res.ok ? res.json() : { logs: [] }))
        .then((data: { logs?: Array<{ id: string; resumeId: string; resumeTitle: string; format: string; createdAt: string }> }) => {
          setExportHistory(data.logs ?? []);
        })
        .catch(() => setExportHistory([]));
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
        body: JSON.stringify({
          name: name || null,
          image: imageUrl || null,
          notificationPrefs: { marketing: notificationMarketing, productUpdates: notificationProduct },
        }),
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

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/user/avatar/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        setMessage({ type: "success", text: "Profile picture updated" });
      } else {
        setMessage({ type: "error", text: data.error ?? "Upload failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Upload failed" });
    } finally {
      setAvatarLoading(false);
      e.target.value = "";
    }
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailChangeMsg(null);
    if (!newEmail.trim()) return;
    setEmailChangeLoading(true);
    try {
      const res = await fetch("/api/user/change-email/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newEmail: newEmail.trim(), password: emailChangePassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailChangeMsg({ type: "success", text: "Verification email sent to your new address. Check your inbox." });
        setNewEmail("");
        setEmailChangePassword("");
      } else {
        setEmailChangeMsg({ type: "error", text: data.error ?? "Failed" });
      }
    } catch {
      setEmailChangeMsg({ type: "error", text: "Something went wrong" });
    }
    setEmailChangeLoading(false);
  }

  async function handle2FASetup() {
    setTwoFactorSetupOpen(true);
    setTwoFactorQrCode(null);
    setTwoFactorVerifyCode("");
    try {
      const res = await fetch("/api/user/2fa/setup", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (res.ok && data.qrCode) setTwoFactorQrCode(data.qrCode);
    } catch {
      setTwoFactorSetupOpen(false);
    }
  }

  async function handle2FAVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!twoFactorVerifyCode.trim()) return;
    setTwoFactorVerifyLoading(true);
    try {
      const res = await fetch("/api/user/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: twoFactorVerifyCode.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.backupCodes) {
        setTwoFactorBackupCodes(data.backupCodes);
        setTwoFactorEnabled(true);
      } else {
        alert(data.error ?? "Invalid code");
      }
    } catch {
      alert("Something went wrong");
    }
    setTwoFactorVerifyLoading(false);
  }

  async function handle2FADisable(e: React.FormEvent) {
    e.preventDefault();
    setTwoFactorDisableLoading(true);
    try {
      const res = await fetch("/api/user/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: twoFactorDisablePassword, code: twoFactorDisableCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setTwoFactorEnabled(false);
        setTwoFactorDisableOpen(false);
        setTwoFactorDisablePassword("");
        setTwoFactorDisableCode("");
      } else {
        alert(data.error ?? "Failed");
      }
    } catch {
      alert("Something went wrong");
    }
    setTwoFactorDisableLoading(false);
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
    <UserDashboardLayout
      title="Account settings"
      subtitle="Manage your profile, security, and subscription."
    >
        {paymentActivated && (
          <section className="mb-6 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 shadow-sm">
            <h2 className="font-semibold text-green-800 dark:text-green-200">Payment received. Pro is active.</h2>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              You can now export PDF/Word and use full templates. If anything looks wrong, refresh once or use
              Billing support below.
            </p>
          </section>
        )}

        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
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
              <p className="mt-1 text-xs text-slate-500">Change email below (requires verification).</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profile picture</label>
              <div className="flex items-center gap-4">
                {imageUrl && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- user URL or blob */}
                    <img src={imageUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-600" />
                  </>
                )}
                <div>
                  <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                    {avatarLoading ? "Uploading..." : "Upload image"}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={handleAvatarUpload} disabled={avatarLoading} />
                  </label>
                  <p className="mt-1 text-xs text-slate-500">JPEG, PNG, WebP, GIF. Max 2MB.</p>
                </div>
              </div>
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste image URL" className="mt-2 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm" />
            </div>
            <button type="submit" disabled={loading} className="rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white hover:bg-primary-700 disabled:opacity-50">{loading ? "Saving..." : "Save changes"}</button>
          </form>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Change email</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">You will receive a verification link at your new address.</p>
          <form onSubmit={handleEmailChange} className="space-y-4 max-w-md">
            {emailChangeMsg && (
              <div className={`rounded-lg px-4 py-3 text-sm ${emailChangeMsg.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}>{emailChangeMsg.text}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New email</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current password</label>
              <input type="password" value={emailChangePassword} onChange={(e) => setEmailChangePassword(e.target.value)} placeholder="Enter password" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800" required />
            </div>
            <button type="submit" disabled={emailChangeLoading} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">{emailChangeLoading ? "Sending..." : "Send verification email"}</button>
          </form>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Notification preferences</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Choose which emails you want to receive.</p>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={notificationMarketing} onChange={(e) => setNotificationMarketing(e.target.checked)} className="rounded border-slate-300 dark:border-slate-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Marketing and tips</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={notificationProduct} onChange={(e) => setNotificationProduct(e.target.checked)} className="rounded border-slate-300 dark:border-slate-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Product updates</span>
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">Saved when you click Save changes in Profile.</p>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Export history</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Recent exports of your resumes.</p>
          {exportHistory.length === 0 ? (
            <p className="text-sm text-slate-500">No exports yet.</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {exportHistory.map((log) => (
                <li key={log.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span className="font-medium truncate max-w-[200px]" title={log.resumeTitle}>{log.resumeTitle}</span>
                    <span className="uppercase text-xs text-slate-500">{log.format}</span>
                  </span>
                  <span className="text-slate-500 text-xs">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-primary-50/90 to-white px-6 py-4 dark:border-slate-800 dark:from-primary-950/30 dark:to-slate-900">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
              <CreditCard className="h-5 w-5 text-primary-600" />
              Billing & subscription
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Current plan:{" "}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {getSubscriptionLabel(subscription, subscriptionExpiresAt)}
              </span>
              {resumePackCredits > 0 && (
                <span className="ml-2 font-medium text-primary-600 dark:text-primary-400">
                  · {resumePackCredits} export credit{resumePackCredits !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          <div className="p-6">
            {!isPro ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Unlock PDF & Word export, more AI, and every template. Pay once on SuperProfile (same email as here)—no
                  surprise renewals.
                </p>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {["High-quality PDF and DOCX export", "30+ premium templates, no watermarks", "Higher ATS and AI limits"].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <Link
                    href="/pricing"
                    onClick={() => trackEvent("upgrade_click", { source: "settings" })}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-900/10 hover:bg-primary-700"
                  >
                    View plans & upgrade
                  </Link>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary-500" aria-hidden />
                    Use the same email on SuperProfile and ResumeDoctor.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/80"
                  >
                    View plans & pricing
                  </Link>
                  <button
                    type="button"
                    onClick={() => setCancelSubscriptionOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/80"
                  >
                    Refund or feedback
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You have access from your SuperProfile purchase. For billing help or a refund, use Refund or feedback or
                  see the pricing page.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-900/20 p-6 shadow-sm">
          <h2 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Payment help</h2>
          <p className="text-sm text-amber-900/90 dark:text-amber-200/90">
            Paid on SuperProfile but Pro is not active? This usually means checkout used a different email.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-amber-900/90 dark:text-amber-200/90">
            <li>1) Confirm your account email above.</li>
            <li>2) Open pricing and pay with this same email.</li>
            <li>3) If you already paid with another email, contact support with your receipt email.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              Open pricing
            </Link>
            <a
              href="mailto:support@resumedoctor.in?subject=Payment%20activation%20help"
              className="inline-flex items-center rounded-lg border border-amber-400 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900/30"
            >
              Contact support
            </a>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Connected accounts</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Sign in options linked to your account.</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 border border-slate-100 dark:border-slate-700">
            <strong className="font-medium text-slate-800 dark:text-slate-200">Google or LinkedIn sign-in</strong> usually
            confirms your email with the provider, so you may skip the separate email verification step used for
            password-only accounts. If you add a password later, use the same email—you may still need to verify for
            sensitive actions.
          </p>
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

        <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Two-factor authentication</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Add an extra layer of security with an authenticator app (e.g. Google Authenticator, Authy).</p>
          {twoFactorEnabled ? (
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">2FA is enabled</p>
              <button type="button" onClick={() => setTwoFactorDisableOpen(true)} className="rounded-lg border border-red-300 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Disable 2FA</button>
            </div>
          ) : (
            <button type="button" onClick={handle2FASetup} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Enable 2FA</button>
          )}
          {twoFactorSetupOpen && (
            <div className="mt-6 p-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
              {twoFactorBackupCodes ? (
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">2FA enabled – save your backup codes</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Store these codes in a safe place. Each can be used once if you lose your authenticator.</p>
                  <div className="font-mono text-sm bg-white dark:bg-slate-800 p-3 rounded mb-3">{twoFactorBackupCodes.join("  ")}</div>
                  <button type="button" onClick={() => { setTwoFactorSetupOpen(false); setTwoFactorBackupCodes(null); setTwoFactorQrCode(null); }} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white">Done</button>
                </div>
              ) : twoFactorQrCode ? (
                <form onSubmit={handle2FAVerify}>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Scan with your authenticator app</h3>
                  {/* eslint-disable-next-line @next/next/no-img-element -- data URL from 2FA setup */}
                  <img src={twoFactorQrCode} alt="QR code" className="mb-4 rounded" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Enter the 6-digit code from your app:</p>
                  <input type="text" value={twoFactorVerifyCode} onChange={(e) => setTwoFactorVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="000000" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 mb-2" maxLength={8} />
                  <div className="flex gap-2">
                    <button type="submit" disabled={twoFactorVerifyLoading || twoFactorVerifyCode.length < 6} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Verify & enable</button>
                    <button type="button" onClick={() => { setTwoFactorSetupOpen(false); setTwoFactorQrCode(null); setTwoFactorVerifyCode(""); }} className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm text-slate-700 dark:text-slate-300">Cancel</button>
                  </div>
                </form>
              ) : (
                <p className="text-slate-500">Loading QR code...</p>
              )}
            </div>
          )}
          {twoFactorDisableOpen && (
            <div className="mt-6 p-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Disable 2FA</h3>
              <form onSubmit={handle2FADisable} className="space-y-3">
                <input type="password" value={twoFactorDisablePassword} onChange={(e) => setTwoFactorDisablePassword(e.target.value)} placeholder="Password" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2" required />
                <input type="text" value={twoFactorDisableCode} onChange={(e) => setTwoFactorDisableCode(e.target.value)} placeholder="6-digit code or backup code" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2" required />
                <div className="flex gap-2">
                  <button type="submit" disabled={twoFactorDisableLoading} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">Disable</button>
                  <button type="button" onClick={() => { setTwoFactorDisableOpen(false); setTwoFactorDisablePassword(""); setTwoFactorDisableCode(""); }} className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm text-slate-700 dark:text-slate-300">Cancel</button>
                </div>
              </form>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
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

        {false && isPro && (
          <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Billing & cancellation</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              You’re on Pro. To cancel before the next billing cycle or switch between monthly and annual, contact us at support or use the link below.
            </p>
            <Link href="/pricing" className="inline-block text-primary-600 hover:underline text-sm font-medium">Manage subscription →</Link>
          </section>
        )}

        <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
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

      <DeleteAccountDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        accountEmail={session?.user?.email ?? ""}
        onDeleted={async () => {
          await signOut({ redirect: false });
          router.push("/");
        }}
      />
      <CancelSubscriptionDialog open={cancelSubscriptionOpen} onOpenChange={setCancelSubscriptionOpen} />
    </UserDashboardLayout>
  );
}
