import "server-only";
import { db } from "@/lib/db";
import { runCapabilityJSON } from "@/services/anthropic";
import { getWorkspaceContext, serializeContext } from "@/lib/workspace-context";

interface MarketResearchResult {
  title: string;
  summary: string;
  painPoints: string[];
  buyingTriggers: string[];
  faqs: string[];
  trends: string[];
  searchDemand: string[];
  seasonality: string | null;
  language: string[];
  sources: { title: string; url: string | null }[];
}

/** Runs market research for a workspace using everything already in memory. */
export async function runMarketResearch(workspaceId: string) {
  const context = await getWorkspaceContext(workspaceId);
  if (!context.businessProfile) {
    throw new Error("Cannot research a workspace with no business profile yet");
  }

  const result = await runCapabilityJSON<MarketResearchResult>(
    "research",
    serializeContext(context),
    { maxTokens: 6000 },
  );

  return db.research.create({
    data: {
      workspaceId,
      type: "MARKET",
      title: result.title,
      summary: result.summary,
      content: {
        painPoints: result.painPoints,
        buyingTriggers: result.buyingTriggers,
        faqs: result.faqs,
        trends: result.trends,
        searchDemand: result.searchDemand,
        seasonality: result.seasonality,
        language: result.language,
      },
      sources: result.sources,
    },
  });
}
