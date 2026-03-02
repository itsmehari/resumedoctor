"use client";

// WBS 4.4 – Template selector UI (5 Indian-style templates)
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ResumePreview } from "@/components/resume-builder/resume-preview";
import { DEFAULT_RESUME_CONTENT } from "@/types/resume";
import { trackEvent } from "@/lib/analytics";

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  category?: string;
  colors: { primary: string };
  trialAvailable?: boolean;
}

export default function TemplatesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/templates", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { templates: [] }))
      .then((data) => setTemplates(data.templates ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleUseTemplate = async (templateId: string) => {
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

  const sampleSections = DEFAULT_RESUME_CONTENT.sections;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900/50">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <nav className="flex gap-4">
            {session ? (
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                Sign in
              </Link>
            )}
            <Link href="/try" className="text-primary-600 font-medium hover:text-primary-700">
              Try free
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
            Resume Templates
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
            ATS-friendly designs for the Indian job market. Choose a template and start building.
          </p>

          {loading ? (
            <p className="mt-12 text-center text-slate-500">Loading templates...</p>
          ) : (
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((t) => (
                <article
                  key={t.id}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-500/50 transition-all"
                >
                  <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-4">
                    <div className="w-full max-w-[200px] scale-75 origin-center">
                      <ResumePreview
                        sections={sampleSections}
                        templateId={t.id}
                        primaryColor={t.colors.primary}
                        className="shadow-md"
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {t.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(t.id)}
                      disabled={!!createLoading}
                      className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      {createLoading === t.id ? "Creating..." : "Use this template"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
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
