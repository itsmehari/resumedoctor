"use client";

// WBS 8.3, 8.4, 8.5, 8.6 – Cover letter editor with AI, templates, PDF/DOCX export
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles, FileDown, FileText, FileType } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface CoverLetter {
  id: string;
  title: string;
  company: string | null;
  role: string | null;
  resumeId: string | null;
  content: string;
  resume?: { id: string; title: string } | null;
}

export default function EditCoverLetterPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session, status } = useSession();
  const [letter, setLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<"professional" | "minimal" | "modern">("professional");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }
    fetch(`/api/cover-letters/${id}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setLetter)
      .finally(() => setLoading(false));
  }, [id, session?.user?.email]);

  const save = (updates: Partial<CoverLetter>) => {
    if (!letter) return;
    const next = { ...letter, ...updates };
    setLetter(next);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch(`/api/cover-letters/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: next.title,
            company: next.company,
            role: next.role,
            content: next.content,
          }),
        });
      } finally {
        setSaving(false);
        saveTimeoutRef.current = null;
      }
    }, 1000);
  };

  const handleAiCustomize = async () => {
    if (!jobDesc.trim()) {
      alert("Enter a job description first");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch(`/api/cover-letters/${id}/customize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jobDescription: jobDesc.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.content) {
        setLetter((prev) => (prev ? { ...prev, content: data.content } : null));
      } else {
        alert(data.error || "Failed to customize");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setAiLoading(false);
    }
  };

  const downloadExport = async (format: "txt" | "docx") => {
    setExportLoading(format);
    try {
      const res = await fetch(`/api/cover-letters/${id}/export/${format}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cover-letter.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      trackEvent("cover_letter_export", { format });
    } catch {
      alert(`Failed to download ${format.toUpperCase()}`);
    } finally {
      setExportLoading(null);
    }
  };

  const downloadPdf = useCallback(async () => {
    const el = previewRef.current;
    if (!el) {
      alert("Preview not available");
      return;
    }
    setExportLoading("pdf");
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      const imgH = Math.min(w / ratio, h * 1.5);
      pdf.addImage(imgData, "PNG", 0, 0, w, imgH);
      const slug = (letter?.title || "cover-letter").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cover-letter";
      trackEvent("cover_letter_export", { format: "pdf" });
      pdf.save(`${slug}-cover-letter.pdf`);
    } catch {
      alert("Failed to generate PDF");
    } finally {
      setExportLoading(null);
    }
  }, [letter?.title]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!session || !letter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600">Cover letter not found</p>
        <Link href="/cover-letters" className="text-primary-600 hover:underline">
          Back to cover letters
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/cover-letters" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            ← Cover Letters
          </Link>
          <div className="flex items-center gap-3">
            {saving && <span className="text-sm text-slate-500">Saving...</span>}
            <button
              onClick={() => downloadExport("txt")}
              disabled={!!exportLoading}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              TXT
            </button>
            <button
              onClick={downloadPdf}
              disabled={!!exportLoading}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <FileType className="h-4 w-4" />
              {exportLoading === "pdf" ? "..." : "PDF"}
            </button>
            <button
              onClick={() => downloadExport("docx")}
              disabled={!!exportLoading}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <FileDown className="h-4 w-4" />
              Word
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={letter.title}
                onChange={(e) => save({ title: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
              <input
                type="text"
                value={letter.company || ""}
                onChange={(e) => save({ company: e.target.value || null })}
                placeholder="Company name"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role / Position</label>
              <input
                type="text"
                value={letter.role || ""}
                onChange={(e) => save({ role: e.target.value || null })}
                placeholder="Job title"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20 p-4">
            <h3 className="font-medium text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Customize for Job
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
              Paste the job description below to generate a tailored cover letter.
            </p>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste job description here..."
              rows={4}
              className="w-full rounded-lg border border-amber-200 dark:border-amber-800 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
            />
            <button
              onClick={handleAiCustomize}
              disabled={aiLoading || !jobDesc.trim()}
              className="mt-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {aiLoading ? "Customizing..." : "Generate tailored letter"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Style</label>
            <div className="flex gap-2 mb-4">
              {(["professional", "minimal", "modern"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTemplateId(t)}
                  className={`rounded-lg px-3 py-1.5 text-sm capitalize ${templateId === t ? "bg-primary-600 text-white" : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cover letter content</label>
            <textarea
              value={letter.content}
              onChange={(e) => save({ content: e.target.value })}
              placeholder="Dear Hiring Manager,&#10;&#10;..."
              rows={16}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-serif text-sm leading-relaxed"
            />
          </div>

          {/* Preview for PDF export (hidden but rendered for capture) */}
          <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-8">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Preview (used for PDF)</p>
            <div
              ref={previewRef}
              className={`bg-white text-slate-800 shadow rounded-lg p-8 max-w-[21cm] mx-auto ${
                templateId === "minimal" ? "font-sans text-sm leading-relaxed" : templateId === "modern" ? "font-sans text-sm leading-loose" : "font-serif text-sm leading-relaxed"
              }`}
              style={{ minHeight: "297mm" }}
            >
              <h1 className={templateId === "minimal" ? "text-xl font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4" : templateId === "modern" ? "text-2xl font-bold text-slate-900 mb-2" : "text-2xl font-semibold text-slate-900 border-b-2 border-slate-300 pb-2 mb-4"}>
                {letter.title || "Cover Letter"}
              </h1>
              {(letter.company || letter.role) && (
                <p className={`font-medium text-slate-700 mb-4 ${templateId === "minimal" ? "text-xs uppercase tracking-wide" : ""}`}>
                  {[letter.company, letter.role].filter(Boolean).join(" · ")}
                </p>
              )}
              <div className="whitespace-pre-wrap text-slate-700">{letter.content || "Your content here."}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
