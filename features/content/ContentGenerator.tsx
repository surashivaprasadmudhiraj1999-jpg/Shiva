"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createContent } from "@/actions/content";
import type { ContentType } from "@prisma/client";

const CONTENT_TYPES: ContentType[] = [
  "BLOG_POST", "LANDING_PAGE", "LINKEDIN_POST", "TWITTER_POST", "REDDIT_POST",
  "EMAIL_NEWSLETTER", "COLD_EMAIL", "FACEBOOK_AD", "GOOGLE_AD", "META_AD",
  "INSTAGRAM_CAPTION", "CASE_STUDY", "PRESS_RELEASE", "PRODUCT_DESCRIPTION",
  "VIDEO_SCRIPT", "YOUTUBE_DESCRIPTION", "LEAD_MAGNET",
];

export function ContentGenerator({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [type, setType] = useState<ContentType>("BLOG_POST");
  const [brief, setBrief] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      try {
        await createContent(workspaceId, type, brief);
        setBrief("");
        router.refresh();
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content-type">Content type</Label>
        <select
          id="content-type"
          value={type}
          onChange={(e) => setType(e.target.value as ContentType)}
          className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        >
          {CONTENT_TYPES.map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="brief">What&apos;s this for?</Label>
        <Textarea
          id="brief"
          rows={3}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="e.g. Announce our new pricing tier to existing customers"
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <Button onClick={handleGenerate} disabled={isPending || !brief}>
        {isPending ? "Writing…" : "Generate content"}
      </Button>
    </div>
  );
}
