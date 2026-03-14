"use client";

// Phase 1.1 – Resume import with AI template suggestions
import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2, Check } from "lucide-react";
import { ResumePreview } from "@/components/resume-builder/resume-preview";
import type { ResumeSection } from "@/types/resume";

interface SuggestedTemplate {
  id: string;
  name: string;
  reason: string;
}

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
  const [step, setStep] = useState<"upload" | "choose">("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsed, setParsed] = useState<{ sections: ResumeSection[]; title: string } | null>(null);
  const [suggestedTemplates, setSuggestedTemplates] = useState<SuggestedTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
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

  const handleParse = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/resumes/import/parse", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setParsed({
        sections: data.parsed?.sections ?? [],
        title: (data.title ?? file.name.replace(/\.[^/.]+$/, "")) || "Imported Resume",
      });
      const templates = data.suggestedTemplates ?? [];
      setSuggestedTemplates(templates);
      setSelectedTemplateId(templates[0]?.id ?? null);
      setStep("choose");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!parsed || !selectedTemplateId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/resumes/import/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          parsed: { sections: parsed.sections },
          templateId: selectedTemplateId,
          title: parsed.title,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      onSuccess(data.id);
      onClose();
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setStep("upload");
    setParsed(null);
    setSuggestedTemplates([]);
    setSelectedTemplateId(null);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="import-modal-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {step === "upload" ? "Import Resume" : "Choose Template"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {step === "upload" ? (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload a PDF or DOCX resume. We&apos;ll extract the content, suggest 2 best templates, and let you preview before editing.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tip: Export your LinkedIn profile as PDF and import it here.
              </p>
              <div
                className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  dragOver
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
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
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[220px]">{file.name}</p>
                      <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button type="button" onClick={() => handleFile(null)} className="text-sm text-slate-500 hover:text-slate-700">Remove</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex flex-col items-center gap-2 w-full"
                  >
                    <Upload className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Click or drag file here</span>
                    <span className="text-xs text-slate-500">PDF or DOCX, max 10MB</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                AI suggested these 10 templates for your profile. Pick one to preview and create your resume.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {suggestedTemplates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`text-left rounded-lg border-2 p-3 transition-colors ${
                      selectedTemplateId === t.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{t.name}</span>
                      {selectedTemplateId === t.id && <Check className="h-5 w-5 text-primary-600" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t.reason}</p>
                    <div className="h-32 overflow-hidden rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <div style={{ transform: "scale(0.35)", transformOrigin: "top left", width: "286%", height: "286%" }}>
                        <ResumePreview sections={parsed?.sections ?? []} templateId={t.id} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        <div className="flex justify-between gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
          <div>
            {step === "choose" && (
              <button
                onClick={() => setStep("upload")}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            {step === "upload" ? (
              <button
                onClick={handleParse}
                disabled={!file || loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  "Next: Choose Template"
                )}
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={!selectedTemplateId || loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Import & Edit"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
