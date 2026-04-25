"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AuthNav } from "@/components/auth-nav";
import { MobileNavMenu } from "@/components/mobile-nav-menu";
import { UserMenu } from "@/components/user-menu";
import { useSession } from "next-auth/react";
import { useSubscription } from "@/hooks/use-subscription";
import { getSubscriptionLabel } from "@/lib/subscription-labels";

type SiteHeaderProps = {
  variant?: "home" | "app";
  navVariant?: "public" | "dashboard";
  maxWidth?: "xl" | "2xl" | "3xl" | "4xl" | "6xl";
};

const publicNavLinks = [
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/examples", label: "Examples" },
];

const dashboardNavLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cover-letters", label: "Cover Letters" },
  { href: "/jobs", label: "Jobs" },
  { href: "/interview-prep", label: "Interview Prep" },
  { href: "/settings", label: "Settings" },
];

function Logo({ inverted }: { inverted: boolean }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 shrink-0 transition-all duration-200 hover:opacity-90 ${
        inverted
          ? "text-lg sm:text-xl font-bold text-white tracking-tight"
          : "text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400"
      }`}
    >
      <span
        className={`flex items-center justify-center text-sm font-black shrink-0 transition-transform duration-200 hover:scale-105 ${
          inverted
            ? "w-7 h-7 rounded-lg bg-white/15"
            : "w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
        }`}
      >
        R
      </span>
      ResumeDoctor
    </Link>
  );
}

export function SiteHeader({
  variant = "app",
  navVariant = "public",
  maxWidth = "6xl",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [dashboardNavOpen, setDashboardNavOpen] = useState(false);
  const { data: session, status } = useSession();
  const { subscription, isPro, isTrial, subscriptionExpiresAt } = useSubscription();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  const inverted = variant === "home";
  const maxWidthClass = {
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
  }[maxWidth];

  // Home variant: gradient primary header
  if (variant === "home") {
    return (
      <header className="sticky top-0 z-30 border-b border-white/10 bg-primary-600 backdrop-blur-sm">
        <div
          className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 min-h-16 py-3 sm:py-0`}
        >
          <Logo inverted />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
            {publicNavLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all after:scale-x-0 hover:after:scale-x-100 after:origin-left"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <MobileNavMenu inverted />
            <AuthNav inverted />
          </div>
        </div>
      </header>
    );
  }

  // App variant: glass/light header
  const navLinks = navVariant === "dashboard" ? dashboardNavLinks : publicNavLinks;
  const showDashboardNav = navVariant === "dashboard" && !isTrial;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(13,101,217,0.08)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)]">
      {/* Gradient accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"
        aria-hidden
      />
      <div
        className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 min-h-16 py-3 relative`}
      >
        <Logo inverted={false} />
        <nav className="flex items-center gap-2 sm:gap-4">
          {navVariant === "dashboard" && status !== "loading" && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                isPro
                  ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
                  : isTrial
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {getSubscriptionLabel(subscription, subscriptionExpiresAt)}
            </span>
          )}
          {showDashboardNav ? (
            <>
              <div className="hidden lg:flex items-center gap-4">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:transition-all ${
                      pathname === href || pathname.startsWith(href + "/")
                        ? "text-primary-600 dark:text-primary-400 after:bg-primary-600 after:scale-x-100"
                        : "text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 after:bg-primary-600 after:scale-x-0 hover:after:scale-x-100"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    Admin
                  </Link>
                )}
              </div>
              <div className="lg:hidden relative">
                <button
                  type="button"
                  onClick={() => setDashboardNavOpen(!dashboardNavOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] touch-manipulation"
                  aria-label={dashboardNavOpen ? "Close menu" : "Open menu"}
                  aria-expanded={dashboardNavOpen}
                >
                  {dashboardNavOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
                {dashboardNavOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDashboardNavOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl py-2">
                      {navLinks.map(({ href, label }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setDashboardNavOpen(false)}
                          className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          {label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setDashboardNavOpen(false)}
                          className="block px-4 py-3 text-sm text-amber-600 dark:text-amber-400 font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        >
                          Admin
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:transition-all ${
                      pathname === href || pathname.startsWith(href + "/")
                        ? "text-primary-600 dark:text-primary-400 after:bg-primary-600 after:scale-x-100"
                        : "text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 after:bg-primary-600 after:scale-x-0 hover:after:scale-x-100"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <MobileNavMenu inverted={false} />
            </>
          )}
          {navVariant === "dashboard" ? (
            session ? (
              <UserMenu compact />
            ) : isTrial ? (
              <Link
                href="/signup"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm min-h-[44px] inline-flex items-center touch-manipulation"
              >
                Sign up to save
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm min-h-[44px] inline-flex items-center touch-manipulation"
              >
                Sign in
              </Link>
            )
          ) : (
            <AuthNav inverted={false} />
          )}
        </nav>
      </div>
    </header>
  );
}
