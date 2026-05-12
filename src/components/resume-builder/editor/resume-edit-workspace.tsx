"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useResume } from "@/hooks/use-resume";
import { useSubscription } from "@/hooks/use-subscription";
import { useTrialTimer } from "@/hooks/use-trial-timer";
import { SectionList } from "@/components/resume-builder/section-list";
import { ResumePreview } from "@/components/resume-builder/resume-preview";
import { AddSection } from "@/components/resume-builder/add-section";
import { AtsScorePanel } from "@/components/resume-builder/ats-score-panel";
import { JobPastePanel } from "@/components/resume-builder/job-paste-panel";
import { LiveFeedbackPanel } from "@/components/resume-builder/live-feedback-panel";
import { IndiaTipsPanel } from "@/components/resume-builder/india-tips-panel";
import { SiteHeader } from "@/components/site-header";
import { ResumeEditorProvider, useResumeEditor } from "@/components/resume-builder/editor/resume-editor-context";
import { NextStepBanner } from "@/components/resume-builder/editor/next-step-banner";
import { EditorToolbar } from "@/components/resume-builder/editor/editor-toolbar";
import { EditorDesignDrawer } from "@/components/resume-builder/editor/design-drawer";
import { EntitlementsStrip } from "@/components/resume-builder/editor/entitlements-strip";
import { computeResumeProgress } from "@/lib/resume-utils";
import { hasContactSection, isReviewModeReady, type EditorStepId } from "@/lib/resume-editor-progress";
import type { ResumeSection } from "@/types/resume";
import { useToast } from "@/contexts/toast-context";

