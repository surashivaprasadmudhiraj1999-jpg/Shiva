"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser, getOrCreateDefaultWorkspace } from "@/services/auth";
import { understandBusiness } from "@/agents/business";
import { runMarketResearch } from "@/agents/research";
import { runCompetitorAnalysis } from "@/agents/competitors";
import { runCustomerIntelligence } from "@/agents/customer";
import { runMarketingStrategy } from "@/agents/strategy";
import { runContentPlanner } from "@/agents/planner";
import type { OnboardingAnswers } from "@/types";

/**
 * Runs the full onboarding pipeline once: business understanding -> research
 * -> competitor analysis -> customer personas -> strategy -> content plan.
 * This is the "AI researches, thinks, and plans" step from the product vision.
 */
export async function completeOnboarding(answers: OnboardingAnswers) {
  const user = await requireUser();
  const workspace = await getOrCreateDefaultWorkspace(user.id);

  await understandBusiness(workspace.id, answers);

  const competitorNames = (answers.competitors ?? "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  await runMarketResearch(workspace.id);
  if (competitorNames.length > 0) {
    await runCompetitorAnalysis(workspace.id, competitorNames);
  }
  await runCustomerIntelligence(workspace.id);
  await runMarketingStrategy(workspace.id);
  await runContentPlanner(workspace.id);

  await db.workspace.update({
    where: { id: workspace.id },
    data: { status: "ACTIVE" },
  });

  revalidatePath("/dashboard");
  return { workspaceId: workspace.id };
}
