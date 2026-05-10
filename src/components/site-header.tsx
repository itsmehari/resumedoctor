"use client";

import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";
import { MegaMenu } from "@/components/site-header/mega-menu";
import { MobileMegaMenu } from "@/components/site-header/mobile-mega-menu";
import { UserMenu } from "@/components/user-menu";
import { useSession } from "next-auth/react";
import { useSubscription } from "@/hooks/use-subscription";
import { getSubscriptionLabel } from "@/lib/subscription-labels";

type SiteHeaderProps = {
  variant?: "home" | "app";
  navVariant?: "public" | "dashboard";
  maxWidth?: "xl" | "2xl" | "3xl" | "4xl" | "6xl";
};

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
  const { data: session, status } = useSession();
  const { subscription, isPro, isTrial, subscriptionExpiresAt } =
    useSubscription();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  const inverted = variant === "home";
  const isPublicHeader = navVariant === "public";
  const maxWidthClass = {
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
  }[maxWidth];

  // Unified marketing/public header — Variant A megamenu (glassy dark over blue)
  if (isPublicHeader) {
    return (
      <>
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:left-4 focus:top-20 focus:z-[100] focus:m-0 focus:inline-block focus:h-auto focus:w-auto focus:min-h-0 focus:min-w-0 focus:overflow-visible focus:whitespace-normal focus:rounded-lg focus:px-4 focus:py-2.5 focus:bg-white focus:text-slate-900 focus:shadow-lg focus:ring-2 focus:ring-primary-500 dark:focus:bg-slate-900 dark:focus:text-slate-100"
        >
          Skip to main content
        </a>
        <header className="site-header-shell sticky top-0 z-30 border-b border-white/10 bg-primary-600/95 backdrop-blur-sm">
          <div
            className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 min-h-16 py-3 sm:py-0`}
            style={{ ["--megamenu-top" as string]: "4rem" }}
          >
            <Logo inverted />
            <div className="hidden lg:flex">
              <MegaMenu variant="A" />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <MobileMegaMenu inverted />
              <AuthNav inverted />
            </div>
          </div>
        </header>
      </>
    );
  }

  // App/dashboard header — Variant B megamenu (light over white/slate)
  const showDashboardNav = navVariant === "dashboard" && !isTrial;

  return (
    <header className="site-header-shell sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(13,101,217,0.08)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)]">
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"
        aria-hidden
      />
      <div
        className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 min-h-16 py-3 relative`}
        style={{ ["--megamenu-top" as string]: "4rem" }}
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
          <div className="hidden lg:flex items-center gap-2">
            <MegaMenu variant="B" />
            {showDashboardNav && isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 px-3 py-2"
              >
                Admin
              </Link>
            )}
          </div>
          <MobileMegaMenu inverted={false} />
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
