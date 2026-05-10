"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSubscription } from "@/hooks/use-subscription";
import {
  type MegaMenuPanel as MegaMenuPanelData,
  type MegaMenuColumn,
  type MegaMenuFeaturedRail,
  type MegaMenuLink,
} from "./mega-menu-data";
import {
  type MegaMenuTokens,
  type MegaMenuVariant,
  pickTokens,
} from "./mega-menu-tokens";

type Props = {
  panel: MegaMenuPanelData;
  variant: MegaMenuVariant;
  pathname: string | null;
  /** Called when a link inside the panel is activated, so the menu can close. */
  onLinkActivate?: () => void;
};

export function MegaMenuPanel({
  panel,
  variant,
  pathname,
  onLinkActivate,
}: Props) {
  const tokens = pickTokens(variant);
  const { status } = useSession();
  const { isPro, proLink } = useSubscription();
  const isSignedIn = status === "authenticated";

  const visibleColumns = panel.columns.filter((col) => {
    if (!col.visibility || col.visibility === "always") return true;
    if (col.visibility === "signed-in-only") return isSignedIn;
    if (col.visibility === "signed-out-only") return !isSignedIn;
    return true;
  });

  const showRail =
    panel.featuredRail &&
    !(
      panel.featuredRail.kind === "trial-wedge" &&
      panel.featuredRail.hideWhenPro &&
      isPro
    );

  // Layout: columns occupy a fluid grid; rail occupies a fixed 18rem (288px) right column
  // when present. Without the rail, columns expand to fill the panel.
  const gridTemplate = showRail
    ? "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-8"
    : "grid grid-cols-1";

  const columnsClass =
    visibleColumns.length === 1
      ? "grid grid-cols-1 gap-6"
      : visibleColumns.length === 2
        ? "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6";

  return (
    <div className={gridTemplate}>
      <div className={columnsClass}>
        {visibleColumns.map((col) => (
          <MegaMenuColumnView
            key={col.heading}
            column={col}
            tokens={tokens}
            pathname={pathname}
            onLinkActivate={onLinkActivate}
          />
        ))}
      </div>
      {showRail && panel.featuredRail ? (
        <MegaMenuFeaturedRailView
          rail={panel.featuredRail}
          tokens={tokens}
          proLinkActive={proLink.active}
          proLinkExpiresAt={proLink.expiresAt}
          onLinkActivate={onLinkActivate}
        />
      ) : null}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Column view
// ────────────────────────────────────────────────────────────────────────────

function MegaMenuColumnView({
  column,
  tokens,
  pathname,
  onLinkActivate,
}: {
  column: MegaMenuColumn;
  tokens: MegaMenuTokens;
  pathname: string | null;
  onLinkActivate?: () => void;
}) {
  return (
    <div className="min-w-0">
      <h3 className={`mb-3 ${tokens.column.heading}`}>{column.heading}</h3>
      <ul className="space-y-1">
        {column.links.map((link, idx) => (
          <li key={`${link.label}-${idx}`}>
            <MegaMenuLinkView
              link={link}
              tokens={tokens}
              pathname={pathname}
              onActivate={onLinkActivate}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaMenuLinkView({
  link,
  tokens,
  pathname,
  onActivate,
}: {
  link: MegaMenuLink;
  tokens: MegaMenuTokens;
  pathname: string | null;
  onActivate?: () => void;
}) {
  const isActive = pathname ? isPathActive(pathname, link.href) : false;

  const linkClass = [
    "group relative flex items-start gap-2 px-2 py-1.5",
    tokens.link.rounded,
    tokens.link.hoverBg,
    tokens.link.focusRing,
    "transition-colors",
  ].join(" ");

  return (
    <Link
      href={link.href}
      onClick={onActivate}
      className={linkClass}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
    >
      {isActive ? (
        <span
          aria-hidden
          className={`mt-1.5 inline-block h-1 w-1 rounded-full ${tokens.link.activeIndicator}`}
        />
      ) : (
        <span aria-hidden className="mt-1.5 inline-block h-1 w-1" />
      )}
      <span className="flex-1 min-w-0">
        <span
          className={`block ${tokens.link.base} ${
            isActive ? tokens.link.activeText : ""
          }`}
        >
          {link.label}
        </span>
        {link.description ? (
          <span className={`block mt-0.5 ${tokens.link.description}`}>
            {link.description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Featured rail
// ────────────────────────────────────────────────────────────────────────────

function MegaMenuFeaturedRailView({
  rail,
  tokens,
  proLinkActive,
  proLinkExpiresAt,
  onLinkActivate,
}: {
  rail: MegaMenuFeaturedRail;
  tokens: MegaMenuTokens;
  proLinkActive: boolean;
  proLinkExpiresAt: string | null;
  onLinkActivate?: () => void;
}) {
  if (rail.kind === "pro-link") {
    if (proLinkActive) {
      return (
        <div className={tokens.featuredRail.proLinkActive}>
          <span className={tokens.featuredRail.pillEyebrowEmerald}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            Pro Link active
          </span>
          <h4 className={tokens.featuredRail.headline}>
            Your custom URL is live.
          </h4>
          <p className={tokens.featuredRail.body}>
            {proLinkExpiresAt
              ? `Active until ${formatDate(proLinkExpiresAt)}.`
              : "Included with your Pro plan."}
          </p>
          <Link
            href="/settings#billing"
            onClick={onLinkActivate}
            className={tokens.featuredRail.ghostCta}
          >
            Manage in Settings
            <ArrowIcon />
          </Link>
        </div>
      );
    }

    return (
      <div className={tokens.featuredRail.proLinkUpsell}>
        <span className={tokens.featuredRail.pillEyebrow}>
          <SparkleIcon />
          {rail.pillLabel}
        </span>
        <h4 className={tokens.featuredRail.headline}>{rail.headline}</h4>
        <ul className={`${tokens.featuredRail.body} space-y-1.5`}>
          {rail.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <CheckIcon />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Link
          href={rail.ctaHref}
          onClick={onLinkActivate}
          className={tokens.featuredRail.primaryCta}
        >
          {rail.ctaLabel}
          <ArrowIcon />
        </Link>
      </div>
    );
  }

  if (rail.kind === "trial-wedge") {
    return (
      <div className={tokens.featuredRail.trialWedge}>
        <span className={tokens.featuredRail.pillEyebrowAmber}>
          {rail.pillLabel}
        </span>
        <h4 className={tokens.featuredRail.headline}>{rail.headline}</h4>
        <p className={tokens.featuredRail.body}>{rail.body}</p>
        <Link
          href={rail.ctaHref}
          onClick={onLinkActivate}
          className={tokens.featuredRail.primaryCta}
        >
          {rail.ctaLabel}
          <ArrowIcon />
        </Link>
      </div>
    );
  }

  if (rail.kind === "template-tile") {
    return (
      <div className={tokens.featuredRail.templateTile}>
        {rail.pillLabel ? (
          <span className={tokens.featuredRail.pillEyebrow}>
            {rail.pillLabel}
          </span>
        ) : null}
        <h4 className={tokens.featuredRail.headline}>{rail.headline}</h4>
        <p className={tokens.featuredRail.body}>{rail.body}</p>
        <Link
          href={rail.ctaHref}
          onClick={onLinkActivate}
          className={tokens.featuredRail.ghostCta}
        >
          {rail.ctaLabel}
        </Link>
      </div>
    );
  }

  // blog-tile
  return (
    <div className={tokens.featuredRail.blogTile}>
      {rail.pillLabel ? (
        <span className={tokens.featuredRail.pillEyebrow}>
          {rail.pillLabel}
        </span>
      ) : null}
      <h4 className={tokens.featuredRail.headline}>{rail.headline}</h4>
      <p className={tokens.featuredRail.body}>{rail.body}</p>
      <Link
        href={rail.ctaHref}
        onClick={onLinkActivate}
        className={tokens.featuredRail.ghostCta}
      >
        {rail.ctaLabel}
      </Link>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function isPathActive(pathname: string, href: string): boolean {
  // Strip query and hash so /templates?category=modern still matches /templates active state.
  const cleanHref = href.split(/[?#]/)[0];
  if (!cleanHref || cleanHref === "/") {
    return pathname === "/";
  }
  return pathname === cleanHref || pathname.startsWith(cleanHref + "/");
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 flex-shrink-0 opacity-80"
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zM5 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zm14-2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
    </svg>
  );
}
