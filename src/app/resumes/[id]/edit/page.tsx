// WBS 3.4–3.10, 5 – Resume builder page with export (supports trial)
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useRef } from "react";
import { useResume } from "@/hooks/use-resume";
import { useSubscription } from "@/hooks/use-subscription";
import { useTrialTimer } from "@/hooks/use-trial-timer";
import { SectionList } from "@/components/resume-builder/section-list";
import { ResumePreview } from "@/components/resume-builder/resume-preview";
import { AddSection } from "@/components/resume-builder/add-section";
import { ExportButtons } from "@/components/resume-builder/export-buttons";
import type { ResumeSection } from "@/types/resume";

export default function EditResumePage() {
  const params = useParams();
  const id = params.id as string;
  const previewRef = useRef<HTMLDivElement>(null);
  const { resume, loading, saveStatus, updateContent, updateTitle } =
    useResume(id);
  const { isPro, isTrial } = useSubscription();
  const { secondsLeft, expired } = useTrialTimer(isTrial);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading resume...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600">Resume not found</p>
        <Link
          href={isTrial ? "/try" : "/dashboard"}
          className="text-primary-600 hover:underline"
        >
          {isTrial ? "Back to Try free" : "Back to dashboard"}
        </Link>
      </div>
    );
  }

  const sections = resume.content.sections ?? [];

  const handleSectionsChange = (newSections: ResumeSection[]) => {
    updateContent({ sections: newSections });
  };

  const handleAddSection = (section: ResumeSection) => {
    handleSectionsChange([...sections, section]);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 relative">
      {expired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md mx-4 text-center shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Time&apos;s up!
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Your 5-minute trial has ended. Sign up to save your resume and export to PDF.
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Link
                href="/signup"
                className="rounded-xl bg-accent hover:bg-accent-hover px-6 py-3 font-semibold text-accent-dark"
              >
                Sign up to save
              </Link>
              <Link
                href="/try?expired=1"
                className="rounded-xl border border-slate-300 dark:border-slate-600 px-6 py-3 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Start new trial
              </Link>
            </div>
          </div>
        </div>
      )}

      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={isTrial ? "/try" : "/dashboard"}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              ← {isTrial ? "Try free" : "Dashboard"}
            </Link>
            {isTrial && secondsLeft > 0 && (
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                {formatTime(secondsLeft)} left
              </span>
            )}
            <input
              type="text"
              value={resume.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 border-none focus:outline-none focus:ring-0 px-2 py-1 rounded"
            />
          </div>
          <div className="flex items-center gap-3">
            <ExportButtons
              resumeId={id}
              resumeTitle={resume.title}
              sections={sections}
              previewRef={previewRef}
              isPro={isPro}
              isTrial={isTrial}
            />
            <span
              className={`text-sm ${
                saveStatus === "saving"
                  ? "text-amber-600"
                  : saveStatus === "saved"
                    ? "text-green-600"
                    : saveStatus === "error"
                      ? "text-red-600"
                      : "text-slate-500"
              }`}
            >
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "saved" && "Saved"}
              {saveStatus === "error" && "Error saving"}
              {saveStatus === "idle" && "Auto-save on"}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <SectionList sections={sections} onChange={handleSectionsChange} />
            <AddSection sections={sections} onAdd={handleAddSection} />
          </div>
        </div>

        <div className="lg:w-[500px] xl:w-[550px] flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/30 overflow-y-auto p-4">
          <div className="sticky top-4 relative">
            <p className="text-xs text-slate-500 mb-2">Preview</p>
            <div ref={previewRef} className="relative">
              <ResumePreview sections={sections} templateId={resume.templateId} className="scale-[0.85] origin-top" />
              {(!isPro || isTrial) && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  aria-hidden
                >
                  <span className="text-2xl font-semibold text-slate-300 dark:text-slate-600 rotate-[-15deg] select-none">
                    Upgrade for PDF
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
