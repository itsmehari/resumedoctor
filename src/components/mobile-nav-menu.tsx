"use client";

/**
 * @deprecated Replaced by `src/components/site-header/mobile-mega-menu.tsx`
 * (the `<MobileMegaMenu />` component) which is integrated into `site-header.tsx`
 * for both public and dashboard variants. This file is kept temporarily so that
 * any external imports keep compiling; delete it in a follow-up cleanup PR once
 * the codebase is grep-clean.
 */
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/try", label: "Try free · email" },
  { href: "/templates", label: "Templates" },
  { href: "/resume-link", label: "Resume link" },
  { href: "/pricing", label: "Pricing" },
  { href: "/features", label: "Features" },
  { href: "/blog", label: "Blog" },
  { href: "/examples", label: "Examples" },
];

export function MobileNavMenu({ inverted }: { inverted?: boolean }) {
  const [open, setOpen] = useState(false);
  const baseCls = inverted
    ? "text-white/90 hover:text-white hover:bg-white/10"
    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800";
  const bgCls = inverted ? "bg-primary-600 border-white/20" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700";

  return (
    <div className="md:hidden relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors min-h-[44px] min-w-[44px] touch-manipulation ${
          inverted ? "text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        }`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className={`absolute right-0 top-full mt-1 z-50 w-52 rounded-xl border shadow-xl py-2 ${bgCls}`}
          >
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 text-sm font-medium transition-colors ${baseCls}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
