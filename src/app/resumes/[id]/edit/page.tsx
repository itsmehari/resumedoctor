// WBS 3.4–3.10, 5 – Resume builder page with export (supports trial)
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useResume } from "@/hooks/use-resume";
import { useSubscription } from "@/hooks/use-subscription";
import { useTrialTimer } from "@/hooks/use-trial-timer";
import { SectionList } from "@/components/resume-builder/section-list";
import { computeResumeProgress } from "@/lib/resume-utils";
import { ResumePreview } from "@/components/resume-builder/resume-preview";
import { AddSection } from "@/components/resume-builder/add-section";
import { ExportButtons } from "@/components/resume-builder/export-buttons";
import { ShareResumeButton } from "@/components/resume-builder/share-resume-button";
import { AtsScorePanel } from "@/components/resume-builder/ats-score-panel";
import { JobPastePanel } from "@/components/resume-builder/job-paste-panel";
import { LiveFeedbackPanel } from "@/components/resume-builder/live-feedback-panel";
import { IndiaTipsPanel } from "@/components/resume-builder/india-tips-panel";
import { StepWizard } from "@/components/resume-builder/step-wizard";
import type { ResumeSection } from "@/types/resume";

export default function EditResumePage() {
  const params = useParams();
  const id = params.id as string;
  const previewRef = useRef<HTMLDivElement>(null);
  const { resume, loading, saveStatus, updateContent, updateTitle, updateTemplateId } =
    useResume(id);
  const { isPro, isTrial, resumePackCredits } = useSubscription();
  const { secondsLeft, expired } = useTrialTimer(isTrial);
  const [templates, setTemplates] = useState<Array<{ id: string; name: string }>>([]);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const meta = resume?.content?.meta ?? {};
  const handleCustomize = (updates: { primaryColor?: string; fontFamily?: "sans" | "serif" | "mono"; fontSize?: "small" | "normal" | "large"; spacing?: "compact" | "normal" | "spacious"; dateFormat?: "DD/MM/YYYY" | "MM/YYYY"; documentType?: "Resume" | "CV" }) => {
    if (!resume) return;
    const newMeta = { ...meta, ...updates };
    const newContent = { ...resume.content, meta: newMeta };
    updateContent(newContent);
  };

  useEffect(() => {
    fetch("/api/templates", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { templates: [] }))
      .then((data) =>
        setTemplates(
          (data.templates ?? []).map((t: { id: string; name: string }) => ({ id: t.id, name: t.name }))
        )
      );
  }, []);

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
          href="/dashboard"
          className="text-primary-600 hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const sections = resume.content.sections ?? [];
  const currentTemplateName =
    templates.find((t) => t.id === resume.templateId)?.name ?? resume.templateId;

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
              href="/dashboard"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              ← Dashboard
            </Link>
            {isTrial && secondsLeft > 0 && (
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                {formatTime(secondsLeft)} left
              </span>
            )}
            <span className="text-sm text-slate-500 dark:text-slate-400" title="Resume completion">
              {computeResumeProgress(sections)}% complete
            </span>
            <StepWizard sections={sections} />
            <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:inline">
              Recruiters spend ~7 seconds on first scan
            </span>
            <input
              type="text"
              value={resume.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 border-none focus:outline-none focus:ring-0 px-2 py-1 rounded"
            />
            {templates.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTemplateOpen(!templateOpen)}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span>{currentTemplateName}</span>
                  <span className="text-slate-400">▼</span>
                </button>
                {templateOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setTemplateOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute left-0 top-full mt-1 z-20 min-w-[160px] max-h-[280px] overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1">
                      {templates.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            updateTemplateId(t.id);
                            setTemplateOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm ${
                            resume.templateId === t.id
                              ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCustomizeOpen(!customizeOpen)}
                className="flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Customize
              </button>
              {customizeOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCustomizeOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 top-full mt-1 z-20 w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-3">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Accent color</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {["#0f172a", "#1e40af", "#059669", "#7c3aed", "#be185d", "#ea580c", "#0d9488", "#1e293b", "#dc2626", "#2563eb", "#16a34a", "#9333ea", "#0891b2", "#ca8a04"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleCustomize({ primaryColor: meta.primaryColor === c ? undefined : c })}
                          className={`w-6 h-6 rounded-full border-2 ${meta.primaryColor === c ? "border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-600"}`}
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => handleCustomize({ primaryColor: undefined })}
                        className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs"
                        title="Reset"
                      >
                        ↺
                      </button>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Font</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(["sans", "serif", "mono"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => handleCustomize({ fontFamily: meta.fontFamily === f ? undefined : f })}
                          className={`rounded px-2 py-1 text-xs ${meta.fontFamily === f ? "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
                        >
                          {f}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleCustomize({ fontFamily: undefined })}
                        className="rounded px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        Default
                      </button>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Font size</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(["small", "normal", "large"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => handleCustomize({ fontSize: meta.fontSize === f ? undefined : f })}
                          className={`rounded px-2 py-1 text-xs capitalize ${meta.fontSize === f ? "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Spacing</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(["compact", "normal", "spacious"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleCustomize({ spacing: meta.spacing === s ? undefined : s })}
                          className={`rounded px-2 py-1 text-xs capitalize ${meta.spacing === s ? "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Date format (India)</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(["MM/YYYY", "DD/MM/YYYY"] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleCustomize({ dateFormat: (meta as { dateFormat?: string }).dateFormat === d ? undefined : d })}
                          className={`rounded px-2 py-1 text-xs ${(meta as { dateFormat?: string }).dateFormat === d ? "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Document type</p>
                    <div className="flex flex-wrap gap-1">
                      {(["Resume", "CV"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleCustomize({ documentType: (meta as { documentType?: string }).documentType === t ? undefined : t })}
                          className={`rounded px-2 py-1 text-xs ${(meta as { documentType?: string }).documentType === t ? "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/cover-letters/new?resumeId=${id}`}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cover Letter
            </Link>
            <ShareResumeButton resumeId={id} disabled={isTrial} />
            <ExportButtons
              resumeId={id}
              resumeTitle={resume.title}
              sections={sections}
              previewRef={previewRef}
              isPro={isPro}
              isTrial={isTrial}
              resumePackCredits={resumePackCredits}
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
            <JobPastePanel
              resumeId={id}
              sections={sections}
              onSectionsChange={handleSectionsChange}
            />
            {computeResumeProgress(sections) < 30 && sections.length < 4 && (
              <div className="rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20 p-4">
                <h3 className="font-medium text-primary-900 dark:text-primary-100">Quick start</h3>
                <p className="mt-1 text-sm text-primary-800 dark:text-primary-200">
                  Add sections below to build your resume. Start with <strong>Contact</strong>, then <strong>Summary</strong>, and <strong>Experience</strong>. Use &quot;+ Add section&quot; to add more.
                </p>
              </div>
            )}
            <SectionList sections={sections} onChange={handleSectionsChange} resumeId={id} />
            <AddSection sections={sections} onAdd={handleAddSection} />
          </div>
        </div>

        <div className="lg:w-[500px] xl:w-[550px] flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/30 overflow-y-auto p-4">
          <div className="sticky top-4 relative space-y-6">
            <LiveFeedbackPanel sections={sections} />
            <AtsScorePanel resumeId={id} sections={sections} isPro={isPro} />
            <IndiaTipsPanel />
            <div>
            <p className="text-xs text-slate-500 mb-2">Preview</p>
            <div ref={previewRef} className="relative">
              <ResumePreview
                sections={sections}
                templateId={resume.templateId}
                primaryColor={resume.content?.meta?.primaryColor}
                fontFamily={resume.content?.meta?.fontFamily}
                fontSize={resume.content?.meta?.fontSize}
                spacing={resume.content?.meta?.spacing}
                className="scale-[0.85] origin-top"
              />
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
        </div>
      </main>
    </div>
  );
}
