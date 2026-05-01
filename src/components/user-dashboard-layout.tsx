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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:m-0 focus:inline-block focus:h-auto focus:w-auto focus:min-h-0 focus:min-w-0 focus:overflow-visible focus:whitespace-normal focus:rounded-lg focus:px-4 focus:py-2.5 focus:bg-white focus:text-slate-900 focus:shadow-lg focus:ring-2 focus:ring-primary-500 dark:focus:bg-slate-900 dark:focus:text-slate-100"
      >
        Skip to main content
      </a>
      <SiteHeader variant="app" navVariant="dashboard" maxWidth="6xl" />
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 outline-none">
        {(title || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            {(title || subtitle) && (
              <div>
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
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
