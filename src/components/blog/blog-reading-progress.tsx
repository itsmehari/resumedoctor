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

  return (
    <div
      className="blog-reading-progress pointer-events-none fixed left-0 right-0 top-0 z-[60] h-1 bg-slate-200/50 dark:bg-slate-800/80"
      aria-hidden
    >
      <div
        className="blog-reading-progress-inner h-full origin-left bg-gradient-to-r from-primary-500 to-violet-500 transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
