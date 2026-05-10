"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { MEGA_MENU_ITEMS } from "./mega-menu-data";
import { type MegaMenuVariant, pickTokens } from "./mega-menu-tokens";
import { MegaMenuPanel } from "./mega-menu-panel";

type Props = {
  variant: MegaMenuVariant;
  /** Optional class for the trigger row (e.g. spacing, alignment). */
  className?: string;
};

const HOVER_OPEN_MS = 150;
const HOVER_CLOSE_MS = 200;

/**
 * Desktop megamenu — five top-level triggers, single shared panel underneath.
 *
 * Behaviour (plan §8):
 *  - Hover with 150ms intent delay opens the panel; cursor leaving both trigger
 *    and panel for 200ms closes.
 *  - Click toggles (touch-friendly).
 *  - ArrowDown / Enter / Space on a trigger opens its panel and moves focus into it.
 *  - Esc closes and refocuses the originating trigger.
 *  - Click outside (or on the backdrop) closes.
 *  - Cross-panel swap (hovering Templates while Product is open) just changes
 *    content — no exit/enter animation, no flicker.
 *  - `prefers-reduced-motion: reduce` collapses transitions to zero (handled
 *    inside tokens via `motion-reduce:transition-none`).
 */
export function MegaMenu({ variant, className }: Props) {
  const pathname = usePathname();
  const tokens = pickTokens(variant);
  const baseId = useId();

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);
  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const close = useCallback(
    (refocusIndex?: number) => {
      clearOpenTimer();
      clearCloseTimer();
      setOpenIndex(null);
      if (typeof refocusIndex === "number") {
        const t = triggerRefs.current[refocusIndex];
        if (t) requestAnimationFrame(() => t.focus());
      }
    },
    [clearOpenTimer, clearCloseTimer]
  );

  const scheduleOpen = useCallback(
    (index: number) => {
      clearCloseTimer();
      // If another panel is already open, swap instantly (no flicker).
      if (openIndex !== null && openIndex !== index) {
        clearOpenTimer();
        setOpenIndex(index);
        return;
      }
      if (openIndex === index) return;
      clearOpenTimer();
      openTimerRef.current = setTimeout(() => {
        setOpenIndex(index);
      }, HOVER_OPEN_MS);
    },
    [openIndex, clearOpenTimer, clearCloseTimer]
  );

  const scheduleClose = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenIndex(null);
    }, HOVER_CLOSE_MS);
  }, [clearOpenTimer, clearCloseTimer]);

  // Esc anywhere closes; click outside the wrapper closes.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(openIndex);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const target = e.target as Node | null;
      if (target && !containerRef.current.contains(target)) {
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openIndex, close]);

  // Close when route changes.
  useEffect(() => {
    setOpenIndex(null);
  }, [pathname]);

  // Cleanup timers on unmount.
  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, [clearOpenTimer, clearCloseTimer]);

  const moveFocusIntoPanel = useCallback(() => {
    requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelector<HTMLElement>(
        "a[href], button:not([disabled])"
      );
      focusable?.focus();
    });
  }, []);

  const onTriggerKeyDown = useCallback(
    (index: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const item = MEGA_MENU_ITEMS[index];
      if (!item || item.type !== "panel") return;
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        clearOpenTimer();
        clearCloseTimer();
        setOpenIndex(index);
        moveFocusIntoPanel();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next =
          (index + dir + MEGA_MENU_ITEMS.length) % MEGA_MENU_ITEMS.length;
        triggerRefs.current[next]?.focus();
      }
    },
    [clearOpenTimer, clearCloseTimer, moveFocusIntoPanel]
  );

  const isOpen = openIndex !== null;
  const activeItem =
    openIndex !== null ? MEGA_MENU_ITEMS[openIndex] : undefined;
  const activePanel =
    activeItem && activeItem.type === "panel" ? activeItem.panel : undefined;

  return (
    <>
      {/* Backdrop dim (under panel) */}
      {isOpen ? (
        <div
          className={`fixed inset-x-0 top-0 bottom-0 z-30 ${tokens.backdrop}`}
          aria-hidden
          onClick={() => close()}
        />
      ) : null}

      <div
        ref={containerRef}
        className={`relative flex items-center ${className ?? ""}`}
      >
        <nav
          className="flex items-center gap-1"
          aria-label="Primary"
          onMouseLeave={scheduleClose}
        >
          {MEGA_MENU_ITEMS.map((item, index) => {
            if (item.type === "link") {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href + "/"));
              const triggerCls = [
                "relative px-3 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-all",
                isActive
                  ? `${tokens.trigger.activeText} ${tokens.trigger.activeUnderline} after:scale-x-100`
                  : `${tokens.link.base} ${tokens.trigger.activeUnderline} after:scale-x-0 hover:after:scale-x-100`,
                tokens.link.focusRing,
                "rounded-md",
              ].join(" ");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={triggerCls}
                  onMouseEnter={() => {
                    clearCloseTimer();
                    if (openIndex !== null) close();
                  }}
                >
                  {item.label}
                </Link>
              );
            }

            const triggerOpen = openIndex === index;
            const triggerId = `${baseId}-trigger-${index}`;
            const panelId = `${baseId}-panel-${index}`;
            const triggerCls = [
              "relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-all",
              triggerOpen
                ? `${tokens.trigger.activeText} ${tokens.trigger.activeUnderline} after:scale-x-100`
                : `${tokens.link.base} ${tokens.trigger.activeUnderline} after:scale-x-0 hover:after:scale-x-100`,
              tokens.link.focusRing,
              "rounded-md",
            ].join(" ");

            return (
              <button
                key={item.label}
                ref={(el) => {
                  triggerRefs.current[index] = el;
                }}
                id={triggerId}
                type="button"
                aria-haspopup="true"
                aria-expanded={triggerOpen}
                aria-controls={triggerOpen ? panelId : undefined}
                className={triggerCls}
                onMouseEnter={() => scheduleOpen(index)}
                onFocus={() => {
                  // Focus alone shouldn't auto-open (matches Stripe/Linear);
                  // user must press ArrowDown/Enter/Space.
                  clearCloseTimer();
                }}
                onClick={() => {
                  if (triggerOpen) {
                    close();
                  } else {
                    clearOpenTimer();
                    clearCloseTimer();
                    setOpenIndex(index);
                  }
                }}
                onKeyDown={onTriggerKeyDown(index)}
              >
                {item.label}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${triggerOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            );
          })}
        </nav>

        {/* Panel — single shared overlay, content swaps on cross-panel hover */}
        {isOpen && activePanel ? (
          <div
            ref={panelRef}
            id={`${baseId}-panel-${openIndex}`}
            role="region"
            aria-label={
              activeItem?.type === "panel" ? activeItem.label : undefined
            }
            className={[
              "fixed left-0 right-0 z-40 mx-auto mt-2 max-w-6xl px-4 sm:px-6 lg:px-8",
              "top-[var(--megamenu-top,4rem)]",
            ].join(" ")}
            style={{ top: "var(--megamenu-top, 4rem)" }}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
          >
            <div
              className={[
                tokens.panel.surface,
                tokens.panel.shadow,
                tokens.panel.accent,
                tokens.panel.rounded,
                tokens.panel.padding,
                tokens.motion.panel,
                "max-h-[calc(100vh-var(--megamenu-top,4rem)-1rem)] overflow-y-auto",
              ].join(" ")}
            >
              <MegaMenuPanel
                panel={activePanel}
                variant={variant}
                pathname={pathname}
                onLinkActivate={() => close()}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
