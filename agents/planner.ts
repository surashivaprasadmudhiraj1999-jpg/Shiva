import "server-only";
import { db } from "@/lib/db";
import { runCapabilityJSON } from "@/services/anthropic";
import { getWorkspaceContext, serializeContext } from "@/lib/workspace-context";
import { daysFromNow } from "@/utils/date";

interface ContentPlanResult {
  title: string;
  periodStart: string;
  periodEnd: string;
  weeks: {
    week: number;
    theme: string;
    items: { day: string; type: string; title: string; channel: string }[];
  }[];
  dailyPriorities: { title: string; description: string | null; priority: "LOW" | "MEDIUM" | "HIGH" }[];
}

/** Turns the active strategy into a 30-day content calendar plus today's task list. */
export async function runContentPlanner(workspaceId: string) {
  const context = await getWorkspaceContext(workspaceId);
  if (!context.strategy) {
    throw new Error("Cannot plan content with no active marketing strategy yet");
  }

  const result = await runCapabilityJSON<ContentPlanResult>(
    "planner",
    serializeContext(context),
    { maxTokens: 8000 },
  );

  const calendar = await db.contentCalendar.create({
    data: {
      workspaceId,
      title: result.title,
      periodStart: new Date(result.periodStart),
      periodEnd: new Date(result.periodEnd ?? daysFromNow(30)),
      plan: { weeks: result.weeks },
    },
  });

  await db.task.createMany({
    data: result.dailyPriorities.map((p) => ({
      workspaceId,
      title: p.title,
      description: p.description,
      priority: p.priority,
      source: "ai",
    })),
  });

  return calendar;
}
