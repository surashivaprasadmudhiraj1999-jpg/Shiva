import { inngest } from "@/services/inngest";
import { db } from "@/lib/db";
import { runMarketResearch } from "@/agents/research";
import { runCompetitorAnalysis } from "@/agents/competitors";
import { runCustomerIntelligence } from "@/agents/customer";
import { runMarketingStrategy } from "@/agents/strategy";
import { runContentPlanner } from "@/agents/planner";

/**
 * Background version of the onboarding pipeline. The onboarding server
 * action runs this inline for the MVP demo path; in production, send the
 * "workspace/onboarding.completed" event instead so long-running research
 * doesn't block the request.
 */
export const runOnboardingPipeline = inngest.createFunction(
  { id: "run-onboarding-pipeline", triggers: [{ event: "workspace/onboarding.completed" }] },
  async ({ event, step }) => {
    const { workspaceId, competitorNames } = event.data as {
      workspaceId: string;
      competitorNames: string[];
    };

    await step.run("market-research", () => runMarketResearch(workspaceId));

    if (competitorNames.length > 0) {
      await step.run("competitor-analysis", () => runCompetitorAnalysis(workspaceId, competitorNames));
    }

    await step.run("customer-intelligence", () => runCustomerIntelligence(workspaceId));
    await step.run("marketing-strategy", () => runMarketingStrategy(workspaceId));
    await step.run("content-planner", () => runContentPlanner(workspaceId));

    await step.run("activate-workspace", () =>
      db.workspace.update({ where: { id: workspaceId }, data: { status: "ACTIVE" } }),
    );

    return { workspaceId, status: "complete" };
  },
);

/** Refreshes the content calendar and daily priorities every morning. */
export const dailyPlanningRefresh = inngest.createFunction(
  { id: "daily-planning-refresh", triggers: [{ cron: "0 6 * * *" }] },
  async ({ step }) => {
    const activeWorkspaces = await step.run("find-active-workspaces", () =>
      db.workspace.findMany({ where: { status: "ACTIVE" }, select: { id: true } }),
    );

    for (const workspace of activeWorkspaces) {
      await step.run(`replan-${workspace.id}`, () => runContentPlanner(workspace.id));
    }

    return { refreshed: activeWorkspaces.length };
  },
);

export const functions = [runOnboardingPipeline, dailyPlanningRefresh];
