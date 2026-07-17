import "server-only";
import { db } from "@/lib/db";
import { runCapabilityJSON } from "@/services/anthropic";
import { getWorkspaceContext, serializeContext } from "@/lib/workspace-context";
import { toJson } from "@/utils/json";
import type { CompetitorProfile } from "@/types";

/** Analyzes the given competitors (by name or URL) against the business's context. */
export async function runCompetitorAnalysis(workspaceId: string, competitorNames: string[]) {
  const context = await getWorkspaceContext(workspaceId);
  if (!context.businessProfile) {
    throw new Error("Cannot analyze competitors with no business profile yet");
  }

  const input = serializeContext(context) + `\n\nCompetitors to analyze:\n${competitorNames.join("\n")}`;

  const results = await runCapabilityJSON<CompetitorProfile[]>("competitors", input, {
    maxTokens: 6000,
  });

  return Promise.all(
    results.map((c) =>
      db.competitor.create({
        data: {
          workspaceId,
          name: c.name,
          website: c.website,
          pricing: toJson(c.pricing ?? {}),
          strengths: c.strengths,
          weaknesses: c.weaknesses,
          positioning: c.positioning,
          messaging: c.messaging,
          opportunities: c.opportunities,
        },
      }),
    ),
  );
}
