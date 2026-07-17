import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import { getWorkspaceContext, serializeContext } from "@/lib/workspace-context";
import { runMarketResearch } from "@/agents/research";
import { runCompetitorAnalysis } from "@/agents/competitors";
import { runCustomerIntelligence } from "@/agents/customer";
import { runMarketingStrategy } from "@/agents/strategy";
import { runContentPlanner } from "@/agents/planner";
import { generateContent } from "@/agents/content";
import type { ContentType } from "@prisma/client";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";
const MANAGER_PROMPT = fs.readFileSync(path.join(process.cwd(), "prompts", "manager.md"), "utf-8");

// The manager delegates to internal capabilities via tool calls. The user
// never sees these names — only the manager's final, unified reply.
const tools: Anthropic.Tool[] = [
  {
    name: "run_market_research",
    description: "Research the industry, customer pain points, trends, and search demand for this business.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "run_competitor_analysis",
    description: "Analyze named competitors' pricing, positioning, and opportunities.",
    input_schema: {
      type: "object",
      properties: { competitorNames: { type: "array", items: { type: "string" } } },
      required: ["competitorNames"],
    },
  },
  {
    name: "run_customer_intelligence",
    description: "Build ideal customer personas for this business.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "run_marketing_strategy",
    description: "Build the overall marketing strategy from research, competitors, and personas already in memory.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "run_content_planner",
    description: "Turn the active marketing strategy into a 30-day content calendar and today's task list.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "generate_content",
    description: "Write one piece of marketing content (blog post, ad, email, social post, etc.).",
    input_schema: {
      type: "object",
      properties: {
        type: { type: "string", description: "One of the Content types, e.g. BLOG_POST, LINKEDIN_POST, GOOGLE_AD" },
        brief: { type: "string", description: "What this piece is for and any specifics to include" },
      },
      required: ["type", "brief"],
    },
  },
];

async function executeTool(workspaceId: string, name: string, input: Record<string, unknown>) {
  switch (name) {
    case "run_market_research":
      return runMarketResearch(workspaceId);
    case "run_competitor_analysis":
      return runCompetitorAnalysis(workspaceId, input.competitorNames as string[]);
    case "run_customer_intelligence":
      return runCustomerIntelligence(workspaceId);
    case "run_marketing_strategy":
      return runMarketingStrategy(workspaceId);
    case "run_content_planner":
      return runContentPlanner(workspaceId);
    case "generate_content":
      return generateContent(workspaceId, input.type as ContentType, input.brief as string);
    default:
      throw new Error(`Unknown capability: ${name}`);
  }
}

/**
 * Sends one user message to the AI Marketing Employee. Internally the
 * manager may delegate to several capabilities before replying — the caller
 * only gets back the final, unified response.
 */
export async function talkToManager(workspaceId: string, userId: string, userMessage: string) {
  let conversation = await db.conversation.findFirst({
    where: { workspaceId, userId },
    orderBy: { createdAt: "desc" },
  });
  if (!conversation) {
    conversation = await db.conversation.create({ data: { workspaceId, userId } });
  }

  const history = await db.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  await db.message.create({
    data: { conversationId: conversation.id, role: "USER", content: userMessage },
  });

  const context = await getWorkspaceContext(workspaceId);
  const system = `${MANAGER_PROMPT}\n\n## Workspace memory\n\n${serializeContext(context)}`;

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({
      role: (m.role === "USER" ? "user" : "assistant") as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: userMessage },
  ];

  let finalText = "";
  for (let turn = 0; turn < 4; turn++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system,
      tools,
      messages,
    });

    const toolUses = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    if (toolUses.length === 0) {
      finalText = text;
      break;
    }

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
      toolUses.map(async (t) => {
        try {
          const result = await executeTool(workspaceId, t.name, t.input as Record<string, unknown>);
          return { type: "tool_result", tool_use_id: t.id, content: JSON.stringify(result) };
        } catch (err) {
          return {
            type: "tool_result",
            tool_use_id: t.id,
            content: `Error: ${(err as Error).message}`,
            is_error: true,
          };
        }
      }),
    );

    messages.push({ role: "user", content: toolResults });

    if (response.stop_reason !== "tool_use") {
      finalText = text;
      break;
    }
  }

  const saved = await db.message.create({
    data: { conversationId: conversation.id, role: "ASSISTANT", content: finalText },
  });

  return saved;
}
