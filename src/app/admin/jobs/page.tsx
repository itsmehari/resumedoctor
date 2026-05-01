"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobRow {
  id: string;
  title: string;
  company: string;
  active: boolean;
  location: string | null;
  updatedAt: string;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = (p: number) => {
    setLoading(true);
    fetch(`/api/admin/jobs?page=${p}&limit=50`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setJobs(d.jobs ?? []);
          setTotalPages(d.pagination?.totalPages ?? 1);
          setPage(d.pagination?.page ?? p);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  const toggleActive = async (job: JobRow) => {
    setToggling(job.id);
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !job.active }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, active: !j.active } : j))
        );
      } else {
        alert("Update failed");
      }
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="p-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to admin
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Jobs</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        List includes inactive jobs. Toggle hides or shows jobs on the public feed.
      </p>

      {loading ? (
        <p className="mt-8 text-slate-500">Loading…</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Active</th>
                <th className="text-left p-3">Updated</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{j.title}</td>
                  <td className="p-3">{j.company}</td>
                  <td className="p-3 text-slate-500">{j.location ?? "—"}</td>
                  <td className="p-3">{j.active ? "yes" : "no"}</td>
                  <td className="p-3 text-slate-500 text-xs">
                    {formatDistanceToNow(new Date(j.updatedAt), { addSuffix: true })}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      disabled={toggling === j.id}
                      onClick={() => toggleActive(j)}
                      className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                      {toggling === j.id ? "…" : j.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => load(page - 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600 dark:text-slate-400 py-1">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => load(page + 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
