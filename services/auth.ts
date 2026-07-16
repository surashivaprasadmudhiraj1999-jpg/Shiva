import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

/** Ensures a Clerk-authenticated visitor has a matching row in our own User table. */
export async function syncCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

  return db.user.upsert({
    where: { clerkId: clerkUser.id },
    create: {
      clerkId: clerkUser.id,
      email,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      avatarUrl: clerkUser.imageUrl,
    },
    update: {
      email,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      avatarUrl: clerkUser.imageUrl,
    },
  });
}

/** Requires an authenticated user; redirects to sign-in otherwise. */
export async function requireUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await syncCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

/** Returns the user's first workspace, creating a default organization if needed. */
export async function getOrCreateDefaultWorkspace(userId: string) {
  const membership = await db.organizationMember.findFirst({
    where: { userId },
    include: { organization: { include: { workspaces: true } } },
    orderBy: { createdAt: "asc" },
  });

  if (membership?.organization.workspaces[0]) {
    return membership.organization.workspaces[0];
  }

  const org =
    membership?.organization ??
    (await db.organization.create({
      data: {
        name: "My Business",
        slug: `workspace-${userId.slice(-8)}-${Date.now().toString(36)}`,
        members: { create: { userId, role: "OWNER" } },
      },
    }));

  return db.workspace.create({
    data: { organizationId: org.id, name: "My Workspace", status: "ONBOARDING" },
  });
}
