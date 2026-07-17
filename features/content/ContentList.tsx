"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ContentItem {
  id: string;
  type: string;
  status: string;
  title: string;
  body: string;
  createdAt: string;
}

function download(item: ContentItem) {
  const blob = new Blob([`# ${item.title}\n\n${item.body}`], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${item.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ContentList({ items }: { items: ContentItem[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (items.length === 0) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">No content generated yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
              <p className="text-xs uppercase tracking-wide text-neutral-400">{item.type.replace(/_/g, " ")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={item.status === "PUBLISHED" ? "success" : "neutral"}>{item.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                {expanded === item.id ? "Hide" : "View"}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => download(item)}>Export</Button>
            </div>
          </div>
          {expanded === item.id && (
            <div className="mt-3 whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
              {item.body}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
