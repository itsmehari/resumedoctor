"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

function NewCoverLetterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/cover-letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(resumeId ? { resumeId } : {}),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.id) {
          trackEvent("cover_letter_created");
          router.replace(`/cover-letters/${data.id}/edit`);
        } else if (!cancelled) {
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [router, resumeId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-slate-500">{loading ? "Creating..." : "Failed to create"}</p>
      {!loading && (
        <Link href="/cover-letters" className="mt-4 text-primary-600 hover:underline">
          Back to cover letters
        </Link>
      )}
    </div>
  );
}

export default function NewCoverLetterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    }>
      <NewCoverLetterContent />
    </Suspense>
  );
}
