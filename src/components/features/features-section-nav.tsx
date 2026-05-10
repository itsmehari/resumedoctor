import Link from "next/link";

const LINKS = [
  { href: "#pillars", label: "Outcomes" },
  { href: "#journey", label: "Journey" },
  { href: "#capabilities", label: "Features" },
  { href: "#resume-link-spotlight", label: "Resume link" },
  { href: "#ats-support", label: "ATS checks" },
  { href: "#pricing-bridge", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export function FeaturesSectionNav() {
  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-20 hidden border-b border-slate-200/90 bg-slate-50/95 py-2.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 lg:block"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 sm:px-6 lg:px-8">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-transparent px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-800 dark:text-slate-400 dark:hover:border-primary-900 dark:hover:bg-primary-950/50 dark:hover:text-primary-200"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
