"use client";

// Free Trial – Template picker (5 basic templates)
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TRIAL_TEMPLATES = [
  { id: "trial-classic", name: "Classic", desc: "Traditional, professional" },
  { id: "trial-modern", name: "Modern", desc: "Clean, minimal" },
  { id: "trial-bold", name: "Bold", desc: "Strong headings, accent" },
  { id: "trial-minimal", name: "Minimalist", desc: "Sparse, elegant" },
  { id: "trial-professional", name: "Professional", desc: "Corporate, navy" },
];

export default function TryTemplatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (templateId: string) => {
    setError(null);
    setLoading(templateId);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create resume");
        return;
      }
      router.push(`/resumes/${data.id}/edit`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900/50">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            ResumeDoctor
          </Link>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            5 min left · Choose a template
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
            Choose Your Template
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-center max-w-lg mx-auto">
            All templates are single-page, ATS-friendly. Pick one to start building.
          </p>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRIAL_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelect(t.id)}
                disabled={loading !== null}
                className="group block text-left rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-lg hover:border-primary-500/50 transition-all disabled:opacity-50"
              >
                <div
                  className={`aspect-[3/4] rounded-lg mb-4 flex items-center justify-center ${
                    t.id === "trial-classic"
                      ? "bg-slate-200 dark:bg-slate-700"
                      : t.id === "trial-bold"
                        ? "bg-primary-100 dark:bg-primary-900/40"
                        : t.id === "trial-professional"
                          ? "bg-slate-800"
                          : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  <span
                    className={`text-4xl font-bold ${
                      t.id === "trial-professional"
                        ? "text-slate-400"
                        : "text-slate-300 dark:text-slate-600 group-hover:text-primary-400"
                    }`}
                  >
                    Aa
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {t.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t.desc}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
                  {loading === t.id ? "Creating..." : "Use this template →"}
                </span>
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
