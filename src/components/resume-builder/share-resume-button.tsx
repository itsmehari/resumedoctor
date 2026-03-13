"use client";

// Phase 1.3 – Shareable resume link button
import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/contexts/toast-context";

interface ShareResumeButtonProps {
  resumeId: string;
  disabled?: boolean;
}

export function ShareResumeButton({ resumeId, disabled }: ShareResumeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    setLoading(true);
    setOpen(true);
    setUrl(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/share`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setUrl(data.url);
    } catch {
      toast("Failed to get share link", { variant: "error" });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Link copied to clipboard", { variant: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy", { variant: "error" });
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-3">
            {loading ? (
              <p className="text-sm text-slate-500">Generating link...</p>
            ) : url ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Share link (anyone can view)
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={url}
                    className="flex-1 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-2 py-1.5 text-sm text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
