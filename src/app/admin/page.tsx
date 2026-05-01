"use client";

// WBS 11.4, 11.6 – Admin dashboard with template usage stats
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FileText, Download, TrendingUp, BarChart3, Receipt } from "lucide-react";
import { getTemplateDisplayName } from "@/lib/subscription-labels";

interface Stats {
  totalUsers: number;
  totalResumes: number;
  totalExports: number;
  planBreakdown: Record<string, number>;
  trialCount: number;
  recentSignups: Array<{
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    subscription: string;
  }>;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<{
    subscriptionMetrics?: {
      proCount?: number;
      basicCount?: number;
      conversionRate?: number;
      proTrialCount?: number;
      planBreakdown?: Record<string, number>;
    };
    templateUsage?: Record<string, number>;
    featureUsage?: {
      totalExports?: number;
      exports?: Record<string, number>;
      last30Days?: Record<string, number>;
      aiLast30Days?: { total?: number; byAction?: Record<string, number> };
      atsLast30Days?: number;
    };
    productEvents?: {
      volumeByNameLast7Days?: Record<string, number>;
      funnelLast7Days?: Record<string, number>;
      cohortSignupToPaid?: Array<{ weekStart: string; signups: number; paid: number }>;
    };
    masterAdminKpis?: {
      totalResumes: number;
      totalCoverLetters: number;
      totalJobApplications: number;
      churnFeedbackLast30d: number;
      superprofilePurchases: number;
      invoicesPaidCount: number;
      invoicesPaidAmountPaise: number;
      usersEmailVerified: number;
      usersEmailUnverified: number;
      pendingTrialActivations: number;
      dauApprox: number;
      onboardingCompletedLast30d: number;
      signupsLast24h?: number;
      signupsLast7d?: number;
      signupsLast30d?: number;
      invoiceByStatus?: Record<string, number>;
      proTrialExpiring7d?: number;
      proTrialExpiredStillMarked?: number;
      churnByReasonLast30d?: Record<string, number>;
      otpLast24h?: {
        sendSuccessRate: number | null;
        verifySuccessRate: number | null;
        sendAttempts: number;
        verifyAttempts: number;
      };
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentAudit, setRecentAudit] = useState<
    Array<{ id: string; action: string; createdAt: string; userId: string | null; success: boolean }>
  >([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats", { credentials: "include" }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/analytics", { credentials: "include" }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/security-audit?limit=12&page=1", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null
      ),
    ]).then(([s, a, audit]) => {
      setStats(s);
      setAnalytics(a);
      if (audit?.items) setRecentAudit(audit.items);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <p className="text-red-600">Failed to load stats</p>
      </div>
    );
  }

