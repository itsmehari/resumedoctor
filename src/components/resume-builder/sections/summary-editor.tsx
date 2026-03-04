"use client";

// WBS 6.5, 6.8 – Summary editor with AI improve + error handling
import { useState } from "react";
import type { SummarySection } from "@/types/resume";
import { Sparkles } from "lucide-react";
import { useToast } from "@/contexts/toast-context";

interface Props {
  data: SummarySection["data"];
  onChange: (data: SummarySection["data"]) => void;
  resumeId?: string;
}

export function SummaryEditor({ data, onChange, resumeId }: Props) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleImprove() {
    if (!resumeId || !data.text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ai/improve-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.text }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 429 && json.code === "RATE_LIMITED") {
          toast(json.error ?? "AI limit reached", {
            variant: "error",
            action: { label: "Upgrade to Pro", href: "/pricing" },
          });
        } else {
          toast(json.error ?? "Failed to improve. Try again.", {
            variant: "error",
            action: {
              label: "Retry",
              onClick: () => handleImprove(),
            },
          });
        }
        return;
      }
      if (json.text) onChange({ ...data, text: json.text });
    } catch {
      toast("Something went wrong. Try again.", {
        variant: "error",
        action: { label: "Retry", onClick: () => handleImprove() },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Professional Summary
        </label>
        {resumeId && data.text.trim() && (
          <button
            type="button"
            onClick={handleImprove}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {loading ? "Improving..." : "Improve with AI"}
          </button>
        )}
      </div>
      <textarea
        value={data.text}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        rows={4}
        placeholder="A brief summary of your experience and goals..."
        className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    </div>
  );
}
