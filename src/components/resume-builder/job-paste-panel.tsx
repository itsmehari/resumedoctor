"use client";

// Phase 1.2 – Paste job description → keyword match + AI tailor
import { useEffect, useState } from "react";
import { Briefcase, Sparkles, Loader2, Check, Plus, Target } from "lucide-react";
import type { ResumeSection } from "@/types/resume";
import { useToast } from "@/contexts/toast-context";

interface JobMatchResult {
  score: number;
  matchedTerms: string[];
  missingTerms: string[];
  termCount: number;
}

interface TailorResult {
  keywords: string[];
  summarySuggestion?: string;
  skillsToAdd: string[];
  bulletSuggestions: Array<{
    sectionId: string;
    entryIndex: number;
    bulletIndex: number;
    current: string;
    suggested: string;
    reason?: string;
  }>;
}

interface JobPastePanelProps {
  resumeId: string;
  sections: ResumeSection[];
  onSectionsChange: (sections: ResumeSection[]) => void;
}

function genId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `s-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function JobPastePanel({
  resumeId,
  sections,
  onSectionsChange,
}: JobPastePanelProps) {
  const [jobDesc, setJobDesc] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [result, setResult] = useState<TailorResult | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    setMatchResult(null);
  }, [jobDesc]);

  const handleFetchUrl = async () => {
    if (!jobUrl.trim()) return;
    setUrlLoading(true);
    try {
      const res = await fetch("/api/jobs/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrl.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.text) {
        setJobDesc((prev) => (prev ? `${prev}\n\n${data.text}` : data.text));
        setJobUrl("");
      } else {
        toast(data.error || "Could not fetch. Paste the description instead.", { variant: "error" });
      }
    } catch {
      toast("Could not fetch URL. Paste the description instead.", { variant: "error" });
    } finally {
      setUrlLoading(false);
    }
  };

  const handleKeywordMatch = async () => {
    if (!jobDesc.trim() || jobDesc.trim().length < 50) {
      toast("Job description should be at least 50 characters", { variant: "error" });
      return;
    }
    setMatchLoading(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/job-match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobDesc.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Match failed");
      setMatchResult(data as JobMatchResult);
      setExpanded(true);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong", { variant: "error" });
    } finally {
      setMatchLoading(false);
    }
  };

  const handleTailor = async () => {
    if (!jobDesc.trim() || jobDesc.trim().length < 50) {
      toast("Job description should be at least 50 characters", { variant: "error" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ai/tailor-for-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobDesc.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tailor failed");
      setResult(data);
      setExpanded(true);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const applyKeywords = () => {
    if (!result?.keywords?.length) return;
    const skillsSection = sections.find((s) => s.type === "skills");
    const existing =
      skillsSection && "items" in skillsSection.data
        ? (skillsSection.data.items ?? []).filter(Boolean)
        : [];
    const newItems = Array.from(new Set([...existing, ...result.keywords]));
    if (skillsSection) {
      const next = sections.map((s) =>
        s.id === skillsSection.id
          ? { ...s, data: { ...(s.data as { items?: string[] }), items: newItems } }
          : s
      ) as ResumeSection[];
      onSectionsChange(next);
    } else {
      const newSection: ResumeSection = {
        id: genId(),
        type: "skills",
        order: sections.length,
        data: { items: newItems },
      };
      onSectionsChange([...sections, newSection]);
    }
    setApplied((prev) => new Set(Array.from(prev).concat("keywords")));
    toast("Keywords added to skills", { variant: "success" });
  };

  const applySkills = () => {
    if (!result?.skillsToAdd?.length) return;
    const skillsSection = sections.find((s) => s.type === "skills");
    const existing =
      skillsSection && "items" in skillsSection.data
        ? (skillsSection.data.items ?? []).filter(Boolean)
        : [];
    const newItems = Array.from(new Set([...existing, ...result.skillsToAdd]));
    if (skillsSection) {
      const next = sections.map((s) =>
        s.id === skillsSection.id
          ? { ...s, data: { ...(s.data as { items?: string[] }), items: newItems } }
          : s
      ) as ResumeSection[];
      onSectionsChange(next);
    } else {
      const newSection: ResumeSection = {
        id: genId(),
        type: "skills",
        order: sections.length,
        data: { items: newItems },
      };
      onSectionsChange([...sections, newSection]);
    }
    setApplied((prev) => new Set(Array.from(prev).concat("skills")));
    toast("Skills added", { variant: "success" });
  };

  const applySummary = () => {
    if (!result?.summarySuggestion) return;
    const summarySection = sections.find((s) => s.type === "summary");
    if (summarySection) {
      const next = sections.map((s) =>
        s.id === summarySection.id
          ? { ...s, data: { ...(s.data as { text?: string }), text: result.summarySuggestion } }
          : s
      ) as ResumeSection[];
      onSectionsChange(next);
      setApplied((prev) => new Set(Array.from(prev).concat("summary")));
      toast("Summary updated", { variant: "success" });
    } else {
      const newSection: ResumeSection = {
        id: genId(),
        type: "summary",
        order: sections.length,
        data: { text: result.summarySuggestion },
      };
      onSectionsChange([...sections, newSection]);
      setApplied((prev) => new Set(Array.from(prev).concat("summary")));
      toast("Summary added", { variant: "success" });
    }
  };

  const applyBullet = (s: TailorResult["bulletSuggestions"][number]) => {
    if (!result) return;
    const expSection =
      sections.find((sec) => sec.type === "experience" && sec.id === s.sectionId) ??
      sections.find((sec) => sec.type === "experience");
    if (!expSection || expSection.type !== "experience") return;
    const entries = "entries" in expSection.data ? expSection.data.entries : [expSection.data];
    const entry = entries[s.entryIndex];
    if (!entry || !("bullets" in entry)) return;
    const bullets = [...(entry.bullets ?? [])];
    bullets[s.bulletIndex] = s.suggested;
    const newEntries = entries.map((e, i) =>
      i === s.entryIndex ? { ...e, bullets } : e
    );
    const next = sections.map((sec) =>
      sec.id === expSection.id
        ? { ...sec, data: { ...sec.data, entries: newEntries } }
        : sec
    ) as ResumeSection[];
    onSectionsChange(next);
    setApplied((prev) => new Set(Array.from(prev).concat(`bullet-${s.sectionId}-${s.entryIndex}-${s.bulletIndex}`)));
    toast("Bullet updated", { variant: "success" });
  };

  const applyAll = () => {
    if (!result) return;
    let next = [...sections];
    const appliedKeys = new Set<string>();

    if (result.summarySuggestion && !applied.has("summary")) {
      const summarySection = next.find((s) => s.type === "summary");
      if (summarySection) {
        next = next.map((s) =>
          s.id === summarySection.id
            ? { ...s, data: { ...(s.data as { text?: string }), text: result.summarySuggestion } }
            : s
        ) as ResumeSection[];
      } else {
        next = [...next, {
          id: genId(),
          type: "summary" as const,
          order: next.length,
          data: { text: result.summarySuggestion! },
        }];
      }
      appliedKeys.add("summary");
    }

    if ((result.keywords?.length || result.skillsToAdd?.length) && (!applied.has("keywords") || !applied.has("skills"))) {
      const skillsSection = next.find((s) => s.type === "skills");
      const existing = skillsSection && "items" in skillsSection.data
        ? (skillsSection.data.items ?? []).filter(Boolean) as string[]
        : [];
      const toAdd = Array.from(new Set([...(result.keywords ?? []), ...(result.skillsToAdd ?? [])]));
      const newItems = Array.from(new Set([...existing, ...toAdd]));
      if (skillsSection) {
        next = next.map((s) =>
          s.id === skillsSection.id ? { ...s, data: { ...(s.data as { items?: string[] }), items: newItems } } : s
        ) as ResumeSection[];
      } else {
        next = [...next, { id: genId(), type: "skills" as const, order: next.length, data: { items: newItems } }];
      }
      appliedKeys.add("keywords");
      appliedKeys.add("skills");
    }

    if (result.bulletSuggestions?.length) {
      for (const b of result.bulletSuggestions) {
        const expSection = next.find((sec) => sec.type === "experience" && sec.id === b.sectionId) ?? next.find((sec) => sec.type === "experience");
        if (!expSection || expSection.type !== "experience") continue;
        const entries = "entries" in expSection.data ? expSection.data.entries : [expSection.data];
        const entry = entries[b.entryIndex];
        if (!entry || !("bullets" in entry)) continue;
        const bullets = [...(entry.bullets ?? [])];
        bullets[b.bulletIndex] = b.suggested;
        const newEntries = entries.map((e, i) => (i === b.entryIndex ? { ...e, bullets } : e));
        next = next.map((sec) =>
          sec.id === expSection.id ? { ...sec, data: { ...sec.data, entries: newEntries } } : sec
        ) as ResumeSection[];
        appliedKeys.add(`bullet-${b.sectionId}-${b.entryIndex}-${b.bulletIndex}`);
      }
    }

    onSectionsChange(next);
    setApplied((prev) => new Set([...Array.from(prev), ...Array.from(appliedKeys)]));
    toast("All suggestions applied", { variant: "success" });
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary-600" />
          <span className="font-medium text-slate-900 dark:text-slate-100">
            Tailor for job
          </span>
        </div>
        <span className="text-slate-400 text-sm">
          {expanded ? "▼" : "▶"}
        </span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Paste a job description. Run a fast keyword match (no AI), then use AI tailoring for deeper edits.
          </p>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="Or paste job URL (Naukri, Indeed, etc.)"
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
            <button
              type="button"
              onClick={handleFetchUrl}
              disabled={urlLoading || !jobUrl.trim()}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              {urlLoading ? "Fetching…" : "Fetch"}
            </button>
          </div>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={4}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleKeywordMatch}
              disabled={matchLoading || jobDesc.trim().length < 50}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {matchLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking…
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 text-primary-600" />
                  Check keyword match
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleTailor}
              disabled={loading || jobDesc.trim().length < 50}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Tailor with AI
                </>
              )}
            </button>
          </div>
          {matchResult && matchResult.termCount > 0 && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Keyword overlap with this resume
                </p>
                <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  {matchResult.score}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${matchResult.score}%` }}
                  role="progressbar"
                  aria-valuenow={matchResult.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Keyword match score"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Based on {matchResult.termCount} salient terms from the job description (deterministic; not AI).
              </p>
              {matchResult.matchedTerms.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                    In your resume
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {matchResult.matchedTerms.slice(0, 16).map((t) => (
                      <span
                        key={t}
                        className="rounded px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {matchResult.missingTerms.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">
                    Not found (consider adding)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {matchResult.missingTerms.slice(0, 16).map((t) => (
                      <span
                        key={t}
                        className="rounded px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/35 text-amber-950 dark:text-amber-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {matchResult && matchResult.termCount === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No distinctive keywords extracted from this posting (mostly generic wording). Try pasting more of the requirements or tech stack.
            </p>
          )}
          {result && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Apply suggestions one-by-one below, or apply all at once.
                </p>
                <button
                  type="button"
                  onClick={applyAll}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                >
                  <Check className="h-3.5 w-3.5" />
                  Apply all
                </button>
              </div>
              {result.keywords?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Keywords to add
                  </p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {result.keywords.slice(0, 10).map((k) => (
                      <span
                        key={k}
                        className="rounded px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                  {!applied.has("keywords") && (
                    <button
                      type="button"
                      onClick={applyKeywords}
                      className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add to skills
                    </button>
                  )}
                  {applied.has("keywords") && (
                    <span className="text-xs text-green-600 dark:text-green-400 inline-flex items-center gap-1">
                      <Check className="h-3 w-3" /> Applied
                    </span>
                  )}
                </div>
              )}
              {result.skillsToAdd?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Skills to add
                  </p>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {result.skillsToAdd.slice(0, 8).map((s) => (
                      <span
                        key={s}
                        className="rounded px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  {!applied.has("skills") && (
                    <button
                      type="button"
                      onClick={applySkills}
                      className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add to skills
                    </button>
                  )}
                  {applied.has("skills") && (
                    <span className="text-xs text-green-600 dark:text-green-400 inline-flex items-center gap-1">
                      <Check className="h-3 w-3" /> Applied
                    </span>
                  )}
                </div>
              )}
              {result.summarySuggestion && (
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Summary suggestion
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                    {result.summarySuggestion}
                  </p>
                  {!applied.has("summary") && (
                    <button
                      type="button"
                      onClick={applySummary}
                      className="text-xs text-primary-600 hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Apply summary
                    </button>
                  )}
                  {applied.has("summary") && (
                    <span className="text-xs text-green-600 dark:text-green-400 mt-1 inline-flex items-center gap-1">
                      <Check className="h-3 w-3" /> Applied
                    </span>
                  )}
                </div>
              )}
              {result.bulletSuggestions?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                    Bullet improvements
                  </p>
                  <div className="space-y-2">
                    {result.bulletSuggestions.slice(0, 4).map((b, i) => {
                      const key = `bullet-${b.sectionId}-${b.entryIndex}-${b.bulletIndex}`;
                      const done = applied.has(key);
                      return (
                        <div key={i} className="rounded border border-slate-200 dark:border-slate-600 p-2 text-xs">
                          <p className="text-slate-500 line-through">{b.current}</p>
                          <p className="text-slate-800 dark:text-slate-200 mt-1">
                            {b.suggested}
                          </p>
                          {!done ? (
                            <button
                              type="button"
                              onClick={() => applyBullet(b)}
                              className="text-primary-600 hover:underline mt-1"
                            >
                              Apply
                            </button>
                          ) : (
                            <span className="text-green-600 mt-1 inline-flex items-center gap-1">
                              <Check className="h-3 w-3" /> Applied
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
