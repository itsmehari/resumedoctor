"use client";

import { SiteHeader } from "@/components/site-header";

type UserDashboardLayoutProps = {
  children: React.ReactNode;
  /** Optional page title shown in the content area */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Optional slot for page-specific action buttons (e.g. Create Resume, Import) */
  actions?: React.ReactNode;
};

export function UserDashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: UserDashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader variant="app" navVariant="dashboard" maxWidth="6xl" />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {(title || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            {(title || subtitle) && (
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {actions && (
              <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">
                {actions}
              </div>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
