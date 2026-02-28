import Link from "next/link";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            ← Back
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Resume Templates
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          WBS 4 – Template selector coming soon
        </p>
      </main>
    </div>
  );
}
