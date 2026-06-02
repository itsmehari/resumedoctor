"use client";

// WBS 4.8e – Free Trial template picker with thumbnails
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ResumePreview } from "@/components/resume-builder/resume-preview";
import { DEFAULT_RESUME_CONTENT, type ResumeSection } from "@/types/resume";
import { SiteHeader } from "@/components/site-header";
import { trackEvent } from "@/lib/analytics";

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  colors: { primary: string };
  trialAvailable?: boolean;
  thumbnailUrl?: string;
}

function TemplateThumbnail({
  templateId,
  thumbnailUrl,
  primaryColor,
  sections,
}: {
  templateId: string;
  thumbnailUrl?: string;
  primaryColor: string;
  sections: ResumeSection[];
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const useImg = thumbnailUrl && !imgFailed;
  return (
    <div className="w-full h-full flex items-center justify-center min-h-0">
      {useImg ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- API thumbnail URL */}
          <img
            src={thumbnailUrl}
            alt=""
            className="max-w-full max-h-full object-contain"
            onError={() => setImgFailed(true)}
          />
        </>
      ) : (
        <div className="w-full max-w-[140px] scale-75 origin-center">
          <ResumePreview
            sections={sections}
            templateId={templateId}
            primaryColor={primaryColor}
            className="shadow-md"
          />
        </div>
      )}
    </div>
  );
}

export default function TryTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("preview_generated", { step: "try_templates" });
  }, []);

  useEffect(() => {
    fetch("/api/templates", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { templates: [] }))
      .then((data) =>
        setTemplates(
          (data.templates ?? []).filter((t: TemplateInfo) => t.trialAvailable !== false)
        )
      );
  }, []);

  const handleSelect = async (templateId: string) => {
    setError(null);
    setLoading(templateId);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, prefillDemo: true }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create resume");
        return;
      }
      trackEvent("resume_created", { template_id: templateId });
      router.push(`/resumes/${data.id}/edit`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900/50">
      <SiteHeader variant="app" maxWidth="4xl" />

      <main id="main-content" tabIndex={-1} className="flex-1 px-4 py-12 outline-none">
        <div className="max-w-4xl mx-auto">
          <div className="mx-auto mb-8 max-w-2xl">
            <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 dark:border-violet-800/40 dark:bg-violet-950/25">
                <span className="h-2 w-2 rounded-full bg-violet-500" aria-hidden />
                Preview
              </span>
              <span className="text-slate-400" aria-hidden>→</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900">
                Improve
              </span>
              <span className="text-slate-400" aria-hidden>→</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900">
                Export (₹49 unlock)
              </span>
            </div>
            <div className="mt-4 rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm ring-1 ring-slate-100 dark:border-slate-700/70 dark:bg-slate-900/70 dark:ring-slate-800">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Free review preview
              </p>
              <h2 className="mt-2 text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Here’s what you’ll see once you start editing
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  { t: "Strength summary", d: "A quick snapshot of what to fix first." },
                  { t: "Top 3–5 fixes", d: "Actionable improvements you can apply immediately." },
                  { t: "Sample rewrite", d: "One example bullet rewritten with better impact." },
                ].map((i) => (
                  <div key={i.t} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-700/70 dark:bg-slate-800/40">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{i.t}</p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{i.d}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Pick a template below to create a draft. You can unlock export later when you’re ready to download.
              </p>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
            Choose a template for this Try session
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-center max-w-lg mx-auto text-sm">
            Single-page, ATS-friendly layouts. Pick one to draft and preview—sign up afterward to keep editing; Pro adds
            PDF and Word when you are ready to apply.
          </p>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelect(t.id)}
                disabled={loading !== null}
                className="group block text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-500/50 transition-all disabled:opacity-50"
              >
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2">
                  <TemplateThumbnail
                    templateId={t.id}
                    thumbnailUrl={t.thumbnailUrl}
                    primaryColor={t.colors?.primary ?? "#334155"}
                    sections={DEFAULT_RESUME_CONTENT.sections}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {t.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.description}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
                    {loading === t.id ? "Creating..." : "Use this template"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link href="/try" className="hover:text-primary-600">
              ← Back to verification
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
