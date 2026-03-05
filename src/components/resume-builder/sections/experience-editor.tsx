"use client";

// WBS 3.6, 6.5, 6.8 – Experience editor with AI + graceful degradation fallback
import { useState } from "react";
import type { ExperienceSection, ExperienceEntry } from "@/types/resume";
import { MonthYearPicker } from "../month-year-picker";
import { generateSectionId } from "@/lib/resume-utils";
import { Sparkles } from "lucide-react";
import { useToast } from "@/contexts/toast-context";

const BULLET_TIPS = [
  "Start with an action verb: Led, Built, Reduced, Improved, Launched…",
  "Quantify results: 'Reduced API latency by 35%' beats 'Improved performance'.",
  "Use the STAR format: Situation → Task → Action → Result.",
  "Match keywords from the job description for ATS alignment.",
];

type ExperienceData = { entries: ExperienceEntry[] };

interface Props {
  data: ExperienceSection["data"];
  onChange: (data: ExperienceData) => void;
  resumeId?: string;
}

function normalizeData(data: ExperienceSection["data"]): ExperienceData {
  if ("entries" in data && Array.isArray(data.entries)) return data as ExperienceData;
  const d = data as ExperienceEntry & { bullets: string[] };
  return {
    entries: [
      {
        id: generateSectionId(),
        title: d.title || "",
        company: d.company || "",
        location: d.location,
        startDate: d.startDate || "",
        endDate: d.endDate || "",
        current: !!d.current,
        bullets: d.bullets ?? [""],
      },
    ],
  };
}

