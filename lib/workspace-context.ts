import "server-only";
import { db } from "@/lib/db";

/**
 * Compact snapshot of everything the AI already knows about a workspace.
 * Every capability call includes this so the AI never asks a question its
 * own memory already answers.
 */
export async function getWorkspaceContext(workspaceId: string) {
  const [businessProfile, competitors, personas, strategy, research] = await Promise.all([
    db.businessProfile.findUnique({ where: { workspaceId } }),
    db.competitor.findMany({ where: { workspaceId }, take: 10 }),
    db.customerPersona.findMany({ where: { workspaceId }, take: 5 }),
    db.marketingStrategy.findFirst({
      where: { workspaceId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }),
    db.research.findMany({ where: { workspaceId }, take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  return { businessProfile, competitors, personas, strategy, research };
}

export type WorkspaceContext = Awaited<ReturnType<typeof getWorkspaceContext>>;

export function serializeContext(context: WorkspaceContext): string {
  return JSON.stringify(
    {
      business: context.businessProfile,
      competitors: context.competitors,
      personas: context.personas,
      activeStrategy: context.strategy,
      recentResearch: context.research,
    },
    null,
    2,
  );
}
