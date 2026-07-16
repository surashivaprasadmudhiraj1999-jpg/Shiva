"use server";

import { requireUser, getOrCreateDefaultWorkspace } from "@/services/auth";
import { db } from "@/lib/db";

export async function getCurrentWorkspace() {
  const user = await requireUser();
  return getOrCreateDefaultWorkspace(user.id);
}

export async function getDashboardData(workspaceId: string) {
  const [tasks, businessProfile, strategy, recentContent] = await Promise.all([
    db.task.findMany({
      where: { workspaceId, status: { in: ["TODO", "IN_PROGRESS"] } },
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
      take: 8,
    }),
    db.businessProfile.findUnique({ where: { workspaceId } }),
    db.marketingStrategy.findFirst({ where: { workspaceId, status: "ACTIVE" } }),
    db.content.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return { tasks, businessProfile, strategy, recentContent };
}

export async function toggleTaskStatus(taskId: string, done: boolean) {
  await requireUser();
  await db.task.update({
    where: { id: taskId },
    data: { status: done ? "DONE" : "TODO" },
  });
}
