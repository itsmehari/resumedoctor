"use client";

// Phase 1.1 – Resume import modal (PDF/DOCX)
import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";

interface ResumeImportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (resumeId: string) => void;
}

export function ResumeImportModal({
  open,
  onClose,
  onSuccess,
}: ResumeImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accepted = ".pdf,.doc,.docx";
  const acceptList = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFile = (f: File | null) => {
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum 10MB.");
      setFile(null);
      return;
    }
    if (!acceptList.includes(f.type)) {
      setError("Please upload a PDF or DOCX file.");
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name.replace(/\.[^/.]+$/, "") || "Imported Resume");

      const res = await fetch("/api/resumes/import", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Import failed");
      }
      onSuccess(data.id);
      onClose();
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="import-modal-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Import Resume
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Upload a PDF or DOCX resume. We&apos;ll extract the content and create an editable resume.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tip: Export your LinkedIn profile as PDF (Settings → Data &amp; privacy → Get a copy of your data) and import it here.
          </p>
          <div
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragOver
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accepted}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-10 w-10 text-primary-600" />
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[220px]">
                    {file.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFile(null)}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center gap-2 w-full"
              >
                <Upload className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Click or drag file here
                </span>
                <span className="text-xs text-slate-500">
                  PDF or DOCX, max 10MB
                </span>
              </button>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing…
              </>
            ) : (
              "Import & Edit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