export function ExperienceEditor({ data, onChange, resumeId }: Props) {
  const { entries } = normalizeData(data);
  const [improveKey, setImproveKey] = useState<string | null>(null);
  const [suggestOpen, setSuggestOpen] = useState<number | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestJobDesc, setSuggestJobDesc] = useState("");
  const [showBulletTips, setShowBulletTips] = useState(false);
  const { toast } = useToast();

  const updateEntry = (index: number, updates: Partial<ExperienceEntry>) => {
    const next = entries.map((e, i) => (i === index ? { ...e, ...updates } : e));
    onChange({ entries: next });
  };

  const addEntry = () => {
    onChange({
      entries: [
        ...entries,
        {
          id: generateSectionId(),
          title: "",
          company: "",
          startDate: "",
          endDate: "",
          current: false,
          bullets: [""],
        },
      ],
    });
  };

  const removeEntry = (index: number) => {
    if (entries.length <= 1) return;
    onChange({ entries: entries.filter((_, i) => i !== index) });
  };

  async function handleImproveBullet(entryIdx: number, bulletIdx: number) {
    if (!resumeId) return;
    const entry = entries[entryIdx];
    const bullet = entry.bullets[bulletIdx];
    if (!bullet.trim()) return;
    const key = `${entryIdx}-${bulletIdx}`;
    setImproveKey(key);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ai/improve-bullet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet,
          context: entry.title && entry.company ? `${entry.title} at ${entry.company}` : undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.bullet) {
        const next = [...entry.bullets];
        next[bulletIdx] = json.bullet;
        updateEntry(entryIdx, { bullets: next });
      } else if (!res.ok) {
        if (res.status === 429 && json.code === "RATE_LIMITED") {
          toast(json.error ?? "AI limit reached", {
            variant: "error",
            action: { label: "Upgrade to Pro", href: "/pricing" },
          });
        } else if (res.status === 503) {
          setShowBulletTips(true);
          toast("AI unavailable. Manual writing tips shown below.", { variant: "error" });
        } else {
          toast(json.error ?? "Failed to improve. Try again.", {
            variant: "error",
            action: { label: "Retry", onClick: () => handleImproveBullet(entryIdx, bulletIdx) },
          });
        }
      }
    } catch {
      setShowBulletTips(true);
      toast("Something went wrong. Manual tips shown below.", { variant: "error" });
    } finally {
      setImproveKey(null);
    }
  }

  async function handleSuggestBullets(entryIdx: number) {
    if (!resumeId || !suggestJobDesc.trim()) return;
    setSuggestLoading(true);
    const entry = entries[entryIdx];
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ai/suggest-bullets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: suggestJobDesc,
          role: entry.title || undefined,
          company: entry.company || undefined,
          existingBullets: entry.bullets.filter(Boolean),
        }),
      });
      const json = await res.json();
      if (res.ok && json.bullets?.length) {
        const existing = entry.bullets.filter(Boolean);
        const toAdd = json.bullets.slice(0, Math.max(0, 6 - existing.length));
        updateEntry(entryIdx, { bullets: [...existing, ...toAdd].length ? [...existing, ...toAdd] : [...existing, ""] });
        setSuggestOpen(null);
        setSuggestJobDesc("");
      } else if (!res.ok) {
        if (res.status === 429 && json.code === "RATE_LIMITED") {
          toast(json.error ?? "AI limit reached", {
            variant: "error",
            action: { label: "Upgrade to Pro", href: "/pricing" },
          });
        } else {
          toast(json.error ?? "Failed to suggest. Try again.", {
            variant: "error",
            action: { label: "Retry", onClick: () => handleSuggestBullets(entryIdx) },
          });
        }
      }
    } catch {
      toast("Something went wrong. Try again.", {
        variant: "error",
        action: { label: "Retry", onClick: () => handleSuggestBullets(entryIdx) },
      });
    } finally {
      setSuggestLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {entries.map((entry, idx) => (
        <div key={entry.id} className="rounded-lg border border-slate-200 dark:border-slate-600 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500">Job {idx + 1}</span>
            {entries.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry(idx)}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Job title</label>
              <input
                type="text"
                value={entry.title}
                onChange={(e) => updateEntry(idx, { title: e.target.value })}
                placeholder="Software Engineer"
                className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Company</label>
              <input
                type="text"
                value={entry.company}
                onChange={(e) => updateEntry(idx, { company: e.target.value })}
                placeholder="Acme Inc"
                className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Location (optional)</label>
            <input
              type="text"
              value={entry.location ?? ""}
              onChange={(e) => updateEntry(idx, { location: e.target.value || undefined })}
              placeholder="Chennai, India"
              className="mt-0.5 block w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Start date</label>
              <MonthYearPicker
                value={entry.startDate}
                onChange={(v) => updateEntry(idx, { startDate: v })}
                placeholder="Jan 2022"
                className="mt-0.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">End date</label>
              <MonthYearPicker
                value={entry.endDate}
                onChange={(v) => updateEntry(idx, { endDate: v })}
                placeholder="Present"
                disabled={entry.current}
              />
              <label className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={entry.current}
                  onChange={(e) =>
                    updateEntry(idx, {
                      current: e.target.checked,
                      endDate: e.target.checked ? "Present" : entry.endDate,
                    })
                  }
                />
                Current role
              </label>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Key achievements</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulletTips((v) => !v)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  title="Writing tips"
                >
                  Tips
                </button>
                {resumeId && (
                  <button
                    type="button"
                    onClick={() => setSuggestOpen(suggestOpen === idx ? null : idx)}
                    className="text-xs text-primary-600 hover:underline dark:text-primary-400 flex items-center gap-0.5"
                  >
                    <Sparkles className="h-3 w-3" />
                    Suggest bullets
                  </button>
                )}
              </div>
            </div>
            {showBulletTips && idx === 0 && (
              <div className="mb-2 rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-2">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">Bullet writing tips</p>
                <ul className="space-y-0.5">
                  {BULLET_TIPS.map((t, i) => (
                    <li key={i} className="text-xs text-amber-700 dark:text-amber-300">{i + 1}. {t}</li>
                  ))}
                </ul>
                <button type="button" onClick={() => setShowBulletTips(false)} className="mt-1 text-xs text-amber-600 hover:underline">Dismiss</button>
              </div>
            )}
            {suggestOpen === idx && resumeId && (
              <div className="mb-3 p-2 rounded border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
                <textarea
                  value={suggestJobDesc}
                  onChange={(e) => setSuggestJobDesc(e.target.value)}
                  placeholder="Paste job description here..."
                  rows={3}
                  className="w-full rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 mb-2"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSuggestBullets(idx)}
                    disabled={suggestLoading || !suggestJobDesc.trim()}
                    className="text-xs px-2 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    {suggestLoading ? "Suggesting..." : "Generate"}
                  </button>
                  <button type="button" onClick={() => { setSuggestOpen(null); setSuggestJobDesc(""); }} className="text-xs text-slate-500 hover:underline">
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {entry.bullets.map((b, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={b}
                  onChange={(e) => {
                    const next = [...entry.bullets];
                    next[i] = e.target.value;
                    updateEntry(idx, { bullets: next });
                  }}
                  placeholder="Achieved X by doing Y..."
                  className="flex-1 rounded border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <div className="flex items-center gap-0.5">
                  {resumeId && b.trim() && (
                    <button
                      type="button"
                      onClick={() => handleImproveBullet(idx, i)}
                      disabled={improveKey === `${idx}-${i}`}
                      title="Improve with AI"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 p-1 disabled:opacity-50"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => updateEntry(idx, { bullets: entry.bullets.filter((_, j) => j !== i) })}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm p-1"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => updateEntry(idx, { bullets: [...entry.bullets, ""] })}
              className="text-xs text-primary-600 hover:underline dark:text-primary-400"
            >
              + Add bullet
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addEntry}
        className="text-sm text-primary-600 hover:underline dark:text-primary-400"
      >
        + Add another job
      </button>
    </div>
  );
}
