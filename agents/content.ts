import "server-only";
import { db } from "@/lib/db";
import { runCapabilityJSON } from "@/services/anthropic";
import { getWorkspaceContext, serializeContext } from "@/lib/workspace-context";
import type { ContentType } from "@prisma/client";

interface GeneratedContent {
  type: string;
  title: string;
  body: string;
  metadata: { keywords: string[]; cta: string; tone: string; channel: string };
}

/** Generates one piece of marketing content in the business's own brand voice. */
export async function generateContent(
  workspaceId: string,
  type: ContentType,
  brief: string,
  opts: { contentCalendarId?: string; campaignId?: string } = {},
) {
  const context = await getWorkspaceContext(workspaceId);
  if (!context.businessProfile) {
    throw new Error("Cannot generate content with no business profile yet");
  }

  const input = `${serializeContext(context)}\n\nRequested content type: ${type}\nBrief: ${brief}`;

  const generated = await runCapabilityJSON<GeneratedContent>("content", input, {
    maxTokens: 4096,
  });

  return db.content.create({
    data: {
      workspaceId,
      contentCalendarId: opts.contentCalendarId,
      campaignId: opts.campaignId,
      type,
      status: "DRAFT",
      title: generated.title,
      body: generated.body,
      metadata: generated.metadata,
    },
  });
}
