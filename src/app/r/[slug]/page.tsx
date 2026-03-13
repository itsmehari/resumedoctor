// Phase 1.3 – Public shareable resume view
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ResumePreview } from "@/components/resume-builder/resume-preview";
import type { ResumeSection } from "@/types/resume";

interface PublicResume {
  id: string;
  title: string;
  templateId: string;
  content: { sections?: ResumeSection[]; meta?: Record<string, unknown> };
  updatedAt: string;
}

export default function PublicResumePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [resume, setResume] = useState<PublicResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Not found");
      return;
    }
    fetch(`/api/resumes/by-slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setResume)
      .catch(() => setError("Resume not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">{error || "Resume not found"}</p>
        <Link
          href="/"
          className="text-primary-600 hover:underline font-medium"
        >
          Create your own resume
        </Link>
      </div>
    );
  }

  const sections = resume.content?.sections ?? [];
  const meta = resume.content?.meta ?? {};

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
            {resume.title}
          </h1>
          <Link
            href="/"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Create your resume
          </Link>
        </div>
      </header>
      <main className="flex-1 py-8 px-4 overflow-auto">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <ResumePreview
              sections={sections}
              templateId={resume.templateId}
              primaryColor={meta.primaryColor as string | undefined}
              fontFamily={meta.fontFamily as "sans" | "serif" | "mono" | undefined}
              fontSize={meta.fontSize as "small" | "normal" | "large" | undefined}
              spacing={meta.spacing as "compact" | "normal" | "spacious" | undefined}
            />
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            Created with{" "}
            <Link href="/" className="text-primary-600 hover:underline">
              ResumeDoctor
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
