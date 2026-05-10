"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 380;

export function FeaturesStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none dark:border-slate-700 dark:bg-slate-950/95 lg:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-lg items-center justify-center gap-3">
        <Link
          href="/try"
          className="flex-1 rounded-xl bg-primary-600 px-4 py-3 text-center text-sm font-bold text-white shadow-sm hover:bg-primary-700"
          onClick={() => trackEvent("features_cta_try", { target: "/try" })}
        >
          Build my resume — Try
        </Link>
        <Link
          href="/pricing"
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 hover:border-primary-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          onClick={() => trackEvent("features_cta_pricing", { target: "/pricing" })}
        >
          See pricing
        </Link>
      </div>
    </div>
  );
}
