"use client";

// Admin – View user's dashboard (support/impersonation view)
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface UserData {
  user: { id: string; email: string; name: string | null };
  resumes: Array<{ id: string; title: string; updatedAt: string }>;
}

export default function AdminViewUserPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !data) {
    return (
      <div className="p-8">
        <p className="text-slate-500">{loading ? "Loading..." : "User not found"}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        href={`/admin/users/${id}`}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to user
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        View as: {data.user.name || data.user.email}
      </h1>
      <p className="text-slate-500 mt-1">{data.user.email}</p>

      <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Resumes ({data.resumes.length})
        </h2>
        {data.resumes.length === 0 ? (
          <p className="text-sm text-slate-500">No resumes</p>
        ) : (
          <ul className="space-y-2">
            {data.resumes.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/resumes/${r.id}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium text-slate-900 dark:text-slate-100"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Open resume links in new tab to view. Admin stays logged in.
      </p>
    </div>
  );
}