function ResumeEditWorkspaceContent({
  resumeId,
  resume,
  saveStatus,
  updateContent,
  updateTitle,
  updateTemplateId,
  retrySave,
  flushSave,
  lastSavedAt,
}: {
  resumeId: string;
  resume: NonNullable<ReturnType<typeof useResume>["resume"]>;
  saveStatus: ReturnType<typeof useResume>["saveStatus"];
  updateContent: ReturnType<typeof useResume>["updateContent"];
  updateTitle: ReturnType<typeof useResume>["updateTitle"];
  updateTemplateId: ReturnType<typeof useResume>["updateTemplateId"];
  retrySave: ReturnType<typeof useResume>["retrySave"];
  flushSave: ReturnType<typeof useResume>["flushSave"];
  lastSavedAt: ReturnType<typeof useResume>["lastSavedAt"];
}) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const editorPaneRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isPro, isTrial, resumePackCredits, aiDailyUsed, aiDailyLimit } = useSubscription();
  const { secondsLeft, expired } = useTrialTimer(isTrial);
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; isProOnly?: boolean }>>([]);
  const [templateHint, setTemplateHint] = useState<string | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);
  const [trialPreviewOnly, setTrialPreviewOnly] = useState(false);
  const [coachingOpen, setCoachingOpen] = useState(false);
  const [fieldTouched, setFieldTouched] = useState(false);
  const progressRef = useRef(0);

  const {
    activeSectionId,
    setActiveSectionId,
    scrollToStep,
    scrollToSectionLabel,
    setEditorMode,
    editorMode,
    previewZoom,
    setPreviewZoom,
    setCoachingDeferred,
    coachingDeferred,
  } = useResumeEditor();

  const editorLocked = Boolean(expired && trialPreviewOnly);
  const sections = resume?.content.sections ?? [];
  const meta = resume?.content?.meta ?? {};
  const reviewReady = isReviewModeReady(sections);

  useEffect(() => {
    if (reviewReady) setEditorMode("review");
  }, [reviewReady, setEditorMode]);

  useEffect(() => {
    const panel = searchParams.get("panel");
    if (panel === "ats" || panel === "tips" || panel === "tailor") {
      setCoachingOpen(true);
      setEditorMode("review");
    }
    const section = searchParams.get("section");
    if (section) scrollToStep(section as EditorStepId);
  }, [searchParams, scrollToStep, setEditorMode]);

  useEffect(() => {
    const el = editorPaneRef.current;
    if (!el) return;
    if (editorLocked) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  }, [editorLocked]);

  useEffect(() => {
    fetch("/api/templates", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { templates: [] }))
      .then((data) =>
        setTemplates(
          (data.templates ?? []).map((t: { id: string; name: string; isProOnly?: boolean }) => ({
            id: t.id,
            name: t.name,
            isProOnly: t.isProOnly,
          }))
        )
      );
  }, []);

  useEffect(() => {
    const progress = computeResumeProgress(sections);
    if (progressRef.current === 0 && progress > 0) toast("Nice start — your resume progress is underway.");
    if (progressRef.current < 30 && progress >= 30) toast("Review tools unlocked — check preview and export when ready.");
    progressRef.current = progress;
  }, [sections, toast]);

  useEffect(() => {
    if (saveStatus === "error") {
      toast("Could not save — your edits are still on this page.", { variant: "error" });
    }
  }, [saveStatus, toast]);

  const currentTemplateName = templates.find((t) => t.id === resume.templateId)?.name ?? resume.templateId;

  const handleSectionsChange = (newSections: ResumeSection[]) => {
    updateContent({ ...resume.content, sections: newSections });
  };

  const handleAddSection = (section: ResumeSection) => {
    handleSectionsChange([...sections, section]);
  };

  const handleCustomize = (updates: {
    primaryColor?: string;
    fontFamily?: "sans" | "serif" | "mono";
    fontSize?: "small" | "normal" | "large";
    spacing?: "compact" | "normal" | "spacious";
    dateFormat?: "DD/MM/YYYY" | "MM/YYYY";
    documentType?: "Resume" | "CV";
  }) => {
    updateContent({ ...resume.content, meta: { ...meta, ...updates } });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-100 dark:bg-slate-950">
      <a
        href="#resume-editor-main"
        className="sr-only focus:fixed focus:left-4 focus:top-20 focus:z-[60] focus:m-0 focus:inline-block focus:h-auto focus:w-auto focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-slate-900 focus:shadow-lg focus:ring-2 focus:ring-primary-500"
      >
        Skip to resume editor
      </a>
      <SiteHeader variant="app" navVariant="dashboard" />

      <EditorToolbar
        resumeId={resumeId}
        title={resume.title}
        sections={sections}
        templateId={resume.templateId}
        templates={templates}
        currentTemplateName={currentTemplateName}
        isTrial={isTrial}
        isPro={isPro}
        secondsLeft={secondsLeft}
        editorLocked={editorLocked}
        editorMode={editorMode}
        onEditorModeChange={setEditorMode}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        onRetrySave={retrySave}
        onTitleChange={updateTitle}
        onStepClick={scrollToStep}
        onTemplateSelect={updateTemplateId}
        onDesignOpen={() => setDesignOpen(true)}
        onDashboardNavigate={() => {
          flushSave();
          router.push("/dashboard");
        }}
        previewRef={previewRef}
        resumePackCredits={resumePackCredits}
        formatTime={formatTime}
        templateOpen={templateOpen}
        setTemplateOpen={setTemplateOpen}
        templateHint={templateHint}
        setTemplateHint={setTemplateHint}
      />

      <EditorDesignDrawer open={designOpen} onClose={() => setDesignOpen(false)} meta={meta} onChange={handleCustomize} />

      <main id="resume-editor-main" tabIndex={-1} className="flex flex-1 flex-col overflow-hidden outline-none lg:flex-row">
        <div ref={editorPaneRef} className="relative flex-1 overflow-y-auto p-4 lg:p-6">
          <div
            className={`mx-auto max-w-2xl space-y-6 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 lg:p-6 ${
              editorLocked ? "pointer-events-none select-none opacity-95" : ""
            }`}
          >
            <NextStepBanner sections={sections} onAddSection={handleAddSection} />
            {editorMode === "review" && hasContactSection(sections) && (
              <JobPastePanel
                resumeId={resumeId}
                sections={sections}
                onSectionsChange={handleSectionsChange}
                aiDailyUsed={aiDailyUsed}
                aiDailyLimit={aiDailyLimit}
                isPro={isPro}
              />
            )}
            <SectionList
              sections={sections}
              onChange={handleSectionsChange}
              resumeId={resumeId}
              activeSectionId={activeSectionId}
              onActiveSectionChange={(id) => {
                setActiveSectionId(id);
                setFieldTouched(true);
                setCoachingDeferred(false);
              }}
            />
            <AddSection sections={sections} onAdd={handleAddSection} />
          </div>
        </div>

        <aside className="flex-shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40 lg:w-[500px] xl:w-[550px]">
          <div className="sticky top-4 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <button type="button" className="rounded px-2 py-1 hover:bg-slate-100" onClick={() => setPreviewZoom(0.75)}>
                    −
                  </button>
                  <span>{Math.round(previewZoom * 100)}%</span>
                  <button type="button" className="rounded px-2 py-1 hover:bg-slate-100" onClick={() => setPreviewZoom(1)}>
                    +
                  </button>
                </div>
              </div>
              <div ref={previewRef} className="relative min-h-[420px] overflow-hidden rounded-lg border border-slate-200 bg-white">
                <ResumePreview
                  sections={sections}
                  templateId={resume.templateId}
                  primaryColor={meta.primaryColor}
                  fontFamily={meta.fontFamily}
                  fontSize={meta.fontSize}
                  spacing={meta.spacing}
                  className="origin-top"
                  previewStyle={{ transform: `scale(${previewZoom})`, transformOrigin: "top center" }}
                />
              </div>
            </div>

            {editorMode === "review" && (
              <>
                <div className="lg:hidden">
                  <button
                    type="button"
                    onClick={() => setCoachingOpen((o) => !o)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium dark:border-slate-600 dark:bg-slate-900"
                    aria-expanded={coachingOpen}
                  >
                    <span>Coaching and ATS</span>
                    <span className="text-xs text-slate-400">{coachingOpen ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <div className={`space-y-4 ${coachingOpen ? "block" : "hidden lg:block"}`}>
                  <EntitlementsStrip isPro={isPro} isTrial={isTrial} />
                  <LiveFeedbackPanel
                    sections={sections}
                    isPro={isPro}
                    analysisReady={fieldTouched && !coachingDeferred}
                    onTipAction={scrollToSectionLabel}
                  />
                  <AtsScorePanel resumeId={resumeId} sections={sections} isPro={isPro} />
                  {sections.some((s) => s.type === "experience") && <IndiaTipsPanel />}
                </div>
              </>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

export function ResumeEditWorkspaceRoot({ resumeId }: { resumeId: string }) {
  const resumeHook = useResume(resumeId);
  const { resume, loading, saveStatus, updateContent, updateTitle, updateTemplateId, retrySave, flushSave, lastSavedAt } =
    resumeHook;
  const sections = resume?.content.sections ?? [];

  if (loading) {
    return (
      <>
        <SiteHeader variant="app" navVariant="dashboard" />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <p className="text-slate-500">Loading resume...</p>
        </div>
      </>
    );
  }

  if (!resume) {
    return (
      <>
        <SiteHeader variant="app" navVariant="dashboard" />
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
          <p className="text-slate-600">Resume not found</p>
          <Link href="/dashboard" className="text-primary-600 hover:underline">
            Back to dashboard
          </Link>
        </div>
      </>
    );
  }

  return (
    <ResumeEditorProvider sections={sections}>
      <ResumeEditWorkspaceContent
        resumeId={resumeId}
        resume={resume}
        saveStatus={saveStatus}
        updateContent={updateContent}
        updateTitle={updateTitle}
        updateTemplateId={updateTemplateId}
        retrySave={retrySave}
        flushSave={flushSave}
        lastSavedAt={lastSavedAt}
      />
    </ResumeEditorProvider>
  );
}