import "server-only";
import { db } from "@/lib/db";
import { runCapabilityJSON } from "@/services/anthropic";
import { getWorkspaceContext, serializeContext } from "@/lib/workspace-context";
import { toJson } from "@/utils/json";
import type { StrategyPlan } from "@/types";

/** Builds the marketing strategy from research, competitors, and personas already in memory. */
export async function runMarketingStrategy(workspaceId: string) {
  const context = await getWorkspaceContext(workspaceId);
  if (!context.businessProfile) {
    throw new Error("Cannot build a strategy with no business profile yet");
  }

  const plan = await runCapabilityJSON<StrategyPlan>("strategy", serializeContext(context), {
    maxTokens: 8000,
  });

  // Archive any previously active strategy — only one strategy drives execution at a time.
  await db.marketingStrategy.updateMany({
    where: { workspaceId, status: "ACTIVE" },
    data: { status: "ARCHIVED" },
  });

  return db.marketingStrategy.create({
    data: {
      workspaceId,
      title: plan.title,
      status: "ACTIVE",
      overview: plan.overview,
      seoStrategy: toJson(plan.seoStrategy),
      socialStrategy: toJson(plan.socialStrategy),
      emailStrategy: toJson(plan.emailStrategy),
      contentStrategy: toJson(plan.contentStrategy),
      ninetyDayPlan: toJson(plan.ninetyDayPlan),
      quarterlyGoals: toJson(plan.quarterlyGoals),
      priorityChannels: plan.priorityChannels,
      kpis: toJson(plan.kpis),
    },
  });
}
