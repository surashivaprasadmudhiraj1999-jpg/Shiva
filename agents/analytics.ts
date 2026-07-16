import "server-only";
import { db } from "@/lib/db";
import { runCapabilityJSON } from "@/services/anthropic";
import { getWorkspaceContext, serializeContext } from "@/lib/workspace-context";
import { toJson } from "@/utils/json";

interface AnalyticsResult {
  headline: string;
  insights: { metric: string; observation: string; recommendation: string }[];
  risks: string[];
  quickWins: string[];
}

/** Turns raw performance metrics into decisions, benchmarked against the active strategy's KPIs. */
export async function analyzePerformance(
  workspaceId: string,
  source: string,
  metrics: Record<string, unknown>,
  period: { start: Date; end: Date },
) {
  const context = await getWorkspaceContext(workspaceId);

  const input = `${serializeContext(context)}\n\nSource: ${source}\nMetrics:\n${JSON.stringify(metrics, null, 2)}`;

  const result = await runCapabilityJSON<AnalyticsResult>("analytics", input, { maxTokens: 4096 });

  await db.analytics.create({
    data: {
      workspaceId,
      source,
      metrics: toJson(metrics),
      periodStart: period.start,
      periodEnd: period.end,
      insights: result.headline,
    },
  });

  return result;
}
