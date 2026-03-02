// WBS 5 – Export dropdown with tier gating & watermark
"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FileText, FileDown, Printer, Lock } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { ResumeSection } from "@/types/resume";
import { trackEvent, trackMetaCustom } from "@/lib/analytics";

interface Props {
  resumeId: string;
  resumeTitle: string;
  sections: ResumeSection[];
  previewRef: React.RefObject<HTMLDivElement | null>;
  isPro: boolean;
  isTrial?: boolean;
}

export function ExportButtons({
  resumeId,
  resumeTitle,
  sections,
  previewRef,
  isPro,
  isTrial = false,
}: Props) {
  const canExport = isPro && !isTrial;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const downloadTxt = useCallback(async () => {
    if (isTrial) return;
    setLoading("txt");
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/export/txt`);
      if (!res.ok) throw new Error("Failed to download");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(resumeTitle)}-resume.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download TXT");
    } finally {
      setLoading(null);
    }
  }, [resumeId, resumeTitle, isTrial]);

  const printHtml = useCallback(async () => {
    if (isTrial) return;
    setLoading("html");
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/export/html`);
      if (!res.ok) throw new Error("Failed to load");
      const html = await res.text();
      const win = window.open("", "_blank");
      if (!win) throw new Error("Popup blocked");
      win.document.write(html);
      win.document.close();
      win.onload = () => {
        win.print();
        win.close();
      };
    } catch {
      setError("Failed to open print preview");
    } finally {
      setLoading(null);
    }
  }, [resumeId, isTrial]);

  const downloadPdf = useCallback(async () => {
    if (!canExport) return;
    setLoading("pdf");
    setError(null);
    try {
      const el = previewRef.current;
      if (!el) throw new Error("Preview not found");

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      const imgH = w / ratio;
      pdf.addImage(imgData, "PNG", 0, 0, w, imgH);

      await fetch(`/api/resumes/${resumeId}/export/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "pdf" }),
      });

      pdf.save(`${slugify(resumeTitle)}-resume.pdf`);
    } catch {
      setError("Failed to generate PDF");
    } finally {
      setLoading(null);
    }
  }, [resumeId, resumeTitle, canExport, previewRef]);

  const downloadDocx = useCallback(async () => {
    if (!canExport) return;
    setLoading("docx");
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/export/docx`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to download");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(resumeTitle)}-resume.docx`;
      a.click();
      URL.revokeObjectURL(url);
      trackEvent("resume_export", { format: "docx" });
      trackMetaCustom("ResumeExport", { format: "docx" });
    } catch {
      setError("Failed to download Word");
    } finally {
      setLoading(null);
    }
  }, [resumeId, resumeTitle, canExport]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        <FileDown className="h-4 w-4" />
        Export
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1">
            {error && (
              <p className="px-3 py-2 text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {isTrial ? (
              <>
                <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Sign up to export your resume
                </div>
                <Link
                  href="/signup"
                  onClick={() => { trackEvent("upgrade_click", { source: "export_trial" }); setOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-primary-600 dark:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Create account to save & export →
                </Link>
              </>
            ) : canExport ? (
              <>
                <button
                  type="button"
                  onClick={() => { downloadTxt(); setOpen(false); }}
                  disabled={loading !== null}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  <FileText className="h-4 w-4" />
                  {loading === "txt" ? "Downloading..." : "Download TXT"}
                </button>
                <button
                  type="button"
                  onClick={() => { printHtml(); setOpen(false); }}
                  disabled={loading !== null}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  <Printer className="h-4 w-4" />
                  {loading === "html" ? "Loading..." : "Print / HTML"}
                </button>
                <button
                  type="button"
                  onClick={() => { downloadPdf(); setOpen(false); }}
                  disabled={loading !== null}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  <FileDown className="h-4 w-4" />
                  {loading === "pdf" ? "Generating..." : "Download PDF"}
                </button>
                <button
                  type="button"
                  onClick={() => { downloadDocx(); setOpen(false); }}
                  disabled={loading !== null}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  <FileDown className="h-4 w-4" />
                  {loading === "docx" ? "Downloading..." : "Download Word"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { downloadTxt(); setOpen(false); }}
                  disabled={loading !== null}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  <FileText className="h-4 w-4" />
                  {loading === "txt" ? "Downloading..." : "Download TXT"}
                </button>
                <button
                  type="button"
                  onClick={() => { printHtml(); setOpen(false); }}
                  disabled={loading !== null}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  <Printer className="h-4 w-4" />
                  {loading === "html" ? "Loading..." : "Print / HTML"}
                </button>
                <Link href="/pricing" onClick={() => { trackEvent("upgrade_click", { source: "export_pdf" }); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600">
                  <Lock className="h-4 w-4" />
                  Download PDF — Upgrade to Pro
                </Link>
                <Link href="/pricing" onClick={() => { trackEvent("upgrade_click", { source: "export_word" }); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600">
                  <Lock className="h-4 w-4" />
                  Download Word — Upgrade to Pro
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "resume";
}
