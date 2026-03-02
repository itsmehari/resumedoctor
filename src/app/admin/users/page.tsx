"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  subscription: string;
  createdAt: string;
  _count: { resumes: number; exportLogs: number; accounts: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    if (search) params.set("search", search);
    if (subscriptionFilter) params.set("subscription", subscriptionFilter);
    if (roleFilter) params.set("role", roleFilter);
    fetch(`/api/admin/users?${params}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { users: [], pagination: null }))
      .then(({ users: u, pagination: p }) => {
        setUsers(u);
        setPagination(p);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Users
      </h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Manage all users, search, and filter by plan or role.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
        </div>
        <select
          value={subscriptionFilter}
          onChange={(e) => setSubscriptionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="trial">Trial</option>
          <option value="pro_monthly">Pro Monthly</option>
          <option value="pro_annual">Pro Annual</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
        >
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="mt-8 text-slate-500">Loading...</p>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">User</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Plan</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Resumes</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Exports</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-900 dark:text-slate-100"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {u.name || "—"}
                        </p>
                        <p className="text-slate-500 text-xs">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize">{u.subscription.replace("_", " ")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u._count.resumes}</td>
                    <td className="px-4 py-3">{u._count.exportLogs}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-primary-600 hover:underline text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} users)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 inline" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.totalPages}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4 inline" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
