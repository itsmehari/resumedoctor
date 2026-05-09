// Phase 2 — Dynamic Open Graph image for /r/[slug].
// Renders a 1200x630 preview card used by WhatsApp, LinkedIn, iMessage,
// Slack, Twitter, Facebook etc. Mirrors the dark indigo / cyan aesthetic
// of the homepage "Your resume, as a link" section so the brand stays
// consistent at every touchpoint.
import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import type { ResumeSection } from "@/types/resume";

// Prisma needs the Node.js runtime; keep this explicit so future
// Next defaults don't accidentally flip us to Edge.
export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "ResumeDoctor — shared resume link preview";

interface ResumeContent {
  sections?: ResumeSection[];
  meta?: Record<string, unknown>;
}

interface ResumeMeta {
  name: string;
  headline: string | null;
  location: string | null;
}

async function getResumeMeta(slug: string): Promise<ResumeMeta> {
  const fallback: ResumeMeta = {
    name: "Your Resume",
    headline: null,
    location: null,
  };
  const trimmed = slug?.trim();
  if (!trimmed) return fallback;
  try {
    const resume = await prisma.resume.findUnique({
      where: { publicSlug: trimmed },
      select: { content: true, title: true },
    });
    if (!resume) return fallback;
    const sections = (resume.content as ResumeContent | null)?.sections ?? [];
    const contact = sections.find((s) => s.type === "contact");
    if (contact && contact.type === "contact") {
      return {
        name: contact.data.name?.trim() || resume.title || "Your Resume",
        headline: contact.data.title?.trim() || null,
        location: contact.data.location?.trim() || null,
      };
    }
    return { ...fallback, name: resume.title?.trim() || fallback.name };
  } catch {
    return fallback;
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

export default async function OpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const { name, headline, location } = await getResumeMeta(params.slug);
  const safeName = truncate(name, 36);
  const safeHeadline = headline ? truncate(headline, 60) : null;
  const safeLocation = location ? truncate(location, 32) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "70px 80px",
          background:
            "linear-gradient(135deg, #020617 0%, #1e1b4b 45%, #082f49 100%)",
          position: "relative",
        }}
      >
        {/* Faint grid texture (CSS — Satori supports linear-gradient) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Cyan corner glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -160,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.45) 0%, rgba(6,182,212,0) 65%)",
            display: "flex",
          }}
        />
        {/* Indigo corner glow */}
        <div
          style={{
            position: "absolute",
            bottom: -180,
            right: -180,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(129,140,248,0.4) 0%, rgba(129,140,248,0) 65%)",
            display: "flex",
          }}
        />

        {/* Top brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #06b6d4 0%, #818cf8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 24,
              fontWeight: 800,
              boxShadow: "0 8px 24px rgba(6, 182, 212, 0.35)",
            }}
          >
            RD
          </div>
          <div
            style={{
              color: "#e0f2fe",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
              display: "flex",
            }}
          >
            RESUMEDOCTOR
          </div>
          <div style={{ flex: 1, display: "flex" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.45)",
              color: "#86efac",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
                display: "flex",
              }}
            />
            LIVE
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Eyebrow */}
        <div
          style={{
            color: "#67e8f9",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
            marginBottom: 18,
            display: "flex",
          }}
        >
          RESUME LINK
        </div>

        {/* Name */}
        <div
          style={{
            color: "white",
            fontSize: 88,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -2,
            display: "flex",
            maxWidth: 1040,
          }}
        >
          {safeName}
        </div>

        {/* Headline / location */}
        {(safeHeadline || safeLocation) && (
          <div
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 36,
              fontWeight: 500,
              marginTop: 18,
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              maxWidth: 1040,
            }}
          >
            {safeHeadline && <span style={{ display: "flex" }}>{safeHeadline}</span>}
            {safeHeadline && safeLocation && (
              <span style={{ color: "rgba(255,255,255,0.45)", display: "flex" }}>
                ·
              </span>
            )}
            {safeLocation && (
              <span
                style={{ color: "rgba(255,255,255,0.65)", display: "flex" }}
              >
                {safeLocation}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Bottom URL pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 24px",
              borderRadius: 14,
              background: "rgba(6, 182, 212, 0.12)",
              border: "1px solid rgba(6, 182, 212, 0.35)",
              color: "#67e8f9",
              fontSize: 26,
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            resumedoctor.in/r/{truncate(params.slug, 26)}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 1,
              display: "flex",
            }}
          >
            Always up to date
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
