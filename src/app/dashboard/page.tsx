// WBS 3.9, 3.10 – Resume list & empty state
"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface ResumeItem {
  id: string;
  title: string;
  templateId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const upgraded = searchParams.get("upgraded") === "1";

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => (res.ok ? res.json() : []))
      .then(setResumes)
      .catch(() => setResumes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/settings" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              Settings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {status === "loading" ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <>
            {upgraded && (
              <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-green-800 dark:text-green-200 text-sm">
                You&apos;re now a Pro member. PDF & Word export are unlocked.
              </div>
            )}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  My Resumes
                </h1>
                {session?.user?.email && (
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    Welcome, {session.user.name || session.user.email}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/pricing"
                  className="rounded-lg border border-primary-600 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  Upgrade to Pro
                </Link>
                <Link
                href="/resumes/new"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                >
                  + Create Resume
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                <p className="text-slate-500">Loading resumes...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  No resumes yet
                </p>
                <p className="mt-2 text-slate-500 text-sm">
                  Create your first resume to get started
                </p>
                <Link
                  href="/resumes/new"
                  className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Create Resume
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {resumes.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/resumes/${r.id}/edit`}
                      className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {r.title}
                        </span>
                        <p className="text-sm text-slate-500 mt-0.5">
                          Updated {formatDistanceToNow(new Date(r.updatedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <span className="text-slate-400">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
