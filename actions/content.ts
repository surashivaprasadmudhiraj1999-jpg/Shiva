"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/services/auth";
import { db } from "@/lib/db";
import { generateContent as runContentGeneration } from "@/agents/content";
import type { ContentType, ContentStatus } from "@prisma/client";

export async function createContent(workspaceId: string, type: ContentType, brief: string) {
  await requireUser();
  const content = await runContentGeneration(workspaceId, type, brief);
  revalidatePath("/dashboard/content");
  return content;
}

export async function updateContentStatus(contentId: string, status: ContentStatus) {
  await requireUser();
  await db.content.update({ where: { id: contentId }, data: { status } });
  revalidatePath("/dashboard/content");
}

export async function listContent(workspaceId: string) {
  await requireUser();
  return db.content.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" } });
}
