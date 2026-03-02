"use client";

// WBS 8.3, 8.7 – Cover letter list & dashboard link
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { FileText, Plus, Trash2 } from "lucide-react";

interface CoverLetter {
  id: string;
  title: string;
  company: string | null;
  role: string | null;
  updatedAt: string;
  resume: { id: string; title: string } | null;
}

export default function CoverLettersPage() {
  const { data: session, status } = useSession();
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/cover-letters", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : []))
        .then(setLetters)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session?.user?.email]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this cover letter?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/cover-letters/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) setLetters((prev) => prev.filter((l) => l.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600">Please sign in to view cover letters.</p>
        <Link href="/login" className="text-primary-600 hover:underline">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              Dashboard
            </Link>
            <Link href="/cover-letters" className="text-primary-600 font-medium">
              Cover Letters
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Cover Letters
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Create and manage cover letters for your job applications.
            </p>
          </div>
          <Link
            href="/cover-letters/new"
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            New Cover Letter
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : letters.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">
              No cover letters yet
            </p>
            <p className="mt-2 text-slate-500 text-sm">
              Create your first cover letter to get started
            </p>
            <Link
              href="/cover-letters/new"
              className="mt-4 inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              New Cover Letter
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {letters.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <Link href={`/cover-letters/${l.id}/edit`} className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                    {l.title}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {[l.company, l.role].filter(Boolean).join(" · ") || "No company/role"}
                    {l.resume && ` · Resume: ${l.resume.title}`}
                    {" · "}
                    Updated {formatDistanceToNow(new Date(l.updatedAt), { addSuffix: true })}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(l.id)}
                  disabled={!!deleting}
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
