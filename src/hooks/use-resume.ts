// WBS 3.4 – Resume fetch + auto-save
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResumeContent } from "@/types/resume";

interface ResumeData {
  id: string;
  title: string;
  templateId: string;
  version: number;
  content: ResumeContent;
}

const DEBOUNCE_MS = 2500;

export function useResume(resumeId: string | null) {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(!!resumeId);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResume = useCallback(async () => {
    if (!resumeId) {
      setResume(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResume(data);
    } catch {
      setResume(null);
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const saveResume = useCallback(
    async (content?: ResumeContent, title?: string, templateId?: string) => {
      if (!resumeId) return;
      setSaving(true);
      setSaveStatus("saving");
      try {
        const payload: Record<string, unknown> = {};
        if (content !== undefined) payload.content = content;
        if (title !== undefined) payload.title = title;
        if (templateId !== undefined) payload.templateId = templateId;
        const res = await fetch(`/api/resumes/${resumeId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to save");
        const data = await res.json();
        setResume(data);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      } finally {
        setSaving(false);
      }
    },
    [resumeId]
  );

  const updateContent = useCallback(
    (content: ResumeContent) => {
      if (!resume) return;
      setResume((prev) => (prev ? { ...prev, content } : null));

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveResume(content, undefined, undefined);
        saveTimeoutRef.current = null;
      }, DEBOUNCE_MS);
    },
    [resume, saveResume]
  );

  const updateTitle = useCallback(
    (title: string) => {
      setResume((prev) => (prev ? { ...prev, title } : null));
      saveResume(resume?.content ?? { sections: [] }, title, undefined);
    },
    [resume?.content, saveResume]
  );

  const updateTemplateId = useCallback(
    (templateId: string) => {
      setResume((prev) => (prev ? { ...prev, templateId } : null));
      saveResume(undefined, undefined, templateId);
    },
    [saveResume]
  );

  return {
    resume,
    loading,
    saving,
    saveStatus,
    updateContent,
    updateTitle,
    updateTemplateId,
    refetch: fetchResume,
  };
}
