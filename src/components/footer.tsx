import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-slate-600 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} ResumeDoctor. All rights reserved.
        </span>
        <nav className="flex flex-wrap gap-6 text-sm" aria-label="Footer navigation">
          <Link
            href="/"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            About
          </Link>
          <Link
            href="/try"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Try Free
          </Link>
          <Link
            href="/templates"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Templates
          </Link>
          <Link
            href="/blog"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Blog
          </Link>
          <Link
            href="/pricing"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Pricing
          </Link>
          <Link
            href="/privacy"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
