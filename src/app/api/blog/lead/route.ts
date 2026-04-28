import { NextResponse } from "next/server";

const DOWNLOAD = "/downloads/resume-checklist.txt";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const body = json as { email?: string };
  const raw = typeof body.email === "string" ? body.email.trim() : "";
  if (raw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (process.env.NODE_ENV === "development" && raw) {
    // eslint-disable-next-line no-console
    console.log("[blog/lead] email (optional):", raw);
  }
  return NextResponse.json({ ok: true, downloadUrl: DOWNLOAD });
}
