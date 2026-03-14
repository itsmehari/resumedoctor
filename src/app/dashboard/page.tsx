// WBS 3.9, 3.10 – Resume list & empty state (Phase 1)
"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Copy, Trash2, FileText, Upload } from "lucide-react";
import { UserDashboardLayout } from "@/components/user-dashboard-layout";
import { ResumeImportModal } from "@/components/resume-import-modal";
import { useSubscription } from "@/hooks/use-subscription";
import { useTrialTimer } from "@/hooks/use-trial-timer";
import { getTemplateDisplayName } from "@/lib/subscription-labels";
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
  const { isPro, isTrial, displayName, isImpersonating } = useSubscription();
  const { secondsLeft, expired } = useTrialTimer(isTrial);
  const searchParams = useSearchParams();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResumeItem | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const upgraded = searchParams.get("upgraded") === "1";
  const openImportParam = searchParams.get("openImport") === "1";

  const welcomeName = displayName || session?.user?.name || session?.user?.email;

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

  const actions = (
    <>
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
    </>
  );

  return (
    <UserDashboardLayout
      title="My Resumes"
      subtitle={welcomeName ? `Welcome, ${welcomeName}` : undefined}
      actions={actions}
    >
      {status === "loading" ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
          <p className="text-slate-500">Loading resumes...</p>
        </div>
      ) : (
        <>
          {isImpersonating && (
            <div className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 flex items-center justify-between gap-3 shadow-sm">
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
            <div className="mb-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-green-800 dark:text-green-200 text-sm shadow-sm">
              You&apos;re now a Pro member. PDF & Word export are unlocked.
            </div>
          )}
          {isTrial && !expired && secondsLeft > 0 && (
            <div className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
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

          {/* Welcome section when user has resumes */}
          {!loading && resumes.length > 0 && welcomeName && (
            <div className="mb-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 border border-primary-200/60 dark:border-primary-800/40 p-6 shadow-sm">
              <p className="text-primary-800 dark:text-primary-200 font-medium">
                Hi {welcomeName.split(/[\s@]/)[0]}! You have {resumes.length} resume{resumes.length !== 1 ? "s" : ""} in your library.
              </p>
              <p className="mt-1 text-sm text-primary-700/80 dark:text-primary-300/80">
                Keep your resume sharp—update it when you achieve something new.
              </p>
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
              <p className="text-slate-500">Loading resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 p-14 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/30 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
                No resumes yet
              </p>
              <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Create your first resume in minutes. Choose a template and start building your ATS-ready resume.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={isTrial ? "/try/templates" : "/resumes/new"}
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors shadow-sm"
                >
                  {isTrial ? "Choose a template" : "Create your first resume"}
                </Link>
                <button
                  onClick={() => setImportOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Import PDF or DOCX
                </button>
                {!isTrial && (
                  <Link
                    href="/try/templates"
                    className="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Browse templates
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {resumes.map((r) => (
                <li
                  key={r.id}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700 border-l-4 border-l-primary-500/0 hover:border-l-primary-500 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 flex items-center justify-between p-4">
                      <Link href={`/resumes/${r.id}/edit`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center border border-primary-100 dark:border-primary-800/40">
                            <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate">
                              {r.title}
                            </span>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0">
                              <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                                {getTemplateDisplayName(r.templateId)}
                              </span>
                              <span>
                                Updated {formatDistanceToNow(new Date(r.updatedAt), { addSuffix: true })}
                              </span>
                              {r._count && r._count.exportLogs > 0 && (
                                <span>
                                  · {r._count.exportLogs} export{r._count.exportLogs !== 1 ? "s" : ""}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        <button
                          onClick={() => handleDuplicate(r)}
                          disabled={!!actionLoading}
                          className="p-2.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setMenuOpen(menuOpen === r.id ? null : r.id)}
                            className="p-2.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-400 dark:hover:bg-slate-800 transition-colors"
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
                              <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1">
                                <button
                                  onClick={() => handleDuplicate(r)}
                                  disabled={!!actionLoading}
                                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-t-lg"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                  {actionLoading === r.id ? "Duplicating…" : "Duplicate"}
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget(r);
                                    setMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
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
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

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
    </UserDashboardLayout>
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
