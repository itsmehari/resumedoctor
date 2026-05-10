"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useSubscription } from "@/hooks/use-subscription";
import { MEGA_MENU_ITEMS } from "./mega-menu-data";
import { mobileDrawerTokens } from "./mega-menu-tokens";

type Props = {
  /**
   * Match the legacy `MobileNavMenu` API for plug-compatibility with
   * `site-header.tsx`. Inverted = trigger button sits over a dark/blue header.
   */
  inverted?: boolean;
};

/**
 * Mobile drawer megamenu — slides in from the right, full viewport height.
 *
 * Behaviour (plan §5.5, §8):
 *  - Drawer open paths: hamburger button.
 *  - Dismiss paths: X button, backdrop tap, Esc, route change — all release
 *    body scroll lock.
 *  - Accordion sections: one open at a time. Tapping an open section closes
 *    it (toggle).
 *  - Pinned auth CTAs at the bottom (Sign in / Sign up + primary Create Resume),
 *    or a "Go to dashboard" CTA when signed in.
 */
export function MobileMegaMenu({ inverted }: Props) {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(0);
  const pathname = usePathname();
  const { status } = useSession();
  const { isPro } = useSubscription();
  const isSignedIn = status === "authenticated";
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useBodyScrollLock(open);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors min-h-[44px] min-w-[44px] touch-manipulation ${
          inverted
            ? "text-white hover:bg-white/10"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        }`}
        aria-label="Open navigation"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open ? (
        <>
          {/* Scrim */}
          <button
            type="button"
            aria-label="Close menu"
            className={`fixed inset-0 z-40 ${mobileDrawerTokens.scrim}`}
            onClick={close}
          />

          {/* Drawer */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className={[
              "fixed right-0 top-0 bottom-0 z-50 w-[88vw] max-w-md flex flex-col",
              mobileDrawerTokens.shell,
              "shadow-2xl",
              mobileDrawerTokens.motion,
              "translate-x-0",
            ].join(" ")}
          >
            {/* Header strip — hero gradient, signals "this is ResumeDoctor" */}
            <div
              className={`flex items-center justify-between px-4 py-3 ${mobileDrawerTokens.headerStrip}`}
            >
              <Link
                href="/"
                onClick={close}
                className="flex items-center gap-2 text-white font-bold tracking-tight"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/15 text-sm font-black">
                  R
                </span>
                ResumeDoctor
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="Close navigation"
                className="flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] touch-manipulation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body — accordion sections */}
            <nav
              className="flex-1 overflow-y-auto overscroll-contain"
              aria-label="Mobile primary"
            >
              {MEGA_MENU_ITEMS.map((item, index) => {
                if (item.type === "link") {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={close}
                      className={[
                        "flex items-center justify-between w-full text-base font-semibold px-4 py-4",
                        mobileDrawerTokens.sectionBorder,
                        isActive
                          ? mobileDrawerTokens.sectionHeadingActive
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900",
                      ].join(" ")}
                    >
                      <span>{item.label}</span>
                      <span className="text-slate-400" aria-hidden>
                        →
                      </span>
                    </Link>
                  );
                }

                const expanded = openSection === index;
                return (
                  <div
                    key={item.label}
                    className={mobileDrawerTokens.sectionBorder}
                  >
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`mobile-section-${index}`}
                      onClick={() => setOpenSection(expanded ? null : index)}
                      className={[
                        mobileDrawerTokens.sectionHeading,
                        expanded
                          ? mobileDrawerTokens.sectionHeadingActive
                          : "",
                      ].join(" ")}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>

                    {expanded ? (
                      <div
                        id={`mobile-section-${index}`}
                        className={mobileDrawerTokens.sublinkGroup}
                      >
                        {item.panel.columns.map((col) => {
                          if (col.visibility === "signed-in-only" && !isSignedIn) {
                            return null;
                          }
                          if (col.visibility === "signed-out-only" && isSignedIn) {
                            return null;
                          }
                          return (
                            <div key={col.heading}>
                              <span
                                className={
                                  mobileDrawerTokens.sublinkColumnHeading
                                }
                              >
                                {col.heading}
                              </span>
                              {col.links.map((link, lidx) => (
                                <Link
                                  key={`${link.label}-${lidx}`}
                                  href={link.href}
                                  onClick={close}
                                  className={mobileDrawerTokens.sublink}
                                  target={link.external ? "_blank" : undefined}
                                  rel={
                                    link.external
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          );
                        })}

                        {item.panel.featuredRail &&
                        !(
                          item.panel.featuredRail.kind === "trial-wedge" &&
                          item.panel.featuredRail.hideWhenPro &&
                          isPro
                        ) ? (
                          <Link
                            href={item.panel.featuredRail.ctaHref}
                            onClick={close}
                            className="mx-4 mt-3 mb-2 block rounded-lg border border-primary-200 bg-primary-50/60 px-4 py-3 text-sm font-semibold text-primary-700 dark:border-primary-800 dark:bg-primary-950/30 dark:text-primary-300 hover:bg-primary-100/60 dark:hover:bg-primary-950/50"
                          >
                            {item.panel.featuredRail.ctaLabel}
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            {/* Pinned bottom — auth CTAs */}
            <div className={mobileDrawerTokens.pinnedFooter}>
              {isSignedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={close}
                    className={mobileDrawerTokens.pinnedAuthLink}
                  >
                    Go to dashboard
                  </Link>
                  <Link
                    href="/resumes/new"
                    onClick={close}
                    className={mobileDrawerTokens.pinnedPrimaryCta}
                  >
                    Create resume
                  </Link>
                </>
              ) : (
                <>
                  <div className={mobileDrawerTokens.pinnedAuthRow}>
                    <Link
                      href="/login"
                      onClick={close}
                      className={mobileDrawerTokens.pinnedAuthLink}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={close}
                      className={mobileDrawerTokens.pinnedAuthLink}
                    >
                      Sign up
                    </Link>
                  </div>
                  <Link
                    href="/try"
                    onClick={close}
                    className={mobileDrawerTokens.pinnedPrimaryCta}
                  >
                    Build my resume — Try
                  </Link>
                </>
              )}
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
