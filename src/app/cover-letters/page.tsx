"use client";

// WBS 8.3, 8.7 – Cover letter list & dashboard link
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { FileText, Plus, Trash2 } from "lucide-react";
import { UserDashboardLayout } from "@/components/user-dashboard-layout";

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
      <UserDashboardLayout title="Cover Letters" subtitle="Create and manage cover letters for your job applications.">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
          <p className="text-slate-500">Loading...</p>
        </div>
      </UserDashboardLayout>
    );
  }

  if (!session) {
    return (
      <UserDashboardLayout title="Cover Letters">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
          <p className="text-slate-600 dark:text-slate-400">Please sign in to view cover letters.</p>
          <Link href="/login" className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </div>
      </UserDashboardLayout>
    );
  }

  const actions = (
    <Link
      href="/cover-letters/new"
      className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors min-h-[44px]"
    >
      <Plus className="h-4 w-4" />
      New Cover Letter
    </Link>
  );

  return (
    <UserDashboardLayout
      title="Cover Letters"
      subtitle="Create and manage cover letters for your job applications."
      actions={actions}
    >
      {loading ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
          <p className="text-slate-500">Loading...</p>
        </div>
      ) : letters.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 p-14 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/30 flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
            No cover letters yet
          </p>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            Create tailored cover letters for each job application. Stand out from other candidates.
          </p>
          <Link
            href="/cover-letters/new"
            className="mt-8 inline-flex rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors shadow-sm"
          >
            Create your first cover letter
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {letters.map((l) => (
            <li
              key={l.id}
              className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 border-l-4 border-l-primary-500/0 hover:border-l-primary-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between p-4">
                <Link href={`/cover-letters/${l.id}/edit`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center border border-primary-100 dark:border-primary-800/40">
                      <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {l.title}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {[l.company, l.role].filter(Boolean).join(" · ") || "No company/role"}
                        {l.resume && ` · Resume: ${l.resume.title}`}
                        {" · "}
                        Updated {formatDistanceToNow(new Date(l.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(l.id)}
                  disabled={!!deleting}
                  className="ml-2 p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </UserDashboardLayout>
  );
}
