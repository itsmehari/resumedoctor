// WBS 3.4–3.10, 5 – Resume builder page with export
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useRef } from "react";
import { useResume } from "@/hooks/use-resume";
import { useSubscription } from "@/hooks/use-subscription";
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
  const { isPro } = useSubscription();

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
        <Link href="/dashboard" className="text-primary-600 hover:underline">
          Back to dashboard
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              ← Dashboard
            </Link>
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
              <ResumePreview sections={sections} className="scale-[0.85] origin-top" />
              {!isPro && (
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
