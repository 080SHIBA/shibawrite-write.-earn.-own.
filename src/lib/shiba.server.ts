import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { REWARD_CONFIG, categoryMultiplier, tierFor } from "@/lib/contracts";

export function admin() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export type Writer = Database["public"]["Tables"]["writers"]["Row"];

export function randomToken() {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
}

export function siweMessage(address: string, nonce: string) {
  return [
    "ShibaWrite wants you to sign in with your Ethereum account:",
    address,
    "",
    "Sign in to ShibaWrite. This is a gasless signature — it never moves funds.",
    "",
    "Chain: Ethereum Sepolia (11155111)",
    `Nonce: ${nonce}`,
  ].join("\n");
}

export async function writerFromToken(token: string): Promise<Writer> {
  const db = admin();
  const { data: session } = await db
    .from("wallet_sessions")
    .select("writer_id, expires_at")
    .eq("token", token)
    .maybeSingle();
  if (!session || new Date(session.expires_at) < new Date()) {
    throw new Error("Your session expired — please reconnect your wallet.");
  }
  const { data: writer } = await db
    .from("writers")
    .select("*")
    .eq("id", session.writer_id)
    .maybeSingle();
  if (!writer) throw new Error("Writer account not found.");
  return writer;
}

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/* ------------------------------ oracle layer ------------------------------ */

export type ScoreResult = {
  originality: number;
  quality: number;
  authenticity: number;
  feedback: string;
};

/** Winston AI plagiarism + AI-detection pass. Degrades gracefully if unavailable. */
async function winstonScores(text: string): Promise<{ originality: number; authenticity: number } | null> {
  const key = process.env["WINSTON_AI_API_KEY"];
  if (!key) return null;
  try {
    const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
    const [plagRes, aiRes] = await Promise.all([
      fetch("https://api.gowinston.ai/v2/plagiarism", {
        method: "POST",
        headers,
        body: JSON.stringify({ text, language: "en", country: "us" }),
      }),
      fetch("https://api.gowinston.ai/v2/ai-content-detection", {
        method: "POST",
        headers,
        body: JSON.stringify({ text, language: "en", sentences: false }),
      }),
    ]);
    const plag = plagRes.ok ? ((await plagRes.json()) as Record<string, unknown>) : {};
    const ai = aiRes.ok ? ((await aiRes.json()) as Record<string, unknown>) : {};
    const plagPercent = Number(
      (plag["result"] as { score?: number } | undefined)?.score ?? plag["score"] ?? 0,
    );
    // Winston returns a human-likeness score 0-100 for AI detection.
    const humanScore = Number(ai["score"] ?? 100);
    return {
      originality: Math.max(0, Math.min(100, 100 - plagPercent)),
      authenticity: Math.max(0, Math.min(100, humanScore)),
    };
  } catch (error) {
    console.error("winston oracle failed", error);
    return null;
  }
}

/** Gemini quality grading through the Lovable AI gateway. */
async function geminiQuality(
  title: string,
  category: string,
  text: string,
): Promise<{ quality: number; feedback: string } | null> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return null;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You grade written content for a content-to-earn platform. Return strict JSON: {\"quality\": number 0-100, \"feedback\": string under 400 chars}. Grade depth, structure, factual care, readability and originality of thought. Be strict: filler, keyword stuffing and generic listicles score under 50.",
          },
          {
            role: "user",
            content: `Category: ${category}\nTitle: ${title}\n\n${text.slice(0, 20000)}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      console.error("gemini quality failed", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as { quality?: number; feedback?: string };
    return {
      quality: Math.max(0, Math.min(100, Number(parsed.quality ?? 60))),
      feedback: String(parsed.feedback ?? "No feedback returned."),
    };
  } catch (error) {
    console.error("gemini oracle failed", error);
    return null;
  }
}

export async function scoreContent(
  title: string,
  category: string,
  text: string,
): Promise<ScoreResult> {
  const [winston, gemini] = await Promise.all([
    winstonScores(text),
    geminiQuality(title, category, text),
  ]);
  return {
    originality: winston?.originality ?? 85,
    authenticity: winston?.authenticity ?? 85,
    quality: gemini?.quality ?? 70,
    feedback:
      gemini?.feedback ??
      "Scored with fallback heuristics — the quality oracle was unreachable for this submission.",
  };
}

/** 0.5x – 2.0x multiplier derived from the blended oracle score. */
export function qualityMultiplier(s: ScoreResult) {
  const blended = s.quality * 0.6 + s.originality * 0.25 + s.authenticity * 0.15;
  return Math.round((0.5 + (blended / 100) * 1.5) * 100) / 100;
}

export function rewardFor(words: number, category: string, multiplier: number) {
  const raw = words * REWARD_CONFIG.baseRate * categoryMultiplier(category) * multiplier;
  return Math.round(Math.min(raw, REWARD_CONFIG.dailyCapWord) * 100) / 100;
}

export async function refreshTier(writerId: string) {
  const db = admin();
  const { count } = await db
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("writer_id", writerId)
    .in("status", ["approved", "claimed"]);
  const approved = count ?? 0;
  await db
    .from("writers")
    .update({ approved_posts: approved, tier: tierFor(approved) })
    .eq("id", writerId);
  return approved;
}
