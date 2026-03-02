// AI client – Groq (primary, free) or OpenAI (fallback)
// Uses OpenAI-compatible API; Groq supports it via baseURL
import OpenAI from "openai";

const GROQ_BASE = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.1-8b-instant";

function getClient(): OpenAI | null {
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    return new OpenAI({
      apiKey: groqKey,
      baseURL: GROQ_BASE,
    });
  }
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return new OpenAI({ apiKey: openaiKey });
  }
  return null;
}

export function isAiConfigured(): boolean {
  return !!(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY);
}

export async function chatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options?: { maxTokens?: number }
): Promise<string> {
  const client = getClient();
  if (!client) {
    throw new Error("AI not configured. Set GROQ_API_KEY or OPENAI_API_KEY.");
  }

  const model = process.env.GROQ_API_KEY ? GROQ_MODEL : "gpt-4o-mini";
  const completion = await client.chat.completions.create({
    model,
    messages,
    max_tokens: options?.maxTokens ?? 800,
  });

  const content = completion.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("No content generated");
  }
  return content;
}
