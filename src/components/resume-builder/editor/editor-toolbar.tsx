"use client";

import Link from "next/link";
import type { ResumeSection } from "@/types/resume";
import { computeResumeProgress } from "@/lib/resume-utils";
import { getActiveStepId, getStepProgressLabel, isReviewModeReady } from "@/lib/resume-editor-progress";
import { StepWizard } from "@/components/resume-builder/step-wizard";
import { ExportButtons } from "@/components/resume-builder/export-buttons";
import { ShareResumeButton } from "@/components/resume-builder/share-resume-button";
import { EditorSaveStatus } from "@/components/resume-builder/editor/save-status";
import type { EditorStepId } from "@/lib/resume-editor-progress";

interface TemplateOption {
  id: string;
  name: string;
  isProOnly?: boolean;
}

interface Props {
  resumeId: string;
  title: string;
  sections: ResumeSection[];
  templateId: string;
  templates: TemplateOption[];
  currentTemplateName: string;
  isTrial: boolean;
  isPro: boolean;
  secondsLeft: number;
  editorLocked: boolean;
  editorMode: "write" | "review";
  onEditorModeChange: (mode: "write" | "review") => void;
  saveStatus: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
  onRetrySave: () => void;
  onTitleChange: (value: string) => void;
  onStepClick: (stepId: EditorStepId) => void;
  onTemplateSelect: (id: string) => void;
  onDesignOpen: () => void;
  onDashboardNavigate: () => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
  resumePackCredits: number;
  formatTime: (s: number) => string;
  templateOpen: boolean;
  setTemplateOpen: (open: boolean) => void;
  templateHint: string | null;
  setTemplateHint: (hint: string | null) => void;
}

export function EditorToolbar({
  resumeId,
  title,
  sections,
  templateId,
  templates,
  currentTemplateName,
  isTrial,
  isPro,
  secondsLeft,
  editorLocked,
  editorMode,
  onEditorModeChange,
  saveStatus,
  lastSavedAt,
  onRetrySave,
  onTitleChange,
  onStepClick,
  onTemplateSelect,
  onDesignOpen,
  onDashboardNavigate,
  previewRef,
  resumePackCredits,
  formatTime,
  templateOpen,
  setTemplateOpen,
  templateHint,
  setTemplateHint,
}: Props) {
  const progress = computeResumeProgress(sections);
  const activeStep = getActiveStepId(sections);
  const stepProgress = getStepProgressLabel(activeStep, sections);
  const reviewReady = isReviewModeReady(sections);

  return (
    <header className="sticky top-16 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              onDashboardNavigate();
            }}
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            ← Dashboard
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={editorLocked}
            readOnly={editorLocked}
            aria-label="Resume title"
            className="min-w-0 max-w-[12rem] truncate rounded bg-transparent px-2 py-1 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 dark:text-slate-100 sm:max-w-xs"
          />
          <EditorSaveStatus status={saveStatus} lastSavedAt={lastSavedAt} onRetry={onRetrySave} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEditorModeChange("write")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              editorMode === "write"
                ? "bg-primary-600 text-white"
                : "border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => onEditorModeChange("review")}
            disabled={!reviewReady}
            title={reviewReady ? "Review tools and export" : "Reach 30% completion to unlock review tools"}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
              editorMode === "review"
                ? "bg-primary-600 text-white"
                : "border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
            }`}
          >
            Review
          </button>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-2 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {isTrial && secondsLeft > 0 && (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {formatTime(secondsLeft)} left · autosaved
            </span>
          )}
          <span className="text-xs text-slate-500" title="Resume completion">
            {progress}% document
            {stepProgress ? ` · ${stepProgress}` : ""}
          </span>
          <StepWizard sections={sections} onStepClick={onStepClick} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {templates.length > 0 && (
            <div className="relative">
              <button
                type="button"
                disabled={editorLocked}
                aria-expanded={templateOpen}
                onClick={() => {
                  setTemplateHint(null);
                  setTemplateOpen(!templateOpen);
                }}
                className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <span className="max-w-[8rem] truncate">{currentTemplateName}</span>
                <span className="text-slate-400">▼</span>
              </button>
              {templateHint && (
                <p className="absolute left-0 top-full z-20 mt-1 max-w-[220px] text-xs text-amber-700 dark:text-amber-300">
                  {templateHint}{" "}
                  <Link href="/pricing" className="font-medium underline">
                    Pricing
                  </Link>
                </p>
              )}
              {templateOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setTemplateOpen(false)} aria-hidden />
                  <div className="absolute left-0 top-full z-20 mt-1 grid max-h-[280px] min-w-[240px] grid-cols-1 gap-1 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    {templates.map((t) => {
                      const locked = Boolean(t.isProOnly) && !isPro;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            if (locked) {
                              setTemplateHint("Pro template — upgrade to unlock.");
                              return;
                            }
                            setTemplateHint(null);
                            onTemplateSelect(t.id);
                            setTemplateOpen(false);
                          }}
                          className={`flex items-center gap-2 px-3 py-2 text-left text-sm ${
                            templateId === t.id
                              ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                              : locked
                                ? "cursor-not-allowed text-slate-400"
                                : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span
                            className="h-8 w-6 rounded border border-slate-200 bg-gradient-to-b from-slate-50 to-white dark:border-slate-600 dark:from-slate-800 dark:to-slate-900"
                            aria-hidden
                          />
                          <span>
                            {t.name}
                            {locked ? " · Pro" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
          <button
            type="button"
            disabled={editorLocked}
            onClick={onDesignOpen}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300"
          >
            Design
          </button>
          {editorMode === "review" && (
            <>
              <Link
                href={`/cover-letters/new?resumeId=${resumeId}`}
                className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 md:inline-flex dark:border-slate-600 dark:text-slate-300"
              >
                Cover Letter
              </Link>
              <ShareResumeButton resumeId={resumeId} disabled={isTrial} />
              <ExportButtons
                resumeId={resumeId}
                resumeTitle={title}
                sections={sections}
                previewRef={previewRef}
                isPro={isPro}
                isTrial={isTrial}
                resumePackCredits={resumePackCredits}
                emphasize={reviewReady}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
