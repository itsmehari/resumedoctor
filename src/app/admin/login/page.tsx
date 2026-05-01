"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn, signOut, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        if (res.error.startsWith("2FA_REQUIRED:")) {
          const tfToken = res.error.split(":")[1];
          try {
            sessionStorage.setItem("2fa_pending_token", tfToken);
          } catch {
            /* ignore */
          }
          window.location.href = `/login/2fa?callbackUrl=${encodeURIComponent(callbackUrl)}`;
          return;
        }
        if (res.error === "ADMIN_ENABLE_2FA") {
          setError(
            "Admin access requires two-factor authentication. Sign in at the regular user login, open Settings, enable 2FA, then return here."
          );
          setLoading(false);
          return;
        }
        setError("Invalid email or password");
        setLoading(false);
        return;
      }
      const session = await getSession();
      const role = (session?.user as { role?: string })?.role;
      if (role !== "admin") {
        await signOut({ redirect: false });
        setError(
          "Access denied: this account is not an admin in the database. On your machine run PROMOTE_ADMIN_EMAIL=your@email.com npm run promote-admin (use production DATABASE_URL in .env.local), or set User.role to admin in Prisma Studio. See docs/MASTER-ADMIN.md."
        );
        setLoading(false);
        return;
      }
      window.location.href = callbackUrl;
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Admin sign in
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Sign in to the admin dashboard
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm bg-white dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Admin sign in"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Admin access requires credentials. OAuth sign-in is not available here.
          </p>
        </div>

        <p className="text-center space-x-4">
          <Link
            href="/login"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            User sign in
          </Link>
          <span className="text-slate-400">·</span>
          <Link
            href="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500">Loading...</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