  const pendingActivations = analytics?.masterAdminKpis?.pendingTrialActivations;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, href: "/admin/users" },
    {
      label: "Purchase ledger",
      value: analytics?.masterAdminKpis?.invoicesPaidCount ?? "—",
      icon: Receipt,
      href: "/admin/purchases",
    },
    { label: "Total Resumes", value: stats.totalResumes, icon: FileText },
    { label: "Total Exports", value: stats.totalExports, icon: Download, href: "/admin/export-logs" },
    { label: "Trial Users", value: stats.trialCount, icon: TrendingUp, href: "/admin/trial-sessions" },
    {
      label: "Pending trial approvals",
      value: pendingActivations ?? "—",
      icon: BarChart3,
      href: "/admin/trial-activations",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Admin Overview
      </h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Manage users, view analytics, and monitor trial sessions.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map(({ label, value, icon: Icon, href }) => {
          const card = (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {typeof value === "number" ? value.toLocaleString() : String(value)}
                  </p>
                </div>
              </div>
            </div>
          );
          return href ? (
            <Link key={label} href={href} className="block">
              {card}
            </Link>
          ) : (
            <div key={label}>
              {card}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {analytics?.subscriptionMetrics && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 px-4 py-2">
            <BarChart3 className="h-5 w-5 text-primary-600 shrink-0" />
            <span className="text-sm font-medium text-primary-800 dark:text-primary-200">
              {analytics.subscriptionMetrics.basicCount ?? 0} basic/free ·{" "}
              {analytics.subscriptionMetrics.proCount ?? 0} Pro ·{" "}
              {analytics.subscriptionMetrics.proTrialCount ?? 0} Pro ₹1 trials ·{" "}
              {analytics.subscriptionMetrics.conversionRate ?? 0}% conversion
            </span>
          </div>
        )}
        <a
          href="/api/admin/export?type=users"
          className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Export users CSV
        </a>
        <a
          href="/api/admin/export?type=exports"
          className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Export logs CSV
        </a>
        <a
          href="/api/admin/export?type=purchases&source=all"
          className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Export purchases CSV
        </a>
        <a
          href="/api/admin/export?type=audit_log"
          className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Export audit CSV
        </a>
        <a
          href="/api/admin/export?type=churn"
          className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Export churn CSV
        </a>
      </div>

      {analytics?.productEvents?.funnelLast7Days &&
        Object.keys(analytics.productEvents.funnelLast7Days).length > 0 && (
          <div className="mt-10 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Funnel events (last 7 days)
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
              {Object.entries(analytics.productEvents.funnelLast7Days)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <div key={name} className="flex justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-mono text-xs truncate text-slate-600 dark:text-slate-400" title={name}>
                      {name}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

      {analytics?.productEvents?.cohortSignupToPaid &&
        analytics.productEvents.cohortSignupToPaid.length > 0 && (
          <div className="mt-10 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Weekly signup → paid (approx.)
            </h2>
            <div className="overflow-x-auto text-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                    <th className="pb-2 pr-4">Week starting</th>
                    <th className="pb-2 pr-4">Signups</th>
                    <th className="pb-2">Paid (events)</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.productEvents.cohortSignupToPaid.map((row) => (
                    <tr key={row.weekStart} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2 pr-4 font-mono text-xs">{row.weekStart}</td>
                      <td className="py-2 pr-4">{row.signups}</td>
                      <td className="py-2">{row.paid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {recentAudit.length > 0 && (
        <div className="mt-10 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Recent security / admin events</h2>
            <Link href="/admin/audit-log" className="text-sm font-medium text-primary-600 hover:underline">
              Full audit log
            </Link>
          </div>
          <ul className="space-y-2 text-sm max-h-56 overflow-y-auto">
            {recentAudit.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap gap-x-3 gap-y-1 border-b border-slate-100 dark:border-slate-800 pb-2"
              >
                <span className="text-slate-500 shrink-0">
                  {new Date(row.createdAt).toLocaleString()}
                </span>
                <span className="font-mono text-xs text-slate-500">{row.action}</span>
                <span className={row.success ? "text-emerald-600" : "text-red-600"}>
                  {row.success ? "ok" : "fail"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analytics?.masterAdminKpis && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Product and revenue signals
          </h2>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {(() => {
              const mk = analytics.masterAdminKpis!;
              const rows: [string, string | number][] = [
                ["DAU (approx.)", mk.dauApprox],
                ["Cover letters (all time)", mk.totalCoverLetters],
                ["Job applications (all time)", mk.totalJobApplications],
                ["Churn feedback (30d)", mk.churnFeedbackLast30d],
                ["SuperProfile purchases (events)", mk.superprofilePurchases],
                ["Paid invoices (count)", mk.invoicesPaidCount],
                [
                  "Paid invoices (INR)",
                  (mk.invoicesPaidAmountPaise / 100).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  }),
                ],
                ["Email verified users", mk.usersEmailVerified],
                ["Email unverified users", mk.usersEmailUnverified],
                ["Onboarding completed (30d)", mk.onboardingCompletedLast30d],
              ];
              if (mk.signupsLast24h != null) rows.push(["Signups (24h)", mk.signupsLast24h]);
              if (mk.signupsLast7d != null) rows.push(["Signups (7d)", mk.signupsLast7d]);
              if (mk.signupsLast30d != null) rows.push(["Signups (30d)", mk.signupsLast30d]);
              if (mk.proTrialExpiring7d != null) rows.push(["Pro trial expiring (7d)", mk.proTrialExpiring7d]);
              if (mk.proTrialExpiredStillMarked != null) {
                rows.push(["Pro trial expired (still marked)", mk.proTrialExpiredStillMarked]);
              }
              if (mk.invoiceByStatus && Object.keys(mk.invoiceByStatus).length > 0) {
                rows.push([
                  "Invoices by status",
                  Object.entries(mk.invoiceByStatus)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", "),
                ]);
              }
              if (mk.otpLast24h && (mk.otpLast24h.sendAttempts > 0 || mk.otpLast24h.verifyAttempts > 0)) {
                const o = mk.otpLast24h;
                rows.push([
                  "OTP send success (24h)",
                  o.sendSuccessRate != null ? `${o.sendSuccessRate}%` : "—",
                ]);
                rows.push([
                  "OTP verify success (24h)",
                  o.verifySuccessRate != null ? `${o.verifySuccessRate}%` : "—",
                ]);
              }
              return rows.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm"
                >
                  <p className="text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1 break-words">
                    {value}
                  </p>
                </div>
              ));
            })()}
          </div>
          {analytics.masterAdminKpis.churnByReasonLast30d &&
            Object.keys(analytics.masterAdminKpis.churnByReasonLast30d).length > 0 && (
              <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Churn reasons (30d)
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  {Object.entries(analytics.masterAdminKpis.churnByReasonLast30d)
                    .sort((a, b) => b[1] - a[1])
                    .map(([reason, count]) => (
                      <div key={reason} className="flex justify-between gap-2">
                        <span className="text-slate-600 dark:text-slate-400 truncate" title={reason}>
                          {reason}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      )}

      {analytics?.productEvents?.volumeByNameLast7Days &&
        Object.keys(analytics.productEvents.volumeByNameLast7Days).length > 0 && (
          <div className="mt-10 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Product events by name (last 7 days)
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm max-h-64 overflow-y-auto">
              {Object.entries(analytics.productEvents.volumeByNameLast7Days)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 24)
                .map(([name, count]) => (
                  <div key={name} className="flex justify-between gap-2 text-slate-600 dark:text-slate-400">
                    <span className="truncate font-mono text-xs" title={name}>
                      {name}
                    </span>
                    <span className="shrink-0 font-medium text-slate-900 dark:text-slate-100">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Users by Plan
          </h2>
          <div className="space-y-2">
            {Object.entries(stats.planBreakdown ?? {}).map(([plan, count]) => (
              <div
                key={plan}
                className="flex justify-between text-sm text-slate-600 dark:text-slate-400"
              >
                <span className="capitalize">{((plan === "free" ? "basic" : plan) ?? "basic").replace(/_/g, " ")}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

          <div className="space-y-8">
          {analytics?.featureUsage?.last30Days && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Feature Usage (last 30 days)
              </h2>
              <div className="space-y-2">
                {[
                  { label: "AI Calls", value: analytics.featureUsage.aiLast30Days?.total ?? 0 },
                  { label: "ATS Runs", value: analytics.featureUsage.atsLast30Days ?? 0 },
                  { label: "Exports", value: analytics.featureUsage.last30Days["export"] ?? 0 },
                  { label: "Cover Letters", value: analytics.featureUsage.last30Days["cover_letter"] ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>{label}</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{value.toLocaleString()}</span>
                  </div>
                ))}
                {analytics.featureUsage.aiLast30Days?.byAction && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">AI by action</p>
                    {Object.entries(analytics.featureUsage.aiLast30Days.byAction).map(([action, count]) => (
                      <div key={action} className="flex justify-between text-xs text-slate-500">
                        <span>{action}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Template Usage
            </h2>
            {analytics?.templateUsage && Object.keys(analytics.templateUsage).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(analytics.templateUsage)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([id, count]) => (
                    <div key={id} className="flex justify-between text-sm gap-2">
                      <span className="text-slate-600 dark:text-slate-400 truncate min-w-0" title={id}>
                        {getTemplateDisplayName(id)}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 shrink-0">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No data</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Recent Signups
            </h2>
          {(stats.recentSignups ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">No users yet</p>
          ) : (
            <div className="space-y-3">
              {(stats.recentSignups ?? []).map((u) => (
                <Link
                  key={u.id}
                  href={`/admin/users/${u.id}`}
                  className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded px-2 -mx-2"
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {u.name || u.email}
                  </span>
                  <span className="text-xs text-slate-500 capitalize ml-2">
                    {((u.subscription === "free" ? "basic" : u.subscription) ?? "basic").replace(/_/g, " ")}
                  </span>
                </Link>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
