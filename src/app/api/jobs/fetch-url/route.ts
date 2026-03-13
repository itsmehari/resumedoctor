// Phase 4 – Fetch job page content from URL (for JD parser)
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  url: z.string().url().max(500),
});

// Simple text extraction from HTML (strip tags)
function extractText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim()
    .slice(0, 15000);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const res = await fetch(parsed.data.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not fetch page (${res.status})` },
        { status: 400 }
      );
    }

    const html = await res.text();
    const text = extractText(html);

    if (text.length < 100) {
      return NextResponse.json(
        { error: "Could not extract enough text. Try pasting the job description instead." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json(
      { error: msg.includes("fetch") ? "Could not fetch URL. Try pasting the job description." : msg },
      { status: 400 }
    );
  }
}
