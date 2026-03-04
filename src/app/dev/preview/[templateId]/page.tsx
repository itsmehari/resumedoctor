"use client";

// WBS 4.8b – Template preview page for thumbnail generation
import { useParams } from "next/navigation";
import { ResumePreview } from "@/components/resume-builder/resume-preview";
import { DEMO_RESUME_CONTENT } from "@/types/resume";

export default function DevTemplatePreviewPage() {
  const params = useParams();
  const templateId = (params?.templateId as string) || "professional-in";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-200 p-4"
      data-template-id={templateId}
    >
      <div className="w-[210mm] shadow-2xl">
        <ResumePreview
          sections={DEMO_RESUME_CONTENT.sections}
          templateId={templateId}
          className="!shadow-none"
        />
      </div>
    </div>
  );
}
