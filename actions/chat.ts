"use server";

import { requireUser } from "@/services/auth";
import { db } from "@/lib/db";
import { talkToManager } from "@/agents/manager";

export async function sendMessage(workspaceId: string, message: string) {
  const user = await requireUser();
  return talkToManager(workspaceId, user.id, message);
}

export async function getConversationHistory(workspaceId: string, userId: string) {
  const conversation = await db.conversation.findFirst({
    where: { workspaceId, userId },
    orderBy: { createdAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  return conversation?.messages ?? [];
}
