"use client";

// WBS 6.5, 6.8 – Summary editor with AI improve + graceful degradation fallback
import { useState } from "react";
import type { SummarySection } from "@/types/resume";
import { Sparkles, Lightbulb, X } from "lucide-react";
import { useToast } from "@/contexts/toast-context";

interface Props {
  data: SummarySection["data"];
  onChange: (data: SummarySection["data"]) => void;
  resumeId?: string;
}

const MANUAL_TIPS = [
  "Start with your job title and years of experience (e.g. 'Results-driven Software Engineer with 5+ years...')",
  "Mention 2–3 key technical skills or specialisations relevant to your target role.",
  "Include a quantified achievement: reduced load time by 40%, led a team of 8, grew revenue by ₹2Cr.",
  "End with your career goal or value proposition (e.g. 'Seeking to drive product excellence at a growth-stage startup.').",
  "Keep it under 4 sentences / 80 words for maximum ATS friendliness.",
];

export function SummaryEditor({ data, onChange, resumeId }: Props) {
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
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
        } else if (res.status === 503) {
          setShowTips(true);
          toast("AI is unavailable right now. Here are manual tips to help.", { variant: "error" });
        } else {
          toast(json.error ?? "Failed to improve. Try again.", {
            variant: "error",
            action: { label: "Retry", onClick: () => handleImprove() },
          });
        }
        return;
      }
      if (json.text) onChange({ ...data, text: json.text });
    } catch {
      setShowTips(true);
      toast("Something went wrong. Manual tips shown below.", { variant: "error" });
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTips((v) => !v)}
            title="Writing tips"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Tips
          </button>
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
      </div>

      {showTips && (
        <div className="mt-2 mb-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" /> Writing tips for a strong summary
            </p>
            <button type="button" onClick={() => setShowTips(false)} className="text-amber-600 hover:text-amber-800 dark:text-amber-400">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="space-y-1">
            {MANUAL_TIPS.map((tip, i) => (
              <li key={i} className="text-xs text-amber-700 dark:text-amber-300 flex gap-1.5">
                <span className="shrink-0 font-bold">{i + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

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
