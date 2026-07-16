import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import type { CapabilityName } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";

const promptCache = new Map<string, string>();

function loadPrompt(name: CapabilityName): string {
  if (promptCache.has(name)) return promptCache.get(name)!;
  const filePath = path.join(process.cwd(), "prompts", `${name}.md`);
  const content = fs.readFileSync(filePath, "utf-8");
  promptCache.set(name, content);
  return content;
}

/**
 * Runs one internal capability against a Claude model. The `capability`
 * selects the system prompt; the user never sees this — it is always
 * presented as "the AI" thinking, not a named agent.
 */
export async function runCapability(
  capability: CapabilityName,
  userContent: string,
  opts: { maxTokens?: number; temperature?: number } = {},
): Promise<string> {
  const system = loadPrompt(capability);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.4,
    system,
    messages: [{ role: "user", content: userContent }],
  });

  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error(`Capability "${capability}" returned no text content`);
  }
  return block.text;
}

/** Runs a capability and parses its response as JSON (stripping code fences). */
export async function runCapabilityJSON<T>(
  capability: CapabilityName,
  userContent: string,
  opts?: { maxTokens?: number; temperature?: number },
): Promise<T> {
  const raw = await runCapability(capability, userContent, opts);
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");
  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    throw new Error(
      `Capability "${capability}" returned invalid JSON: ${(err as Error).message}\n${raw}`,
    );
  }
}

export { MODEL as ANTHROPIC_MODEL };
