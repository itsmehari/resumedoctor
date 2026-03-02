"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FileText, Download, TrendingUp, BarChart3 } from "lucide-react";

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
    subscriptionMetrics?: { proCount?: number; conversionRate?: number };
    templateUsage?: Record<string, number>;
    featureUsage?: { totalExports?: number; exports?: Record<string, number> };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats", { credentials: "include" }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/analytics", { credentials: "include" }).then((r) => (r.ok ? r.json() : null)),
    ]).then(([s, a]) => {
      setStats(s);
      setAnalytics(a);
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

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, href: "/admin/users" },
    { label: "Total Resumes", value: stats.totalResumes, icon: FileText },
    { label: "Total Exports", value: stats.totalExports, icon: Download, href: "/admin/export-logs" },
    { label: "Trial Users", value: stats.trialCount, icon: TrendingUp, href: "/admin/trial-sessions" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Admin Overview
      </h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Manage users, view analytics, and monitor trial sessions.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, href }) => {
          const card = (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {value.toLocaleString()}
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
          <div className="flex items-center gap-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 px-4 py-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-800 dark:text-primary-200">
              {analytics.subscriptionMetrics.proCount ?? 0} Pro users · {analytics.subscriptionMetrics.conversionRate ?? 0}% conversion
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
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Users by Plan
          </h2>
          <div className="space-y-2">
            {Object.entries(stats.planBreakdown).map(([plan, count]) => (
              <div
                key={plan}
                className="flex justify-between text-sm text-slate-600 dark:text-slate-400"
              >
                <span className="capitalize">{plan.replace("_", " ")}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Template Usage
            </h2>
            {analytics?.templateUsage && Object.keys(analytics.templateUsage).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(analytics.templateUsage)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([id, count]) => (
                    <div key={id} className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{id}</span>
                      <span className="font-medium">{count}</span>
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
          {stats.recentSignups.length === 0 ? (
            <p className="text-sm text-slate-500">No users yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentSignups.map((u) => (
                <Link
                  key={u.id}
                  href={`/admin/users/${u.id}`}
                  className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded px-2 -mx-2"
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {u.name || u.email}
                  </span>
                  <span className="text-xs text-slate-500 capitalize ml-2">
                    {u.subscription.replace("_", " ")}
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
