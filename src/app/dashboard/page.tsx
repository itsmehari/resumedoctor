// WBS 3.9, 3.10 – Resume list & empty state (Phase 1)
"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Copy, Trash2, FileText, Upload } from "lucide-react";
import { UserDashboardLayout } from "@/components/user-dashboard-layout";
import { ResumeImportModal } from "@/components/resume-import-modal";
import { useSubscription } from "@/hooks/use-subscription";
import { useTrialTimer } from "@/hooks/use-trial-timer";
import { getTemplateDisplayName } from "@/lib/subscription-labels";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { PricingTrustStatsBar } from "@/components/pricing/payment-value-sections";

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
  const router = useRouter();
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
    if (searchParams.get("upgraded") === "1") {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("upgraded");
      const q = next.toString();
      router.replace(q ? `/dashboard?${q}` : "/dashboard", { scroll: false });
    }
  }, [searchParams, router]);

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
          className="rounded-xl border-2 border-primary-500 px-4 py-2.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all shadow-sm min-h-[44px] inline-flex items-center touch-manipulation"
        >
          Unlock exports
        </Link>
      )}
      <Link
        href="/cover-letters"
        className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white hover:border-slate-400 hover:shadow-md dark:hover:bg-slate-800/80 transition-all min-h-[44px] inline-flex items-center touch-manipulation"
      >
        Cover Letters
      </Link>
      <button
        type="button"
        onClick={() => setImportOpen(true)}
        className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white hover:border-slate-400 hover:shadow-md dark:hover:bg-slate-800/80 transition-all inline-flex items-center gap-2 min-h-[44px] touch-manipulation"
      >
        <Upload className="h-4 w-4 shrink-0" />
        Import
      </button>
      <Link
        href="/resumes/new"
        className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25 transition-all min-h-[44px] inline-flex items-center touch-manipulation"
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
          {!isImpersonating && (
            <div className="mb-6">
              <PricingTrustStatsBar variant="inline" />
            </div>
          )}
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
          {status === "authenticated" && !isImpersonating && (
            <OnboardingChecklist firstResumeId={resumes[0]?.id ?? null} />
          )}
          {upgraded && !isImpersonating && (
            <div className="mb-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-green-800 dark:text-green-200 text-sm shadow-sm">
              You&apos;re now a Pro member. PDF & Word export are unlocked.
            </div>
          )}
          {isTrial && !expired && secondsLeft > 0 && (
            <div className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <span className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")} left in your 5-minute trial · Sign up to save and export
              </span>
              <Link
                href="/signup"
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
              >
                Sign up to save and export
              </Link>
            </div>
          )}

          {/* Welcome section when user has resumes */}
          {!loading && resumes.length > 0 && welcomeName && (
            <div className="mb-6 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 border border-primary-200/60 dark:border-primary-800/40 p-6 shadow-sm">
              <p className="text-primary-800 dark:text-primary-200 font-medium">
                Hi {welcomeName.split(/[\s@]/)[0]}! You have {resumes.length} resume{resumes.length !== 1 ? "s" : ""} in your library.
              </p>
              <p className="mt-1 text-sm text-primary-700/80 dark:text-primary-300/80">
                Keep your resume sharp—update it when you achieve something new.
              </p>
            </div>
          )}

          {/* Next steps card when user has resumes */}
          {!loading && resumes.length > 0 && (
            <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Next steps</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={resumes[0] ? `/resumes/${resumes[0].id}/edit` : "/resumes/new"}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Improve ATS score
                </Link>
                <Link
                  href="/cover-letters/new"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Add a cover letter
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Browse jobs
                </Link>
              </div>
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
              <p className="text-slate-500">Loading resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-slate-100 dark:from-primary-600/20 dark:via-primary-500/10 dark:to-slate-900 border border-primary-200/50 dark:border-primary-700/30 p-16 text-center shadow-xl">
              {/* Decorative elements */}
              <div className="absolute top-8 left-1/4 w-32 h-32 rounded-full bg-primary-400/10 blur-2xl" aria-hidden />
              <div className="absolute bottom-12 right-1/4 w-40 h-40 rounded-full bg-primary-500/10 blur-3xl" aria-hidden />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(13,101,217,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.08),transparent_50%)]" aria-hidden />
              <div className="relative">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <p className="mt-8 text-xl font-bold text-slate-900 dark:text-slate-100">
                  No resumes yet
                </p>
                <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-md mx-auto text-base">
                  Create your first resume in minutes. Choose a template and start building your ATS-ready resume.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href={isTrial ? "/try/templates" : "/resumes/new"}
                    className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                  >
                    {isTrial ? "Choose a template" : "Create your first resume"}
                  </Link>
                  <button
                    onClick={() => setImportOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 px-6 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-white hover:border-slate-400 hover:shadow-md dark:hover:bg-slate-800 transition-all"
                  >
                    <Upload className="h-5 w-5" />
                    Import PDF or DOCX
                  </button>
                  {!isTrial && (
                    <Link
                      href="/try/templates"
                      className="inline-flex rounded-xl border-2 border-slate-300 dark:border-slate-600 px-6 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-white hover:border-slate-400 hover:shadow-md dark:hover:bg-slate-800 transition-all"
                    >
                      Browse templates
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {resumes.map((r) => (
                <li
                  key={r.id}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700 border-l-4 border-l-primary-500/0 hover:border-l-primary-500 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
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
