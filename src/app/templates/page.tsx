"use client";

// WBS 4.4, 4.8e – Template selector UI
import { Suspense, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ResumePreview } from "@/components/resume-builder/resume-preview";
import { DEMO_RESUME_CONTENT, type ResumeSection } from "@/types/resume";
import { trackEvent } from "@/lib/analytics";
import { useSubscription } from "@/hooks/use-subscription";
import { PricingTrustStatsBar } from "@/components/pricing/payment-value-sections";

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
    <div className="w-full h-full overflow-hidden relative">
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
        <div
          className="origin-top-left"
          style={{ transform: "scale(0.28)", width: "358%", height: "358%", transformOrigin: "top left" }}
        >
          <ResumePreview
            sections={sections}
            templateId={templateId}
            primaryColor={primaryColor}
          />
        </div>
      )}
    </div>
  );
}

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  category?: string;
  colors: { primary: string };
  trialAvailable?: boolean;
  thumbnailUrl?: string;
  isProOnly?: boolean;
}

const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "professional", label: "Professional" },
  { value: "modern", label: "Modern" },
  { value: "creative", label: "Creative" },
  { value: "classic", label: "Classic" },
  { value: "minimal", label: "Minimal" },
  { value: "ats", label: "ATS" },
  { value: "fresher", label: "Fresher" },
  { value: "tech", label: "Tech" },
  { value: "executive", label: "Executive" },
];

function TemplatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const { isPro, loading: subLoading } = useSubscription();
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState<string | null>(null);
  const initialCategory = useMemo(() => searchParams.get("category") ?? "", [searchParams]);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateInfo | null>(null);

  useEffect(() => {
    setCategoryFilter(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    fetch("/api/templates", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { templates: [] }))
      .then((data) => setTemplates(data.templates ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleUseTemplate = async (templateId: string) => {
    const t = templates.find((x) => x.id === templateId);
    if (t?.isProOnly && !isPro) {
      if (sessionStatus !== "authenticated") {
        router.push(`/login?callbackUrl=${encodeURIComponent("/templates")}`);
        return;
      }
      router.push("/pricing");
      return;
    }
    setCreateLoading(templateId);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?callbackUrl=/templates`);
          return;
        }
        setCreateLoading(null);
        return;
      }
      trackEvent("template_selected", { template_id: templateId });
      trackEvent("resume_created", { template_id: templateId });
      router.push(`/resumes/${data.id}/edit`);
    } finally {
      setCreateLoading(null);
    }
  };

  const sampleSections = DEMO_RESUME_CONTENT.sections;
  const filteredTemplates = categoryFilter
    ? templates.filter((t) => (t.category ?? "").toLowerCase() === categoryFilter.toLowerCase())
    : templates;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900/50">
      <SiteHeader variant="home" />

      <main id="main-content" tabIndex={-1} className="flex-1 px-4 py-12 outline-none">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
            Resume Templates
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
            Recruiter-tested layouts for the Indian job market — pick one, fill in your story, and
            share it as a link. Pro unlocks every style plus PDF and Word when you need to submit a file.
          </p>

          <div className="mt-6 max-w-3xl mx-auto">
            <PricingTrustStatsBar variant="compact" />
          </div>

          {!loading && (
            <div className="mt-8 flex justify-center">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  setCategoryFilter(v);
                  const url = v ? `/templates?category=${v}` : "/templates";
                  router.replace(url, { scroll: false });
                }}
                className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <p className="mt-12 text-center text-slate-500">Loading templates...</p>
          ) : (
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((t) => (
                <article
                  key={t.id}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-500/50 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(t)}
                    className="block w-full text-left aspect-[3/4] bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-4 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <TemplateThumbnail
                      templateId={t.id}
                      thumbnailUrl={t.thumbnailUrl}
                      primaryColor={t.colors.primary}
                      sections={sampleSections}
                    />
                  </button>
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {t.name}
                      {t.isProOnly && !isPro && !subLoading && (
                        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-amber-700 dark:text-amber-300" title="Unlock with Pro for PDF, Word, and this template">
                          <Lock className="h-3.5 w-3.5" aria-hidden />
                          Pro · PDF/DOCX
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(t)}
                      className="mt-3 text-sm text-primary-600 hover:underline"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(t.id)}
                      disabled={!!createLoading || subLoading}
                      className={`mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                        t.isProOnly && !isPro
                          ? "border-2 border-amber-500/60 text-amber-800 dark:text-amber-200 bg-amber-50/50 dark:bg-amber-900/20 hover:bg-amber-100/80 dark:hover:bg-amber-900/30"
                          : "bg-primary-600 text-white hover:bg-primary-700"
                      }`}
                    >
                      {createLoading === t.id
                        ? "Creating..."
                        : t.isProOnly && !isPro
                          ? "Upgrade to use"
                          : "Use this template"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {previewTemplate && (
            <>
              <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={() => setPreviewTemplate(null)}
                aria-hidden
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {previewTemplate.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(null)}
                      className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
                    <ResumePreview
                      sections={sampleSections}
                      templateId={previewTemplate.id}
                      primaryColor={previewTemplate.colors.primary}
                      className="shadow-md"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUseTemplate(previewTemplate.id)}
                    disabled={!!createLoading}
                    className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    {createLoading === previewTemplate.id ? "Creating..." : "Use this template"}
                  </button>
                </div>
              </div>
            </>
          )}

          <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-primary-600">
              Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900/50">
        <SiteHeader variant="home" />
        <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center px-4 outline-none">
          <p className="text-slate-500">Loading...</p>
        </main>
      </div>
    }>
      <TemplatesPageContent />
    </Suspense>
  );
}
