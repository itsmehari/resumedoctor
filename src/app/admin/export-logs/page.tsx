"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface ExportLog {
  id: string;
  format: string;
  createdAt: string;
  userId: string;
  resumeId: string;
  user: { id: string; email: string; name: string | null };
  resume: { id: string; title: string };
}

export default function AdminExportLogsPage() {
  const [logs, setLogs] = useState<ExportLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formatFilter, setFormatFilter] = useState("");

  useEffect(() => {
    const params = formatFilter ? `?format=${formatFilter}` : "";
    fetch(`/api/admin/export-logs${params}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { logs: [] }))
      .then((data) => setLogs(data.logs ?? []))
      .finally(() => setLoading(false));
  }, [formatFilter]);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Export Logs
      </h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        All PDF, DOCX, and TXT exports.
      </p>

      <div className="mt-6 flex gap-4">
        <select
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
        >
          <option value="">All formats</option>
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="txt">TXT</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Format</th>
              <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">User</th>
              <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Resume</th>
              <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">When</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30"
              >
                <td className="px-4 py-3 uppercase font-medium text-slate-900 dark:text-slate-100">
                  {log.format}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/admin/users/${log.userId}`}
                    className="text-primary-600 hover:underline"
                  >
                    {log.user.name || log.user.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                  {log.resume.title}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <p className="mt-6 text-slate-500 text-center">No export logs yet</p>
      )}
    </div>
  );
}
