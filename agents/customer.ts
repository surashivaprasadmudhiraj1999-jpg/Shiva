import "server-only";
import { db } from "@/lib/db";
import { runCapabilityJSON } from "@/services/anthropic";
import { getWorkspaceContext, serializeContext } from "@/lib/workspace-context";
import { toJson } from "@/utils/json";
import type { PersonaProfile } from "@/types";

/** Builds ideal customer personas from everything known about the business so far. */
export async function runCustomerIntelligence(workspaceId: string) {
  const context = await getWorkspaceContext(workspaceId);
  if (!context.businessProfile) {
    throw new Error("Cannot build personas with no business profile yet");
  }

  const personas = await runCapabilityJSON<PersonaProfile[]>(
    "customer",
    serializeContext(context),
    { maxTokens: 6000 },
  );

  return Promise.all(
    personas.map((p) =>
      db.customerPersona.create({
        data: {
          workspaceId,
          name: p.name,
          demographics: toJson(p.demographics),
          psychographics: toJson(p.psychographics),
          goals: p.goals,
          painPoints: p.painPoints,
          frustrations: p.frustrations,
          dreamOutcomes: p.dreamOutcomes,
          buyingMotivations: p.buyingMotivations,
          objections: p.objections,
          favoritePlatforms: p.favoritePlatforms,
          decisionTriggers: p.decisionTriggers,
        },
      }),
    ),
  );
}
