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
      const res = await fetch(`/api/resumes/${resumeId}`);
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
    async (content: ResumeContent, title?: string) => {
      if (!resumeId) return;
      setSaving(true);
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/resumes/${resumeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, ...(title !== undefined && { title }) }),
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
        saveResume(content);
        saveTimeoutRef.current = null;
      }, DEBOUNCE_MS);
    },
    [resume, saveResume]
  );

  const updateTitle = useCallback(
    (title: string) => {
      setResume((prev) => (prev ? { ...prev, title } : null));
      saveResume(resume?.content ?? { sections: [] }, title);
    },
    [resume?.content, saveResume]
  );

  return {
    resume,
    loading,
    saving,
    saveStatus,
    updateContent,
    updateTitle,
    refetch: fetchResume,
  };
}
