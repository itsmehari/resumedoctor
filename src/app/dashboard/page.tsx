// WBS 3.9, 3.10 – Resume list & empty state (Phase 1)
"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Copy, Trash2, FileText, Upload, Menu, X } from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { ResumeImportModal } from "@/components/resume-import-modal";
import { useSubscription } from "@/hooks/use-subscription";
import { useTrialTimer } from "@/hooks/use-trial-timer";
import { getSubscriptionLabel, getTemplateDisplayName } from "@/lib/subscription-labels";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ResumeItem {
  id: string;
  title: string;
  templateId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  _count?: { exportLogs: number };
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const { subscription, isPro, isTrial, displayName, isImpersonating } = useSubscription();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";
  const { secondsLeft, expired } = useTrialTimer(isTrial);
  const searchParams = useSearchParams();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResumeItem | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const upgraded = searchParams.get("upgraded") === "1";
  const openImportParam = searchParams.get("openImport") === "1";

  const welcomeName = displayName || session?.user?.name || session?.user?.email;
  const isAuthenticated = !!session || isTrial;

  const fetchResumes = () => {
    fetch("/api/resumes", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setResumes)
      .catch(() => setResumes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    if (openImportParam) setImportOpen(true);
  }, [openImportParam]);

  const handleDuplicate = async (r: ResumeItem) => {
    setActionLoading(r.id);
    try {
      const res = await fetch(`/api/resumes/${r.id}/duplicate`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        fetchResumes();
        setMenuOpen(null);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      const res = await fetch(`/api/resumes/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setResumes((prev) => prev.filter((x) => x.id !== deleteTarget.id));
        setDeleteTarget(null);
        setMenuOpen(null);
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 min-h-16 flex items-center justify-between gap-3 py-3">
          <Link href="/" className="text-lg sm:text-xl font-bold text-primary-600 shrink-0">
            ResumeDoctor
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                isPro
                  ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
                  : isTrial
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {getSubscriptionLabel(subscription)}
            </span>
            {!isTrial && (
              <>
                <div className="hidden lg:flex items-center gap-4">
                  <Link href="/jobs" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 text-sm">
                    Jobs
                  </Link>
                  <Link href="/interview-prep" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 text-sm">
                    Interview Prep
                  </Link>
                  <Link href="/settings" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 text-sm">
                    Settings
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium text-sm">
                      Admin
                    </Link>
                  )}
                </div>
                <div className="lg:hidden relative">
                  <button
                    type="button"
                    onClick={() => setNavOpen(!navOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] touch-manipulation"
                    aria-label={navOpen ? "Close menu" : "Open menu"}
                  >
                    {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>
                  {navOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setNavOpen(false)} aria-hidden="true" />
                      <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl py-2">
                        <Link href="/jobs" onClick={() => setNavOpen(false)} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Jobs</Link>
                        <Link href="/interview-prep" onClick={() => setNavOpen(false)} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Interview Prep</Link>
                        <Link href="/settings" onClick={() => setNavOpen(false)} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Settings</Link>
                        {isAdmin && <Link href="/admin" onClick={() => setNavOpen(false)} className="block px-4 py-3 text-sm text-amber-600 dark:text-amber-400 font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20">Admin</Link>}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            {session ? (
              <UserMenu compact />
            ) : isTrial ? (
              <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium text-sm min-h-[44px] inline-flex items-center touch-manipulation">
                Sign up to save
              </Link>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {status === "loading" ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <>
            {isImpersonating && (
              <div className="mb-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                  Viewing as user (impersonation mode)
                </span>
                <button
                  onClick={async () => {
                    await fetch("/api/admin/impersonate/end", { method: "POST", credentials: "include" });
                    window.location.href = "/admin/users";
                  }}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
                >
                  Stop impersonating
                </button>
              </div>
            )}
            {upgraded && !isImpersonating && (
              <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-green-800 dark:text-green-200 text-sm">
                You&apos;re now a Pro member. PDF & Word export are unlocked.
              </div>
            )}
            {isTrial && !expired && secondsLeft > 0 && (
              <div className="mb-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                  {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")} left in your trial · Sign up to save your work
                </span>
                <Link
                  href="/signup"
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
                >
                  Sign up to save
                </Link>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  My Resumes
                </h1>
                {welcomeName && (
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    Welcome, {welcomeName}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {!isPro && (
                  <Link
                    href="/pricing"
                    className="rounded-lg border border-primary-600 px-3 sm:px-4 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors min-h-[44px] inline-flex items-center touch-manipulation"
                  >
                    Upgrade to Pro
                  </Link>
                )}
                <Link
                  href="/cover-letters"
                  className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 sm:px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors min-h-[44px] inline-flex items-center touch-manipulation"
                >
                  Cover Letters
                </Link>
                <button
                  type="button"
                  onClick={() => setImportOpen(true)}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 sm:px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-2 min-h-[44px] touch-manipulation"
                >
                  <Upload className="h-4 w-4 shrink-0" />
                  Import
                </button>
                <Link
                  href="/resumes/new"
                  className="rounded-lg bg-primary-600 px-3 sm:px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors min-h-[44px] inline-flex items-center touch-manipulation"
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
                <FileText className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">
                  No resumes yet
                </p>
                <p className="mt-2 text-slate-500 text-sm">
                  Create your first resume to get started
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href={isTrial ? "/try/templates" : "/resumes/new"}
                    className="inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                  >
                    {isTrial ? "Choose a template" : "Create Resume"}
                  </Link>
                  <button
                    onClick={() => setImportOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Upload className="h-4 w-4" />
                    Import PDF/DOCX
                  </button>
                  {!isTrial && (
                    <Link
                      href="/try/templates"
                      className="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Browse templates
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <ul className="space-y-2">
                {resumes.map((r) => (
                  <li
                    key={r.id}
                    className="group rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between p-4">
                      <Link
                        href={`/resumes/${r.id}/edit`}
                        className="flex-1 min-w-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div>
                            <span className="font-medium text-slate-900 dark:text-slate-100 block truncate">
                              {r.title}
                            </span>
                            <p className="text-sm text-slate-500 mt-0.5">
                              {getTemplateDisplayName(r.templateId)} • Updated{" "}
                              {formatDistanceToNow(new Date(r.updatedAt), {
                                addSuffix: true,
                              })}
                              {r._count && r._count.exportLogs > 0 && (
                                <> • {r._count.exportLogs} export{r._count.exportLogs !== 1 ? "s" : ""}</>
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => handleDuplicate(r)}
                          disabled={!!actionLoading}
                          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-400 dark:hover:bg-slate-700 disabled:opacity-50"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMenuOpen(menuOpen === r.id ? null : r.id)
                            }
                            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-400 dark:hover:bg-slate-700"
                            title="More actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {menuOpen === r.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setMenuOpen(null)}
                                aria-hidden="true"
                              />
                              <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1">
                                <button
                                  onClick={() => handleDuplicate(r)}
                                  disabled={!!actionLoading}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                  {actionLoading === r.id ? "Duplicating…" : "Duplicate"}
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget(r);
                                    setMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      <ResumeImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={(id) => {
          fetchResumes();
          window.location.href = `/resumes/${id}/edit`;
        }}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete resume?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently deleted. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        loading={!!actionLoading && !!deleteTarget}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500">Loading...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
