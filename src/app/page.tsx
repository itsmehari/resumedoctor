import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <AuthNav />
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-slate-900 dark:text-slate-100 max-w-4xl">
          Build a resume that lands{" "}
          <span className="text-primary-600">interviews</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 text-center max-w-2xl">
          India&apos;s smart resume builder. ATS-friendly templates, AI-powered
          content, and job-matching tools. Free to start.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/resumes/new"
            className="rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white hover:bg-primary-700 transition-colors text-center"
          >
            Create Your Resume
          </Link>
          <Link
            href="/templates"
            className="rounded-xl border-2 border-slate-300 dark:border-slate-600 px-8 py-4 text-lg font-semibold text-slate-700 dark:text-slate-300 hover:border-primary-500 hover:text-primary-600 transition-colors text-center"
          >
            Browse Templates
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          No signup required to start • Export to PDF with Pro
        </p>
      </main>

    </div>
  );
}
