// WBS 3.9 – Create new resume and redirect
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewResumePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          router.replace(`/resumes/${data.id}/edit`);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to create resume");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>
        <Link href="/dashboard" className="text-primary-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-slate-600">Creating your resume...</p>
    </div>
  );
}
