// WBS 3.9, 3.10 – Resume list & empty state (Phase 1)
"use client";

import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { FileText, Upload } from "lucide-react";
import { UserDashboardLayout } from "@/components/user-dashboard-layout";
import { ResumeImportModal } from "@/components/resume-import-modal";
import { useSubscription } from "@/hooks/use-subscription";
import { useTrialTimer } from "@/hooks/use-trial-timer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts";
import { DashboardNextSteps } from "@/components/dashboard/dashboard-next-steps";
import { ResumeLibraryGrid } from "@/components/dashboard/resume-library-grid";
import { DashboardShareHighlight } from "@/components/resume-link/dashboard-share-highlight";
import { useToast } from "@/contexts/toast-context";

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
  const { toast } = useToast();
  const { isPro, isTrial, displayName, isImpersonating, emailVerified, loading: subLoading } = useSubscription();
  const { secondsLeft, expired } = useTrialTimer(isTrial);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const resumesRef = useRef<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResumeItem | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [resendVerifyBusy, setResendVerifyBusy] = useState(false);
  const [resendVerifyMsg, setResendVerifyMsg] = useState<string | null>(null);
  const upgraded = searchParams.get("upgraded") === "1";
  const openImportParam = searchParams.get("openImport") === "1";
  const highlightShare = searchParams.get("highlight") === "share";
  const highlightResumeId = searchParams.get("resumeId");

  const welcomeName = displayName || session?.user?.name || session?.user?.email;

  useEffect(() => {
    resumesRef.current = resumes;
  }, [resumes]);

  const fetchResumes = useCallback(() => {
    const showFullPageLoader = resumesRef.current.length === 0;
    if (showFullPageLoader) setLoading(true);
    setListError(null);
    fetch("/api/resumes", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          setListError("Could not load your resumes. Check your connection and try again.");
          return;
        }
        const data = await res.json().catch(() => null);
        if (!Array.isArray(data)) {
          setListError("Could not load your resumes. Try again in a moment.");
          return;
        }
        setResumes(data);
      })
      .catch(() => {
        setListError("Could not load your resumes. Check your connection and try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

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
      } else {
        toast("Could not duplicate resume. Try again.", { variant: "error" });
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
      } else {
        toast("Could not delete resume. Try again.", { variant: "error" });
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendVerify = async () => {
    setResendVerifyMsg(null);
    setResendVerifyBusy(true);
    try {
      const r = await fetch("/api/auth/resend-verification", {
        method: "POST",
        credentials: "include",
      });
      const data = await r.json().catch(() => ({}));
      setResendVerifyMsg(
        r.ok
          ? (data.message as string) || "Sent. Check your inbox."
          : (data.error as string) || "Could not send email."
      );
    } catch {
      setResendVerifyMsg("Something went wrong.");
    } finally {
      setResendVerifyBusy(false);
    }
  };

  return (
    <UserDashboardLayout
      title="My Resumes"
      subtitle={welcomeName ? `Welcome, ${welcomeName}` : undefined}
      actions={
        <DashboardHeaderActions isPro={isPro} onImport={() => setImportOpen(true)} />
      }
    >
      {status === "loading" ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
          <p className="text-slate-500">Loading resumes...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div className="min-w-0 space-y-6">
          {listError && resumes.length > 0 && (
            <div
              className="mb-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-red-800 dark:text-red-200"
              role="alert"
            >
              <span>{listError}</span>
              <button
                type="button"
                onClick={() => fetchResumes()}
                className="shrink-0 rounded-lg bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !listError && highlightShare && highlightResumeId && (
            <DashboardShareHighlight resumeId={highlightResumeId} />
          )}
          {!loading && !listError && resumes.length > 0 && welcomeName && (
            <div className="rounded-xl border border-primary-200/60 bg-gradient-to-br from-primary-50 to-primary-100/50 p-5 shadow-sm dark:border-primary-800/40 dark:from-primary-900/20 dark:to-primary-800/10">
              <p className="font-medium text-primary-800 dark:text-primary-200">
                Hi {welcomeName.split(/[\s@]/)[0]}! {resumes.length} resume{resumes.length !== 1 ? "s" : ""} in your library.
              </p>
              <p className="mt-1 text-sm text-primary-700/80 dark:text-primary-300/80">
                Update when you have something new to show recruiters.
              </p>
            </div>
          )}

          {!loading && !listError && resumes.length > 0 && (
            <DashboardNextSteps firstResumeId={resumes[0]?.id ?? null} />
          )}

          {loading ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
              <p className="text-slate-500">Loading resumes...</p>
            </div>
          ) : listError && resumes.length === 0 ? (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 p-12 text-center shadow-sm">
              <p className="text-red-800 dark:text-red-200 font-medium">{listError}</p>
              <button
                type="button"
                onClick={() => fetchResumes()}
                className="mt-4 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
              >
                Retry
              </button>
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
            <ResumeLibraryGrid
              resumes={resumes}
              actionLoading={actionLoading}
              menuOpen={menuOpen}
              onMenuToggle={setMenuOpen}
              onDuplicate={(r) => handleDuplicate(r as ResumeItem)}
              onDeleteRequest={(r) => {
                setDeleteTarget(r as ResumeItem);
                setMenuOpen(null);
              }}
            />
          )}
            </div>

            <aside className="lg:sticky lg:top-24">
              <DashboardAlerts
                isImpersonating={isImpersonating}
                showTrustBar={!isImpersonating}
                emailVerified={emailVerified}
                subLoading={subLoading}
                resendVerifyBusy={resendVerifyBusy}
                resendVerifyMsg={resendVerifyMsg}
                onResendVerify={handleResendVerify}
                upgraded={upgraded}
                isTrial={isTrial}
                expired={expired}
                secondsLeft={secondsLeft}
                firstResumeId={resumes[0]?.id ?? null}
                showOnboarding={status === "authenticated" && !isImpersonating}
              />
            </aside>
          </div>
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
