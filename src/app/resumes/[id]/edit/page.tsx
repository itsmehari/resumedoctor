// WBS 3.4–3.10, 5 – Resume builder page with export (supports trial)
"use client";

import { useParams } from "next/navigation";
import { ResumeEditWorkspaceRoot } from "@/components/resume-builder/editor/resume-edit-workspace";

export default function EditResumePage() {
  const params = useParams();
  const id = params.id as string;
  return <ResumeEditWorkspaceRoot resumeId={id} />;
}
