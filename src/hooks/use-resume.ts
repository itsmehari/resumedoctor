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
  importSource?: string | null;
}

const DEBOUNCE_MS = 2500;

export function useResume(resumeId: string | null) {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(!!resumeId);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingContentRef = useRef<ResumeContent | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

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
        setLastSavedAt(new Date());
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      } finally {
        setSaving(false);
      }
    },
    [resumeId]
  );

  const flushPendingContent = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    const pending = pendingContentRef.current;
    if (pending) {
      pendingContentRef.current = null;
      void saveResume(pending, undefined, undefined);
    }
  }, [saveResume]);

  const updateContent = useCallback(
    (content: ResumeContent) => {
      if (!resume) return;
      setResume((prev) => (prev ? { ...prev, content } : null));
      pendingContentRef.current = content;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        pendingContentRef.current = null;
        saveResume(content, undefined, undefined);
        saveTimeoutRef.current = null;
      }, DEBOUNCE_MS);
    },
    [resume, saveResume]
  );

  const updateTitle = useCallback(
    (title: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      const contentForSave = pendingContentRef.current ?? resume?.content ?? { sections: [] };
      pendingContentRef.current = null;
      setResume((prev) => (prev ? { ...prev, title } : null));
      void saveResume(contentForSave, title, undefined);
    },
    [resume?.content, saveResume]
  );

  const updateTemplateId = useCallback(
    (templateId: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      const contentForSave = pendingContentRef.current ?? resume?.content ?? { sections: [] };
      pendingContentRef.current = null;
      setResume((prev) => (prev ? { ...prev, templateId } : null));
      void saveResume(contentForSave, undefined, templateId);
    },
    [resume?.content, saveResume]
  );

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") flushPendingContent();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      flushPendingContent();
    };
  }, [flushPendingContent]);

  const flushSave = useCallback(() => {
    flushPendingContent();
  }, [flushPendingContent]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!pendingContentRef.current) return;
      flushPendingContent();
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [flushPendingContent]);

  const retrySave = useCallback(() => {
    if (!resume || !resumeId) return;
    void saveResume(resume.content, resume.title, resume.templateId);
  }, [resume, resumeId, saveResume]);

  return {
    resume,
    loading,
    saving,
    saveStatus,
    updateContent,
    updateTitle,
    updateTemplateId,
    refetch: fetchResume,
    retrySave,
    flushSave,
    lastSavedAt,
  };
}
