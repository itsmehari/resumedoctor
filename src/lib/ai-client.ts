// AI client – Groq (primary, free) with multi-model fallback, OpenAI as final fallback.
//
// Why multi-model fallback?
// Groq's free tier enforces TPM (tokens per minute) caps per model. Large requests
// (e.g. parsing a long resume) can blow past a single model's cap and return HTTP 413
// "Request too large". Different Groq models have very different TPM ceilings, so we
// try the highest-capacity model first and fall back through the rest on 413/429.
import OpenAI from "openai";

const GROQ_BASE = "https://api.groq.com/openai/v1";

interface ModelEntry {
  id: string;
  /** Approx. tokens-per-minute on Groq free / on-demand tier. Used to pick a model
   *  whose TPM ceiling fits the request (input + reserved output). */
  tpm: number;
  /** Max context window (input + output) supported by the model. */
  contextWindow: number;
  provider: "groq" | "openai";
}

// Ordered by TPM descending. We try the biggest model first so large resumes succeed
// in one shot. On 413/429 we walk down the list automatically.
const GROQ_MODELS: ModelEntry[] = [
  { id: "meta-llama/llama-4-scout-17b-16e-instruct", tpm: 30000, contextWindow: 131072, provider: "groq" },
  { id: "gemma2-9b-it", tpm: 15000, contextWindow: 8192, provider: "groq" },
  { id: "llama-3.3-70b-versatile", tpm: 12000, contextWindow: 131072, provider: "groq" },
  { id: "openai/gpt-oss-20b", tpm: 8000, contextWindow: 131072, provider: "groq" },
  { id: "llama-3.1-8b-instant", tpm: 6000, contextWindow: 131072, provider: "groq" },
];

const OPENAI_MODELS: ModelEntry[] = [
  { id: "gpt-4o-mini", tpm: 200000, contextWindow: 128000, provider: "openai" },
];

function getGroqClient(): OpenAI | null {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return null;
  return new OpenAI({ apiKey: groqKey, baseURL: GROQ_BASE });
}

function getOpenAIClient(): OpenAI | null {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return null;
  return new OpenAI({ apiKey: openaiKey });
}

export function isAiConfigured(): boolean {
  return !!(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY);
}

/** Rough token estimator: ~4 chars per token (good enough for budgeting). */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

function totalInputTokens(messages: OpenAI.Chat.ChatCompletionMessageParam[]): number {
  let total = 0;
  for (const m of messages) {
    if (typeof m.content === "string") {
      total += estimateTokens(m.content);
    } else if (Array.isArray(m.content)) {
      for (const part of m.content) {
        if (part && typeof part === "object" && "text" in part && typeof (part as { text?: unknown }).text === "string") {
          total += estimateTokens((part as { text: string }).text);
        }
      }
    }
    total += 4;
  }
  return total;
}

/** Largest TPM across configured providers – used by callers to size their inputs. */
export function maxAvailableTpm(): number {
  let best = 0;
  if (getGroqClient()) {
    for (const m of GROQ_MODELS) if (m.tpm > best) best = m.tpm;
  }
  if (getOpenAIClient()) {
    for (const m of OPENAI_MODELS) if (m.tpm > best) best = m.tpm;
  }
  return best || 6000;
}

function isRetriableError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { status?: number; code?: string; message?: string };
  if (e.status === 413 || e.status === 429 || e.status === 500 || e.status === 502 || e.status === 503) return true;
  const msg = typeof e.message === "string" ? e.message : "";
  return /rate.?limit|too large|TPM|tokens?\s*per\s*minute|context.?length|model.?not.?found|model.?decommission|deprecated/i.test(msg);
}

export async function chatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const groqClient = getGroqClient();
  const openaiClient = getOpenAIClient();
  if (!groqClient && !openaiClient) {
    throw new Error("AI not configured. Set GROQ_API_KEY or OPENAI_API_KEY.");
  }

  const requestedOutput = options?.maxTokens ?? 800;
  const inputTokens = totalInputTokens(messages);

  // Build candidate list – models that can fit the full request first, then the rest
  // by descending TPM. Always finish with OpenAI (if configured) as ultimate fallback.
  const candidates: Array<{ entry: ModelEntry; client: OpenAI }> = [];

  if (groqClient) {
    const sorted = [...GROQ_MODELS].sort((a, b) => {
      const totalReq = inputTokens + requestedOutput;
      const aFits = a.tpm >= totalReq ? 0 : 1;
      const bFits = b.tpm >= totalReq ? 0 : 1;
      if (aFits !== bFits) return aFits - bFits;
      return b.tpm - a.tpm;
    });
    for (const m of sorted) candidates.push({ entry: m, client: groqClient });
  }

  if (openaiClient) {
    for (const m of OPENAI_MODELS) candidates.push({ entry: m, client: openaiClient });
  }

  let lastError: unknown = null;
  for (const { entry, client } of candidates) {
    // Reserve at least ~256 tokens of headroom for response formatting / finish reason.
    const tpmHeadroom = 256;
    const tpmBudget = entry.tpm - inputTokens - tpmHeadroom;
    if (tpmBudget < 256) {
      lastError = new Error(`Input ~${inputTokens} tokens exceeds ${entry.id} TPM ${entry.tpm}.`);
      continue;
    }
    const safeOutput = Math.max(256, Math.min(requestedOutput, tpmBudget));
    try {
      const completion = await client.chat.completions.create({
        model: entry.id,
        messages,
        max_tokens: safeOutput,
        ...(typeof options?.temperature === "number" ? { temperature: options.temperature } : {}),
      });
      const content = completion.choices[0]?.message?.content?.trim();
      if (content) return content;
      lastError = new Error(`Empty content from ${entry.id}`);
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (isRetriableError(err)) {
        console.warn(`[ai-client] ${entry.id} unavailable (${msg.slice(0, 160)}). Falling back…`);
        continue;
      }
      // Non-retriable (e.g. auth) – still try next provider; helps when only OpenAI key is wrong.
      console.warn(`[ai-client] ${entry.id} error (${msg.slice(0, 160)}). Trying next model…`);
      continue;
    }
  }

  const tail = lastError instanceof Error ? lastError.message : String(lastError ?? "unknown");
  throw new Error(`AI request failed across all models. Last error: ${tail}`);
}
