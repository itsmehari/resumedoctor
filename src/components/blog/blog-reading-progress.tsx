"use client";

import { useEffect, useState } from "react";

export function BlogReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const win = document.documentElement;
      const total = win.scrollHeight - win.clientHeight;
      setPct(total > 0 ? (win.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const rounded = Math.round(Math.min(100, Math.max(0, pct)));

  return (
    <div
      className="blog-reading-progress pointer-events-none fixed left-0 right-0 top-0 z-[60] h-1 bg-slate-200/70 dark:bg-slate-800/80"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      aria-label="Article read progress"
    >
      <div
        className="blog-reading-progress-inner h-full origin-left bg-gradient-to-r from-primary-500 to-primary-600 transition-[width] duration-150 ease-out motion-reduce:transition-none dark:from-primary-400 dark:to-primary-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
