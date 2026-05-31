"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type CtaVariant = "accent" | "accentDark" | "primary" | "outline";

const VARIANT_CLASSES: Record<CtaVariant, string> = {
  accent:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-accent-dark shadow-xl shadow-cyan-500/20 transition-all hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]",
  accentDark:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover px-10 py-4 text-lg font-bold text-accent-dark shadow-2xl shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]",
  primary:
    "inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 py-4 text-center text-base font-bold text-white shadow-lg transition hover:bg-primary-700",
  outline:
    "inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15",
};

export function ResumeLinkCta({
  children = "Get your resume link",
  variant = "accent",
  className = "",
  icon,
}: {
  children?: React.ReactNode;
  variant?: CtaVariant;
  className?: string;
  icon?: React.ReactNode;
}) {
  const { status } = useSession();
  const [href, setHref] = useState("/try");
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setHref("/try");
      setResolving(false);
      return;
    }

    let cancelled = false;
    setResolving(true);
    fetch("/api/resumes/link-cta", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { href: "/try" }))
      .then((data: { href?: string }) => {
        if (!cancelled && data.href) setHref(data.href);
      })
      .catch(() => {
        if (!cancelled) setHref("/dashboard");
      })
      .finally(() => {
        if (!cancelled) setResolving(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <Link
      href={href}
      prefetch={resolving ? false : undefined}
      aria-busy={resolving}
      className={`${VARIANT_CLASSES[variant]} ${className} ${resolving ? "pointer-events-none opacity-90" : ""}`.trim()}
    >
      {icon}
      {resolving ? "Loading…" : children}
    </Link>
  );
}
