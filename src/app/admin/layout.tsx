"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Download, Clock } from "lucide-react";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/trial-sessions", label: "Trial Sessions", icon: Clock },
  { href: "/admin/export-logs", label: "Export Logs", icon: Download },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="sticky top-0 p-4">
          <Link
            href="/admin"
            className="block text-lg font-bold text-primary-600 mb-6"
          >
            Admin
          </Link>
          <nav className="space-y-1">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-white dark:bg-slate-950">
        {children}
      </main>
    </div>
  );
}
