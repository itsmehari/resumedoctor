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
  resumePackCredits?: number; // WBS 10.7 – one-time pack
}

export function ExportButtons({
  resumeId,
  resumeTitle,
  sections: _sections,
  previewRef,
  isPro,
  isTrial = false,
  resumePackCredits = 0,
}: Props) {
  const canExport = (isPro || resumePackCredits > 0) && !isTrial;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);
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
      setOpen(false);
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
      setOpen(false);
    } catch (e) {
      if (e instanceof Error && e.message === "Popup blocked") {
        setError(
          "Your browser blocked the print window. Allow pop-ups for this site (lock icon in the address bar), then try Print again—or use Download TXT."
        );
      } else {
        setError("Failed to open print preview");
      }
    } finally {
      setLoading(null);
    }
  }, [resumeId, isTrial]);

  const downloadPdf = useCallback(async () => {
    if (!canExport) return;
    setLoading("pdf");
    setPdfStatus(null);
    setError(null);
    try {
      const el = previewRef.current;
      if (!el) throw new Error("Preview not found");

      setPdfStatus("Capturing preview…");
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      setPdfStatus("Building PDF…");
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const pageHeightPx = canvas.width * (pageH / pageW);
      const totalPages = Math.ceil(canvas.height / pageHeightPx);

      for (let p = 0; p < totalPages; p++) {
        setPdfStatus(totalPages > 1 ? `Page ${p + 1} of ${totalPages}…` : "Finishing…");
        await new Promise<void>((r) => requestAnimationFrame(() => r()));

        if (p > 0) pdf.addPage();
        const srcY = p * pageHeightPx;
        const srcH = Math.min(pageHeightPx, canvas.height - srcY);
        if (srcH <= 0) break;
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = srcH;
        const ctx = pageCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        }
        const imgData = pageCanvas.toDataURL("image/png", 1.0);
        const sliceH = pageH * (srcH / pageHeightPx);
        pdf.addImage(imgData, "PNG", 0, 0, pageW, sliceH);
      }

      setPdfStatus("Saving…");
      await fetch(`/api/resumes/${resumeId}/export/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "pdf" }),
      });

      pdf.save(`${slugify(resumeTitle)}-resume.pdf`);
      setOpen(false);
    } catch {
      setError("Failed to generate PDF");
    } finally {
      setLoading(null);
      setPdfStatus(null);
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
      setOpen(false);
    } catch {
      setError("Failed to download Word");
    } finally {
      setLoading(null);
    }
  }, [resumeId, resumeTitle, canExport]);

  const busy = loading !== null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60"
      >
        <FileDown className="h-4 w-4 shrink-0" aria-hidden />
        {busy ? (
          <span>
            {loading === "pdf" && (pdfStatus || "Preparing PDF…")}
            {loading === "txt" && "TXT…"}
            {loading === "html" && "Print…"}
            {loading === "docx" && "Word…"}
          </span>
        ) : (
          "Export"
        )}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => !busy && setOpen(false)}
            aria-hidden
          />
          <div
            className="absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1"
            role="menu"
            aria-label="Export options"
          >
            {error && (
              <p className="px-3 py-2 text-xs text-red-600 dark:text-red-400 border-b border-slate-100 dark:border-slate-700">
                {error}
              </p>
            )}
            {isTrial ? (
              <>
                <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                  <Lock className="inline h-3.5 w-3.5 mr-1 align-text-bottom" aria-hidden />
                  Try mode is preview-only. Sign up to save your work; Pro or a resume pack unlocks PDF and Word for real
                  applications.
                </div>
                <Link
                  href="/signup"
                  onClick={() => {
                    trackEvent("upgrade_click", { source: "export_trial" });
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-primary-600 dark:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  role="menuitem"
                >
                  Create account and export →
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => {
                    trackEvent("upgrade_click", { source: "export_trial_pricing" });
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  role="menuitem"
                >
                  View Pro & packs
                </Link>
              </>
            ) : canExport ? (
              <>
                {resumePackCredits > 0 && !isPro && (
                  <p className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    Resume pack: <strong className="text-slate-800 dark:text-slate-200">{resumePackCredits}</strong>{" "}
                    export{resumePackCredits !== 1 ? "s" : ""} left. PDF and Word use your pack (see pricing for details).
                  </p>
                )}
                {isPro && (
                  <p className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    Pro: PDF and Word are included with your plan.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => void downloadTxt()}
                  disabled={busy}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                  role="menuitem"
                >
                  <FileText className="h-4 w-4 shrink-0" aria-hidden />
                  {loading === "txt" ? "Downloading…" : "Download TXT"}
                </button>
                <button
                  type="button"
                  onClick={() => void printHtml()}
                  disabled={busy}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                  role="menuitem"
                >
                  <Printer className="h-4 w-4 shrink-0" aria-hidden />
                  {loading === "html" ? "Opening…" : "Print / HTML"}
                </button>
                <p className="px-3 pb-1 text-[10px] leading-snug text-slate-500 dark:text-slate-400">
                  Print opens a new tab. If nothing appears, allow pop-ups for this site.
                </p>
                <button
                  type="button"
                  onClick={() => void downloadPdf()}
                  disabled={busy}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                  role="menuitem"
                >
                  <FileDown className="h-4 w-4 shrink-0" aria-hidden />
                  {loading === "pdf" ? pdfStatus || "Preparing PDF…" : "Download PDF"}
                </button>
                <button
                  type="button"
                  onClick={() => void downloadDocx()}
                  disabled={busy}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                  role="menuitem"
                >
                  <FileDown className="h-4 w-4 shrink-0" aria-hidden />
                  {loading === "docx" ? "Downloading…" : "Download Word"}
                </button>
              </>
            ) : (
              <>
                <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                  TXT and print are free. Recruiter-ready <strong className="font-medium">PDF</strong> and{" "}
                  <strong className="font-medium">Word</strong> need{" "}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 underline font-medium">
                    Pro or a resume pack
                  </Link>
                  .
                </div>
                <button
                  type="button"
                  onClick={() => void downloadTxt()}
                  disabled={busy}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                  role="menuitem"
                >
                  <FileText className="h-4 w-4 shrink-0" aria-hidden />
                  {loading === "txt" ? "Downloading…" : "Download TXT"}
                </button>
                <button
                  type="button"
                  onClick={() => void printHtml()}
                  disabled={busy}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                  role="menuitem"
                >
                  <Printer className="h-4 w-4 shrink-0" aria-hidden />
                  {loading === "html" ? "Opening…" : "Print / HTML"}
                </button>
                <p className="px-3 pb-1 text-[10px] leading-snug text-slate-500 dark:text-slate-400">
                  Print opens a new tab. If nothing appears, allow pop-ups for this site.
                </p>
                <Link
                  href="/pricing"
                  onClick={() => {
                    trackEvent("upgrade_click", { source: "export_pdf" });
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600"
                  role="menuitem"
                >
                  <Lock className="h-4 w-4 shrink-0" aria-hidden />
                  Download PDF — Pro or pack
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => {
                    trackEvent("upgrade_click", { source: "export_word" });
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600"
                  role="menuitem"
                >
                  <Lock className="h-4 w-4 shrink-0" aria-hidden />
                  Download Word — Pro or pack
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
