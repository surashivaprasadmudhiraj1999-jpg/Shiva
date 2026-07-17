import "server-only";
import { db } from "@/lib/db";
import { runCapabilityJSON } from "@/services/anthropic";
import type { KnowledgeType } from "@prisma/client";

interface LearnedMemory {
  type: KnowledgeType;
  content: string;
  metadata: { sourceType: string; confidence: "high" | "medium" | "low" };
}

/**
 * Distills a significant event (content published, campaign completed, a
 * decision made) into permanent memory. The AI should never ask the same
 * question twice — this is how it remembers.
 */
export async function recordLearning(workspaceId: string, sourceType: string, sourceText: string) {
  const learned = await runCapabilityJSON<LearnedMemory>(
    "learning",
    `Source type: ${sourceType}\n\n${sourceText}`,
    { maxTokens: 1024 },
  );

  return db.knowledge.create({
    data: {
      workspaceId,
      type: learned.type,
      content: learned.content,
      metadata: learned.metadata,
    },
  });
}
