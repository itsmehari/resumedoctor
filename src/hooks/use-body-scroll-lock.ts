"use client";

import { useEffect } from "react";

/**
 * Lock body scroll while `active` is true.
 *
 * Mobile-safe: preserves scroll position by switching to `position: fixed`
 * on the body and restoring on cleanup. Falls back to `overflow: hidden`
 * on desktop where scroll-position preservation isn't required.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const body = document.body;
    const scrollY = window.scrollY;

    const previousOverflow = body.style.overflow;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      body.style.overflow = previousOverflow;
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}
